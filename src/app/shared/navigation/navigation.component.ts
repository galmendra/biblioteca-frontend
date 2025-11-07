import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" class="navbar">
        <span class="app-title" routerLink="/books">
          <mat-icon>library_books</mat-icon>
          Biblioteca
        </span>

        <span class="spacer"></span>

        <ng-container *ngIf="authService.currentUser$ | async as user">
          <button mat-button routerLink="/books" routerLinkActive="active">
            <mat-icon>menu_book</mat-icon>
            Libros
          </button>

          <button mat-button routerLink="/loans" routerLinkActive="active">
            <mat-icon>assignment</mat-icon>
            Préstamos
          </button>

          <button mat-button routerLink="/users" routerLinkActive="active" *ngIf="isAdmin">
            <mat-icon>people</mat-icon>
            Usuarios
          </button>

          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <div class="user-info">
              <p class="user-name">{{ user.firstName }} {{ user.lastName }}</p>
              <p class="user-email">{{ user.email }}</p>
              <p class="user-role">{{ user.role === 'admin' ? 'Administrador' : 'Estudiante' }}</p>
            </div>
            <button mat-menu-item (click)="logout()">
              <mat-icon>exit_to_app</mat-icon>
              Cerrar Sesión
            </button>
          </mat-menu>
        </ng-container>
      </mat-toolbar>

      <div class="content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .app-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 20px;
      font-weight: 500;
      cursor: pointer;
      user-select: none;
    }

    .spacer {
      flex: 1 1 auto;
    }

    button.active {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .user-info {
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .user-name {
      font-weight: 600;
      margin: 0 0 4px 0;
      color: #333;
    }

    .user-email {
      font-size: 12px;
      color: #666;
      margin: 0 0 4px 0;
    }

    .user-role {
      font-size: 12px;
      color: #999;
      margin: 0;
      text-transform: capitalize;
    }

    .content {
      flex: 1;
      background-color: #f5f5f5;
    }
  `]
})
export class NavigationComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }
  logout(): void {
    this.authService.logout();
  }
}
