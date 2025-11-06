export interface User {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'student';
  createdAt?: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'admin' | 'student';
}
