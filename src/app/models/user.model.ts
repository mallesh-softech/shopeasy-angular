export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface Address {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}
