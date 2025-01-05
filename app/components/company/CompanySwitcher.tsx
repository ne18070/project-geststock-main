'use client';

import { Select } from 'antd';
import { useCompany } from '@/app/hooks/useCompany';

export default function CompanySwitcher() {
  const { currentCompany, companies, changeCompany } = useCompany(); // Fixed typo here
  // Only show for secretary role
  //   if (session?.user?.role !== 'secretary') {
  //     return null;
  //   }
  return (
    <Select
      value={currentCompany?.id}
      onChange={(value) => changeCompany(value)}
      style={{ width: 200 }}
      options={companies.map((company) => ({
        value: company.id,
        label: company.name,
      }))}
      placeholder="Sélectionner une compagnie"
    />
  );
}
