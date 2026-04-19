export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  status: 'active' | 'inactive';
  createdDate: string;
  avatar?: string;
}
