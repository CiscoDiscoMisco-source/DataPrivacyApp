import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Company } from '@/models/company';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import dataService from '@/services/dataService';

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
        <Card key={company.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{company.name}</CardTitle>
                <CardDescription className="mt-1">{company.industry}</CardDescription>
              </div>
              {company.logo && (
                <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
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
            <p className="text-sm mb-4">{company.description}</p>
            <p className="text-sm text-muted-foreground mb-2">
              Data sharing policies: <strong>{company.dataSharingPolicies.length}</strong>
            </p>
            <div className="flex gap-2 mt-4">
              <Button asChild size="sm" variant="default">
                <Link href={`/companies/${company.id}`}>View Details</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href={`/companies/${company.id}/preferences`}>Manage Preferences</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 