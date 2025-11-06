import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoansService } from '../../core/services/loans.service';
import { BooksService } from '../../core/services/books.service';
import { UsersService } from '../../core/services/users.service';
import { Book } from '../../core/models/book.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  template: `
    <div class="form-container">
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>Nuevo Préstamo</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loanForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Libro</mat-label>
              <mat-select formControlName="book">
                <mat-option *ngFor="let book of availableBooks" [value]="book._id">
                  {{ book.title }} - {{ book.author }} (Disponibles: {{ book.available || book.stock }})
                </mat-option>
              </mat-select>
              <mat-error *ngIf="loanForm.get('book')?.hasError('required')">
                Selecciona un libro
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Usuario</mat-label>
              <mat-select formControlName="user">
                <mat-option *ngFor="let user of users" [value]="user._id">
                  {{ user.firstName }} {{ user.lastName }} ({{ user.email }})
                </mat-option>
              </mat-select>
              <mat-error *ngIf="loanForm.get('user')?.hasError('required')">
                Selecciona un usuario
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Fecha de devolución</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="dueDate" 
                     [min]="minDate">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="loanForm.get('dueDate')?.hasError('required')">
                La fecha de devolución es requerida
              </mat-error>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="cancel()">Cancelar</button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="loanForm.invalid || loading">
                {{ loading ? 'Creando...' : 'Crear Préstamo' }}
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
export class LoanFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private loansService = inject(LoansService);
  private booksService = inject(BooksService);
  private usersService = inject(UsersService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loanForm: FormGroup;
  loading = false;
  availableBooks: Book[] = [];
  users: User[] = [];
  minDate = new Date();

  constructor() {
    this.loanForm = this.fb.group({
      book: ['', Validators.required],
      user: ['', Validators.required],
      dueDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadBooks();
    this.loadUsers();
  }

  loadBooks(): void {
    this.booksService.getBooks().subscribe({
      next: (response) => {
        if (response.success && response.books) {
          this.availableBooks = response.books.filter(
            book => (book.available || book.stock) > 0
          );
        }
      },
      error: (error) => {
        this.snackBar.open('Error al cargar libros', 'Cerrar', { duration: 3000 });
      }
    });
  }

  loadUsers(): void {
    this.usersService.getUsers().subscribe({
      next: (response) => {
        if (response.success && response.users) {
          this.users = response.users;
        }
      },
      error: (error) => {
        this.snackBar.open('Error al cargar usuarios', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.loanForm.valid) {
      this.loading = true;
      const loanData = {
        ...this.loanForm.value,
        dueDate: this.loanForm.value.dueDate.toISOString()
      };

      this.loansService.createLoan(loanData).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.snackBar.open(
              response.message || 'Préstamo creado',
              'Cerrar',
              { duration: 3000 }
            );
            this.router.navigate(['/loans']);
          }
        },
        error: (error) => {
          this.loading = false;
          const message = error.error?.message || 'Error al crear préstamo';
          this.snackBar.open(message, 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/loans']);
  }
}
