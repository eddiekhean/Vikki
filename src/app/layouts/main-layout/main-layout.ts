import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Header } from './header/header';
import { Sidebar } from './sidebar/sidebar';
import { MenuService } from '../../core/services/menu.service';
import { SidebarService } from '../../core/services/sidebar.service';
import { MenuItem } from '../../core/models/menu.model';

@Component({
  selector: 'app-main-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout implements OnInit {
  private router = inject(Router);
  private menuService = inject(MenuService);
  protected sidebarService = inject(SidebarService);

  menuItems = signal<MenuItem[]>([]);
  isHomePage = signal(true);

  ngOnInit(): void {
    this.menuService.getMenuItems().subscribe((items) => {
      this.menuItems.set(
        items.filter((i) => i.visible !== false).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
      );
    });

    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) => {
      const url = (e as NavigationEnd).urlAfterRedirects ?? (e as NavigationEnd).url;
      const isHome = url === '/' || url === '';
      this.isHomePage.set(isHome);

      // Chỉ mở sidebar nếu đang đóng và không phải homepage
      if (!isHome && !this.sidebarService.isOpen()) {
        this.sidebarService.open();
      }
    });

    // Initial route
    const isHome = this.router.url === '/' || this.router.url === '';
    this.isHomePage.set(isHome);
    if (!isHome) {
      this.sidebarService.open();
    }
  }
}
