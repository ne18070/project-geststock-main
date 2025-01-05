'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface Company {
  id: string;
  name: string;
  theme: {
    primaryColor: string;
    logo?: string;
  };
}

interface CompanyStore {
  currentCompany: Company | null;
  companies: Company[];
  changeCompany: (companyId: string) => void;
  setCompanies: (companies: Company[]) => void;
}

export const useCompany = create<CompanyStore>()(
  persist(
    (set) => ({
      currentCompany: null,
      companies: [
        {
          id: '1',
          name: 'Nestle',
          theme: {
            primaryColor: '#ba5b38',
          },
        },
        {
          id: '2',
          name: 'Sofiex',
          theme: {
            primaryColor: '#52c41a',
          },
        },
      ],
      changeCompany: (companyId) => {
        set((state) => ({
          currentCompany:
            state.companies.find((c) => c.id === companyId) || null,
        }));
      },
      setCompanies: (companies) => {
        set({ companies });
      },
    }),
    {
      name: 'company-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
