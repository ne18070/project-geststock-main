interface RequestOptions extends RequestInit {
    params?: Record<string, string | number>;
    data?: unknown;
      headers?:Record<string, string>;
    isFormData?: boolean;
    useToken?: boolean
  }
  
  class ApiRequest {
    private readonly baseURL: string;
      private readonly getToken: () => Promise<string | null>;
  
      constructor(baseURL: string, getToken?:() => Promise<string | null> ) {
          this.baseURL = baseURL;
          this.getToken = getToken || (async () => null);
      }
  
  
    private buildUrl(url: string, params?: Record<string, string | number>): string {
      const urlWithBase = `${this.baseURL}${url}`;
      if (!params) return urlWithBase;
  
      const urlParams = new URLSearchParams();
      for (const key in params) {
        urlParams.append(key, String(params[key]));
      }
      return `${urlWithBase}?${urlParams.toString()}`;
    }
  
      private async handleResponse(response: Response): Promise<unknown> {
          if (!response.ok) {
              let errorMessage = `API request failed with status ${response.status}`;
  
              try {
                  const errorBody = await response.json();
                  errorMessage = `${errorMessage} : ${JSON.stringify(errorBody)}`;
              } catch (error) {
                  console.warn('Error parsing error response body', error)
                  // If we cannot parse the error, just use the status
              }
              throw new Error(errorMessage);
          }
  
          try {
              return await response.json();
          } catch {
              return await response.text()
          }
  
      }
  
  
    public async request(
      url: string,
      method: string,
      options?: RequestOptions,
    ): Promise<unknown> {
         const fetchUrl = this.buildUrl(url, options?.params)
      let headers = options?.headers ||  { 'Content-Type': 'application/json' }; // Default to json, allow override
  
      if(options?.useToken){
            const token = await this.getToken()
           if(token){
               headers = {
                   ...headers,
                   'Authorization': `Bearer ${token}`
               }
           }
        }
  
  
      const fetchOptions: RequestInit = {
          method,
        headers, // Use the modified headers
        ...options,
      };
  
  
      if (options?.data) {
          if(options.isFormData){
              fetchOptions.body = options.data as BodyInit
          } else {
              fetchOptions.body = JSON.stringify(options.data);
          }
      }
  
  
      const response = await fetch(fetchUrl, fetchOptions);
      return this.handleResponse(response);
    }
  
    public async get<T>(url: string, options?: RequestOptions): Promise<T> {
      return this.request(url, 'GET', options) as Promise<T>;
    }
  
    public async post<T>(url: string, data: Record<string, unknown>, options?: RequestOptions): Promise<T> {
      return this.request(url, 'POST', { ...options, data }) as Promise<T>;
    }
  
    public async put<T>(url: string, data: Record<string, unknown>, options?: RequestOptions): Promise<T> {
      return this.request(url, 'PUT', { ...options, data }) as Promise<T>;
    }
  
     public async patch<T>(url: string, data: Record<string, unknown>, options?: RequestOptions): Promise<T> {
          return this.request(url, 'PATCH', { ...options, data }) as Promise<T>;
      }
  
    public async delete<T>(url: string, options?: RequestOptions): Promise<T> {
      return this.request(url, 'DELETE', options) as Promise<T>;
    }
  }
  
  export default ApiRequest;