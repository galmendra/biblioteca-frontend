import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/books',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: '',
    loadComponent: () => import('./shared/navigation/navigation.component').then(m => m.NavigationComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'books',
        children: [
          {
            path: '',
            loadComponent: () => import('./books/books-list/books-list.component').then(m => m.BooksListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./books/book-form/book-form.component').then(m => m.BookFormComponent),
            canActivate: [adminGuard]
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./books/book-form/book-form.component').then(m => m.BookFormComponent),
            canActivate: [adminGuard]
          }
        ]
      },
      {
        path: 'loans',
        children: [
          {
            path: '',
            loadComponent: () => import('./loans/loans-list/loans-list.component').then(m => m.LoansListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./loans/loan-form/loan-form.component').then(m => m.LoanFormComponent),
            canActivate: [adminGuard]
          }
        ]
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users-list/users-list.component').then(m => m.UsersListComponent),
        canActivate: [adminGuard]
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/books'
  }
];
