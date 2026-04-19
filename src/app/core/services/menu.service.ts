import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MenuItem } from '../models/menu.model';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private http = inject(HttpClient);

  /**
   * Load menu items từ API.
   * TODO: đổi thành API endpoint thực tế.
   */
  getMenuItems(): Observable<MenuItem[]> {
    // return this.http.get<MenuItem[]>('/api/menus');

    return of([
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/dashboard',
        order: 1,
      },
      {
        id: 'management',
        label: 'Quản lý hệ thống',
        icon: 'pi pi-users',
        routerLink: '/quan-ly-he-thong',
        order: 2,
        children: [
          {
            id: 'users',
            label: 'Người dùng',
            icon: 'pi pi-user',
            routerLink: '/quan-ly-he-thong/users',
          },
          {
            id: 'roles',
            label: 'Nhóm quyền',
            icon: 'pi pi-shield',
            routerLink: '/quan-ly-he-thong/roles',
          },
          {
            id: 'departments',
            label: 'Phòng ban',
            icon: 'pi pi-building',
            routerLink: '/quan-ly-he-thong/departments',
          },
        ],
      },
      {
        id: 'business',
        label: 'Kinh doanh',
        icon: 'pi pi-shopping-cart',
        routerLink: '/kinh-doanh',
        order: 3,
        children: [
          {
            id: 'orders',
            label: 'Đơn hàng',
            icon: 'pi pi-shopping-cart',
            routerLink: '/kinh-doanh/orders',
          },
          {
            id: 'products',
            label: 'Sản phẩm',
            icon: 'pi pi-box',
            routerLink: '/kinh-doanh/products',
          },
          {
            id: 'customers',
            label: 'Khách hàng',
            icon: 'pi pi-id-card',
            routerLink: '/kinh-doanh/customers',
          },
          {
            id: 'inventory',
            label: 'Kho hàng',
            icon: 'pi pi-warehouse',
            routerLink: '/kinh-doanh/inventory',
          },
        ],
      },
      {
        id: 'reports',
        label: 'Báo cáo',
        icon: 'pi pi-chart-bar',
        routerLink: '/reports',
        order: 4,
      },
      {
        id: 'calendar',
        label: 'Lịch làm việc',
        icon: 'pi pi-calendar',
        routerLink: '/calendar',
        order: 5,
      },
      {
        id: 'messages',
        label: 'Tin nhắn',
        icon: 'pi pi-envelope',
        routerLink: '/messages',
        order: 6,
      },
      { id: 'settings', label: 'Cài đặt', icon: 'pi pi-cog', routerLink: '/settings', order: 7 },
    ]);
  }
}
