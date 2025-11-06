import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book, BookResponse } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/books';

  getBooks(query?: string): Observable<BookResponse> {
    let params = new HttpParams();
    if (query) {
      params = params.set('q', query);
    }
    return this.http.get<BookResponse>(this.apiUrl, { params, withCredentials: true });
  }

  getBook(id: string): Observable<BookResponse> {
    return this.http.get<BookResponse>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  createBook(book: Book): Observable<BookResponse> {
    return this.http.post<BookResponse>(this.apiUrl, book, { withCredentials: true });
  }

  updateBook(id: string, book: Partial<Book>): Observable<BookResponse> {
    return this.http.put<BookResponse>(`${this.apiUrl}/${id}`, book, { withCredentials: true });
  }

  deleteBook(id: string): Observable<BookResponse> {
    return this.http.delete<BookResponse>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
