import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UsersService } from '../../core/services/users.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  template: `
    <div class="users-container">
      <div class="header">
        <h1>Usuarios del Sistema</h1>
      </div>

      <mat-card *ngIf="users.length > 0; else noUsers">
        <table mat-table [dataSource]="users" class="users-table">
          <!-- Name Column -->
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let user">
              {{ user.firstName }} {{ user.lastName }}
            </td>
          </ng-container>

          <!-- Email Column -->
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let user">{{ user.email }}</td>
          </ng-container>

          <!-- Role Column -->
          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef>Rol</th>
            <td mat-cell *matCellDef="let user">
              <mat-chip-set>
                <mat-chip [color]="user.role === 'admin' ? 'accent' : 'primary'" 
                          [highlighted]="true">
                  {{ user.role === 'admin' ? 'Administrador' : 'Estudiante' }}
                </mat-chip>
              </mat-chip-set>
            </td>
          </ng-container>

          <!-- Created Date Column -->
          <ng-container matColumnDef="createdAt">
            <th mat-header-cell *matHeaderCellDef>Fecha Registro</th>
            <td mat-cell *matCellDef="let user">
              {{ user.createdAt ? (user.createdAt | date: 'dd/MM/yyyy') : '-' }}
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card>

      <ng-template #noUsers>
        <div class="no-users">
          <p>No hay usuarios registrados</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .users-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 24px;
    }

    h1 {
      margin: 0;
      color: #333;
    }

    .users-table {
      width: 100%;
    }

    .users-table th {
      font-weight: 600;
      background-color: #f5f5f5;
    }

    .users-table td, .users-table th {
      padding: 12px 16px;
    }

    mat-chip-set {
      display: inline-flex;
    }

    .no-users {
      text-align: center;
      padding: 48px;
      color: #999;
    }
  `]
})
export class UsersListComponent implements OnInit {
  private usersService = inject(UsersService);
  private snackBar = inject(MatSnackBar);

  users: User[] = [];
  displayedColumns: string[] = ['name', 'email', 'role', 'createdAt'];

  ngOnInit(): void {
    this.loadUsers();
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
}
