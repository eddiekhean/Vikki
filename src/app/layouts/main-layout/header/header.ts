import { Component, inject, input, output, ChangeDetectionStrategy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from '../../../core/auth/auth.service';
import type { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, MenuModule, AvatarModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected authService = inject(AuthService);

  showMenuButton = input(true);
  toggleSidebar = output<void>();

  menuItems: MenuItem[] = [
    { label: 'Thông tin cá nhân', icon: 'pi pi-user' },
    { separator: true },
    { label: 'Đăng xuất', icon: 'pi pi-sign-out', command: () => this.authService.logout() },
  ];
}
