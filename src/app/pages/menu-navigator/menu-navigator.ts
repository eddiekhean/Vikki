import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../core/services/menu.service';
import { MenuItem } from '../../core/models/menu.model';

@Component({
  selector: 'app-menu-navigator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './menu-navigator.html',
  styleUrl: './menu-navigator.scss',
})
export class MenuNavigator implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private menuService = inject(MenuService);

  groupLabel = signal('');
  groupIcon = signal('');
  searchQuery = '';

  private allChildren = signal<MenuItem[]>([]);

  filteredChildren = computed(() => {
    const query = this.searchQuery.trim().toLowerCase();
    const items = this.allChildren();
    if (!query) return items;
    return items.filter((item) => this.fuzzyMatch(item.label.toLowerCase(), query));
  });

  ngOnInit(): void {
    const groupPath = '/' + this.route.snapshot.url.map((s) => s.path).join('/');

    this.menuService.getMenuItems().subscribe((items) => {
      const group = this.findGroupByChildPrefix(items, groupPath);
      if (group) {
        this.groupLabel.set(group.label);
        this.groupIcon.set(group.icon);
        this.allChildren.set((group.children ?? []).filter((c) => c.visible !== false));
      }
    });
  }

  onSearch(): void {
    this.allChildren.update((items) => [...items]);
  }

  onNavigate(item: MenuItem): void {
    if (item.routerLink) {
      this.router.navigateByUrl(item.routerLink);
    }
  }

  private findGroupByChildPrefix(items: MenuItem[], prefix: string): MenuItem | null {
    for (const item of items) {
      if (item.children?.some((c) => c.routerLink?.startsWith(prefix))) {
        return item;
      }
      if (item.children) {
        const found = this.findGroupByChildPrefix(item.children, prefix);
        if (found) return found;
      }
    }
    return null;
  }

  private fuzzyMatch(text: string, query: string): boolean {
    let qi = 0;
    for (let ti = 0; ti < text.length && qi < query.length; ti++) {
      if (text[ti] === query[qi]) qi++;
    }
    return qi === query.length;
  }
}
