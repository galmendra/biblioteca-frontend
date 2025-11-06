import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { LoansService } from '../../core/services/loans.service';
import { AuthService } from '../../core/services/auth.service';
import { Loan } from '../../core/models/loan.model';
import { Book } from '../../core/models/book.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-loans-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatChipsModule,
    MatTableModule
  ],
  template: `
    <div class="loans-container">
      <div class="header">
        <h1>{{ isAdmin ? 'Todos los Préstamos' : 'Mis Préstamos' }}</h1>
        <button mat-raised-button color="primary" *ngIf="isAdmin" (click)="createLoan()">
          <mat-icon>add</mat-icon>
          Nuevo Préstamo
        </button>
      </div>

      <mat-card *ngIf="loans.length > 0; else noLoans">
        <table mat-table [dataSource]="loans" class="loans-table">
          <!-- Book Column -->
          <ng-container matColumnDef="book">
            <th mat-header-cell *matHeaderCellDef>Libro</th>
            <td mat-cell *matCellDef="let loan">
              {{ getBookTitle(loan.book) }}
            </td>
          </ng-container>

          <!-- User Column (only for admin) -->
          <ng-container matColumnDef="user" *ngIf="isAdmin">
            <th mat-header-cell *matHeaderCellDef>Usuario</th>
            <td mat-cell *matCellDef="let loan">
              {{ getUserName(loan.user) }}
            </td>
          </ng-container>

          <!-- Due Date Column -->
          <ng-container matColumnDef="dueDate">
            <th mat-header-cell *matHeaderCellDef>Fecha Límite</th>
            <td mat-cell *matCellDef="let loan">
              {{ loan.dueDate | date: 'dd/MM/yyyy' }}
            </td>
          </ng-container>

          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let loan">
              <mat-chip-set>
                <mat-chip [color]="loan.returned ? 'accent' : (isOverdue(loan) ? 'warn' : 'primary')" 
                          [highlighted]="true">
                  {{ loan.returned ? 'Devuelto' : (isOverdue(loan) ? 'Vencido' : 'Activo') }}
                </mat-chip>
              </mat-chip-set>
            </td>
          </ng-container>

          <!-- Returned Date Column -->
          <ng-container matColumnDef="returnedAt">
            <th mat-header-cell *matHeaderCellDef>Fecha Devolución</th>
            <td mat-cell *matCellDef="let loan">
              {{ loan.returnedAt ? (loan.returnedAt | date: 'dd/MM/yyyy') : '-' }}
            </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions" *ngIf="isAdmin">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let loan">
              <button mat-icon-button color="primary" 
                      *ngIf="!loan.returned"
                      (click)="returnLoan(loan)"
                      matTooltip="Marcar como devuelto">
                <mat-icon>assignment_return</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card>

      <ng-template #noLoans>
        <div class="no-loans">
          <mat-icon>assignment</mat-icon>
          <p>No hay préstamos registrados</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .loans-container {
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

    .loans-table {
      width: 100%;
    }

    .loans-table th {
      font-weight: 600;
      background-color: #f5f5f5;
    }

    .loans-table td, .loans-table th {
      padding: 12px 16px;
    }

    mat-chip-set {
      display: inline-flex;
    }

    .no-loans {
      text-align: center;
      padding: 48px;
      color: #999;
    }

    .no-loans mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }

    .no-loans p {
      font-size: 18px;
    }
  `]
})
export class LoansListComponent implements OnInit {
  private loansService = inject(LoansService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loans: Loan[] = [];

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  get displayedColumns(): string[] {
    return this.isAdmin
      ? ['book', 'user', 'dueDate', 'status', 'returnedAt', 'actions']
      : ['book', 'dueDate', 'status', 'returnedAt'];
  }

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    const request = this.isAdmin
      ? this.loansService.getAllLoans()
      : this.loansService.getMyLoans();

    request.subscribe({
      next: (response) => {
        if (response.success && response.loans) {
          this.loans = response.loans;
        }
      },
      error: (error) => {
        this.snackBar.open('Error al cargar préstamos', 'Cerrar', { duration: 3000 });
      }
    });
  }

  createLoan(): void {
    this.router.navigate(['/loans/new']);
  }

  returnLoan(loan: Loan): void {
    if (confirm('¿Marcar este préstamo como devuelto?')) {
      this.loansService.returnLoan(loan._id!).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open(response.message || 'Préstamo devuelto', 'Cerrar', { duration: 3000 });
            this.loadLoans();
          }
        },
        error: (error) => {
          const message = error.error?.message || 'Error al devolver préstamo';
          this.snackBar.open(message, 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  getBookTitle(book: Book | string): string {
    return typeof book === 'string' ? book : book.title;
  }

  getUserName(user: User | string): string {
    if (typeof user === 'string') return user;
    return `${user.firstName} ${user.lastName}`;
  }

  isOverdue(loan: Loan): boolean {
    if (loan.returned) return false;
    const dueDate = new Date(loan.dueDate);
    const today = new Date();
    return dueDate < today;
  }
}
