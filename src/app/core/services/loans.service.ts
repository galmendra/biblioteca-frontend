import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loan, LoanResponse, CreateLoanRequest } from '../models/loan.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoansService {
  private http = inject(HttpClient);
  private apiUrl =`${environment.apiUrl}/loans`;

      private getHeaders(): HttpHeaders {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'x-user-role': user?.role || 'student', // 👈 enviamos el rol
      'x-user-id': user?.id
    });
  }
  getAllLoans(): Observable<LoanResponse> {
    return this.http.get<LoanResponse>(this.apiUrl,{
      headers: this.getHeaders()
    });
  }

  getMyLoans(): Observable<LoanResponse> {
    return this.http.get<LoanResponse>(`${this.apiUrl}/my`,{
      headers: this.getHeaders()
    });
  }

  createLoan(loanData: CreateLoanRequest): Observable<LoanResponse> {
    return this.http.post<LoanResponse>(this.apiUrl, loanData,{
      headers: this.getHeaders()
    });
  }

  returnLoan(id: string): Observable<LoanResponse> {
    return this.http.put<LoanResponse>(`${this.apiUrl}/${id}/return`, {},{
      headers: this.getHeaders()
    });
  }
}
