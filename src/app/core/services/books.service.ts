import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book, BookResponse } from '../models/book.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/books`;

    private getHeaders(): HttpHeaders {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'x-user-role': user?.role || 'student', // 👈 enviamos el rol
      'x-user-id': user?.id
    });
  }
  
  getBooks(query?: string): Observable<BookResponse> {
    let params = new HttpParams();
    if (query) {
      params = params.set('q', query);
    }
    return this.http.get<BookResponse>(this.apiUrl, { params, headers: this.getHeaders()});
  }

  getBook(id: string): Observable<BookResponse> {
    return this.http.get<BookResponse>(`${this.apiUrl}/${id}`,{
      headers: this.getHeaders()
    });
  }

  createBook(book: Book): Observable<BookResponse> {
    return this.http.post<BookResponse>(this.apiUrl, book,  {
      headers: this.getHeaders()
    });
  }

  updateBook(id: string, book: Partial<Book>): Observable<BookResponse> {
    return this.http.put<BookResponse>(`${this.apiUrl}/${id}`, book, {
      headers: this.getHeaders()
    });
  }

  deleteBook(id: string): Observable<BookResponse> {
    return this.http.delete<BookResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}
