import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { BooksService } from '../../core/services/books.service';
import { AuthService } from '../../core/services/auth.service';
import { Book } from '../../core/models/book.model';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatChipsModule
  ],
  template: `
    <div class="books-container">
      <div class="header">
        <h1>Catálogo de Libros</h1>
        <button mat-raised-button color="primary" *ngIf="isAdmin" (click)="createBook()">
          <mat-icon>add</mat-icon>
          Nuevo Libro
        </button>
      </div>

      <div class="search-bar">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar libros</mat-label>
          <input matInput [(ngModel)]="searchQuery" (ngModelChange)="onSearch()" 
                 placeholder="Buscar por título...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>

      <div class="books-grid" *ngIf="books.length > 0; else noBooks">
        <mat-card *ngFor="let book of books" class="book-card">
          <mat-card-header>
            <mat-card-title>{{ book.title }}</mat-card-title>
            <mat-card-subtitle>{{ book.author }}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <p><strong>Categoría:</strong> {{ book.category }}</p>
            <p><strong>Stock Total:</strong> {{ book.stock }}</p>
            <p><strong>Disponibles:</strong> 
              <span [class.text-success]="(book.available || 0) > 0" 
                    [class.text-danger]="(book.available || 0) === 0">
                {{ book.available || book.stock }}
              </span>
            </p>
            <mat-chip-set>
              <mat-chip [color]="(book.available || book.stock) > 0 ? 'primary' : 'warn'" 
                        [highlighted]="true">
                {{ (book.available || book.stock) > 0 ? 'Disponible' : 'No disponible' }}
              </mat-chip>
            </mat-chip-set>
          </mat-card-content>

          <mat-card-actions *ngIf="isAdmin">
            <button mat-button color="primary" (click)="editBook(book)">
              <mat-icon>edit</mat-icon>
              Editar
            </button>
            <button mat-button color="warn" (click)="deleteBook(book)">
              <mat-icon>delete</mat-icon>
              Eliminar
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <ng-template #noBooks>
        <div class="no-books">
          <mat-icon>menu_book</mat-icon>
          <p>No se encontraron libros</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .books-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    h1 {
      margin: 0;
      color: #333;
    }

    .search-bar {
      margin-bottom: 24px;
    }

    .search-field {
      width: 100%;
      max-width: 500px;
    }

    .books-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .book-card {
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .book-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    }

    mat-card-header {
      margin-bottom: 16px;
    }

    mat-card-title {
      font-size: 18px;
      font-weight: 600;
    }

    mat-card-content p {
      margin: 8px 0;
    }

    mat-chip-set {
      margin-top: 12px;
    }

    .text-success {
      color: #4caf50;
      font-weight: 600;
    }

    .text-danger {
      color: #f44336;
      font-weight: 600;
    }

    mat-card-actions {
      display: flex;
      gap: 8px;
      padding: 16px;
      border-top: 1px solid #e0e0e0;
    }

    .no-books {
      text-align: center;
      padding: 48px;
      color: #999;
    }

    .no-books mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }

    .no-books p {
      font-size: 18px;
    }
  `]
})
export class BooksListComponent implements OnInit {
  private booksService = inject(BooksService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  books: Book[] = [];
  searchQuery = '';

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.booksService.getBooks(this.searchQuery).subscribe({
      next: (response) => {
        if (response.success && response.books) {
          this.books = response.books;
        }
      },
      error: (error) => {
        this.snackBar.open('Error al cargar libros', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onSearch(): void {
    this.loadBooks();
  }

  createBook(): void {
    this.router.navigate(['/books/new']);
  }

  editBook(book: Book): void {
    this.router.navigate(['/books/edit', book._id]);
  }

  deleteBook(book: Book): void {
    if (confirm(`¿Estás seguro de eliminar el libro "${book.title}"?`)) {
      this.booksService.deleteBook(book._id!).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open(response.message || 'Libro eliminado', 'Cerrar', { duration: 3000 });
            this.loadBooks();
          }
        },
        error: (error) => {
          const message = error.error?.message || 'Error al eliminar libro';
          this.snackBar.open(message, 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}
