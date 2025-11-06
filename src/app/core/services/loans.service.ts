import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loan, LoanResponse, CreateLoanRequest } from '../models/loan.model';

@Injectable({
  providedIn: 'root'
})
export class LoansService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/loans';

  getAllLoans(): Observable<LoanResponse> {
    return this.http.get<LoanResponse>(this.apiUrl, { withCredentials: true });
  }

  getMyLoans(): Observable<LoanResponse> {
    return this.http.get<LoanResponse>(`${this.apiUrl}/my`, { withCredentials: true });
  }

  createLoan(loanData: CreateLoanRequest): Observable<LoanResponse> {
    return this.http.post<LoanResponse>(this.apiUrl, loanData, { withCredentials: true });
  }

  returnLoan(id: string): Observable<LoanResponse> {
    return this.http.put<LoanResponse>(`${this.apiUrl}/${id}/return`, {}, { withCredentials: true });
  }
}
