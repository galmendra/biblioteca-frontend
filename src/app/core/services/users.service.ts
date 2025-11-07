import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;
  
      private getHeaders(): HttpHeaders {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'x-user-role': user?.role || 'student', // 👈 enviamos el rol
      'x-user-id': user?.id
    });
  }
  getUsers(): Observable<{ success: boolean; users: User[] }> {
    return this.http.get<{ success: boolean; users: User[] }>(this.apiUrl,{
      headers: this.getHeaders()
    });
  }

  getUser(id: string): Observable<{ success: boolean; user: User }> {
    return this.http.get<{ success: boolean; user: User }>(`${this.apiUrl}/${id}`,{
      headers: this.getHeaders()
    });
  }
}
