import { Routes } from '@angular/router';
import { authGuard, noAuthGuard } from './core/guards/auth.guard';

const dynamicPage = () => import('./pages/dynamic-page/dynamic-page').then((m) => m.DynamicPage);
const menuNavigator = () =>
  import('./pages/menu-navigator/menu-navigator').then((m) => m.MenuNavigator);

export const routes: Routes = [
  // ─── Public ────────────────────────────────────────────
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },

  // ─── Protected (MainLayout bọc tất cả) ────────────────
  {
    path: '',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      // Homepage
      {
        path: '',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
        pathMatch: 'full',
      },

      // Standalone pages
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      { path: 'reports', loadComponent: dynamicPage, data: { pageId: 'reports' } },
      { path: 'calendar', loadComponent: dynamicPage, data: { pageId: 'calendar' } },
      { path: 'messages', loadComponent: dynamicPage, data: { pageId: 'messages' } },
      { path: 'settings', loadComponent: dynamicPage, data: { pageId: 'settings' } },

      // Quản lý hệ thống (phân cấp)
      { path: 'quan-ly-he-thong', loadComponent: menuNavigator, pathMatch: 'full' },
      {
        path: 'quan-ly-he-thong/users',
        loadComponent: () =>
          import('./pages/user-management/user-management').then((m) => m.UserManagement),
      },
      {
        path: 'quan-ly-he-thong/users/:id',
        loadComponent: () =>
          import('./pages/user-detail/user-detail').then((m) => m.UserDetail),
      },
      { path: 'quan-ly-he-thong/roles', loadComponent: dynamicPage, data: { pageId: 'roles' } },
      {
        path: 'quan-ly-he-thong/departments',
        loadComponent: dynamicPage,
        data: { pageId: 'departments' },
      },

      // Kinh doanh (phân cấp)
      { path: 'kinh-doanh', loadComponent: menuNavigator, pathMatch: 'full' },
      { path: 'kinh-doanh/orders', loadComponent: dynamicPage, data: { pageId: 'orders' } },
      { path: 'kinh-doanh/products', loadComponent: dynamicPage, data: { pageId: 'products' } },
      { path: 'kinh-doanh/customers', loadComponent: dynamicPage, data: { pageId: 'customers' } },
      { path: 'kinh-doanh/inventory', loadComponent: dynamicPage, data: { pageId: 'inventory' } },
    ],
  },

  // ─── 404 ──────────────────────────────────────────────
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
