export interface Company {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  description: string;
  dataSharingPolicies: DataSharingPolicy[];
}

export interface DataSharingPolicy {
  id: string;
  dataType: string;
  purpose: string;
  thirdParties: string[];
  description: string;
} 