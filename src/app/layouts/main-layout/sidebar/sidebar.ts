import {
  Component,
  inject,
  input,
  output,
  effect,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from '../../../core/models/menu.model';
import { SidebarService } from '../../../core/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, ButtonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  private router = inject(Router);
  private sidebarService = inject(SidebarService);

  items = input.required<MenuItem[]>();
  closeSidebar = output<void>();

  constructor() {
    // Lắng nghe khi homepage yêu cầu expand 1 group
    effect(() => {
      const groupId = this.sidebarService.expandGroupId();
      if (groupId) {
        this.expandGroupById(groupId, this.items());
        // Reset để không trigger lại
        this.sidebarService.expandGroupId.set(null);
      }
    });
  }

  ngOnInit(): void {
    this.expandActiveParents(this.items());

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.expandActiveParents(this.items()));
  }

  toggleExpand(item: MenuItem): void {
    item.expanded = !item.expanded;
  }

  isParentActive(item: MenuItem): boolean {
    return this.hasActiveChild(item, this.router.url);
  }

  // ─── Private helpers ───────────────────────────────────

  private hasActiveChild(item: MenuItem, url: string): boolean {
    if (!item.children) return false;
    return item.children.some(
      (child) =>
        (child.routerLink && url.startsWith(child.routerLink)) || this.hasActiveChild(child, url),
    );
  }

  private expandActiveParents(items: MenuItem[]): void {
    const url = this.router.url;
    for (const item of items) {
      if (item.children) {
        if (this.hasActiveChild(item, url)) {
          item.expanded = true;
        }
        this.expandActiveParents(item.children);
      }
    }
  }

  /** Tìm group theo id và expand nó */
  private expandGroupById(id: string, items: MenuItem[]): void {
    for (const item of items) {
      if (item.id === id) {
        item.expanded = true;
        return;
      }
      if (item.children) {
        this.expandGroupById(id, item.children);
      }
    }
  }
}
