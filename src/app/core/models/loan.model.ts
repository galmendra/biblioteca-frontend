import { Book } from './book.model';
import { User } from './user.model';

export interface Loan {
  _id?: string;
  book: Book | string;
  user: User | string;
  dueDate: Date | string;
  returned: boolean;
  returnedAt?: Date | string;
  createdAt?: Date;
}

export interface LoanResponse {
  success: boolean;
  message?: string;
  loan?: Loan;
  loans?: Loan[];
}

export interface CreateLoanRequest {
  book: string;
  user: string;
  dueDate: string;
}
