import ApiRequest from '../lib/api-request';
import {getSession} from 'next-auth/react'

export const api = new ApiRequest(process.env.NEXT_PUBLIC_API_URL ?? '', async () => {
     const session = await getSession()
     return session?.user ? session.user.accessToken ?? null : null;
});

export const getCompanyId = async () => {
     const session = await getSession()
     return session?.user ? session.user.company ?? null : null;
}    