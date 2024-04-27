export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface Customer {
  firstName: string;
  lastName: string;
  name: string;
  address: Address;
  phone: string;
  email: string;
  birthday: string;
  gender: number;
  preferredPaymentMethod: number;
  accountNumber: number;
  balance: number;
  creditLimit: number;
  company: string;
  id: string
  isActive: boolean
}
