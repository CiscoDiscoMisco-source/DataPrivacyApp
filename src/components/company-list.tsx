import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Company } from '@/models/company';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import dataService from '@/services/dataService';
import { Eye, Sliders } from 'lucide-react';

interface CompanyListProps {
  companies: Company[];
}

export default function CompanyList({ companies }: CompanyListProps) {
  const getPreferenceStatus = (companyId: string, dataType: string): boolean => {
    return dataService.getEffectivePreference(dataType, companyId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map(company => (
        <Card key={company.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-none">
          <div className="h-2 w-full bg-primary"></div>
          <CardHeader className="relative">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold text-primary">{company.name}</CardTitle>
                <CardDescription className="mt-1 opacity-75">{company.industry}</CardDescription>
              </div>
              {company.logo && (
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center shadow-sm">
                  <img 
                    src={company.logo} 
                    alt={`${company.name} logo`} 
                    className="max-w-full max-h-full p-1" 
                  />
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4 line-clamp-2">{company.description}</p>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm opacity-75">
                  Data sharing policies: <strong>{company.dataSharingPolicies.length}</strong>
                </p>
                <div className="text-xs px-2 py-1 rounded-full bg-secondary">
                  {company.dataSharingPolicies.filter(p => 
                    getPreferenceStatus(company.id, p.dataType)
                  ).length} / {company.dataSharingPolicies.length} allowed
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Button asChild size="sm" variant="default" className="flex-1 gap-1 rounded-full">
                  <Link href={`/companies/${company.id}`}>
                    <Eye className="w-4 h-4" />
                    <span>Details</span>
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="flex-1 gap-1 rounded-full">
                  <Link href={`/companies/${company.id}/preferences`}>
                    <Sliders className="w-4 h-4" />
                    <span>Preferences</span>
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 