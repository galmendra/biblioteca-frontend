import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BooksService } from '../../core/services/books.service';
import { Book } from '../../core/models/book.model';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <div class="form-container">
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>{{ isEditMode ? 'Editar Libro' : 'Nuevo Libro' }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="bookForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Título</mat-label>
              <input matInput formControlName="title" placeholder="Título del libro">
              <mat-error *ngIf="bookForm.get('title')?.hasError('required')">
                El título es requerido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Autor</mat-label>
              <input matInput formControlName="author" placeholder="Nombre del autor">
              <mat-error *ngIf="bookForm.get('author')?.hasError('required')">
                El autor es requerido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Categoría</mat-label>
              <input matInput formControlName="category" placeholder="Ej: Novela, Ciencia, etc.">
              <mat-error *ngIf="bookForm.get('category')?.hasError('required')">
                La categoría es requerida
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Stock</mat-label>
              <input matInput type="number" formControlName="stock" placeholder="0">
              <mat-error *ngIf="bookForm.get('stock')?.hasError('required')">
                El stock es requerido
              </mat-error>
              <mat-error *ngIf="bookForm.get('stock')?.hasError('min')">
                El stock debe ser al menos 0
              </mat-error>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="cancel()">Cancelar</button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="bookForm.invalid || loading">
                {{ loading ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container {
      display: flex;
      justify-content: center;
      padding: 24px;
      min-height: calc(100vh - 64px);
      align-items: flex-start;
      padding-top: 48px;
    }

    .form-card {
      width: 100%;
      max-width: 600px;
    }

    mat-card-header {
      margin-bottom: 24px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 16px;
    }
  `]
})
export class BookFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private booksService = inject(BooksService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  bookForm: FormGroup;
  loading = false;
  isEditMode = false;
  bookId: string | null = null;

  constructor() {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      category: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id');
    if (this.bookId) {
      this.isEditMode = true;
      this.loadBook();
    }
  }

  loadBook(): void {
    if (!this.bookId) return;

    this.booksService.getBook(this.bookId).subscribe({
      next: (response) => {
        if (response.success && response.book) {
          this.bookForm.patchValue(response.book);
        }
      },
      error: (error) => {
        this.snackBar.open('Error al cargar el libro', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/books']);
      }
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      this.loading = true;
      const bookData = this.bookForm.value;

      const request = this.isEditMode
        ? this.booksService.updateBook(this.bookId!, bookData)
        : this.booksService.createBook(bookData);

      request.subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.snackBar.open(
              response.message || (this.isEditMode ? 'Libro actualizado' : 'Libro creado'),
              'Cerrar',
              { duration: 3000 }
            );
            this.router.navigate(['/books']);
          }
        },
        error: (error) => {
          this.loading = false;
          const message = error.error?.message || 'Error al guardar el libro';
          this.snackBar.open(message, 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/books']);
  }
}
