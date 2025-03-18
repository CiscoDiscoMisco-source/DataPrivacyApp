export interface User {
  id: string;
  email: string;
  name: string;
  tokens: number;
}

export interface TokenPackage {
  id: string;
  name: string;
  amount: number;
  price: number;
  description: string;
} 