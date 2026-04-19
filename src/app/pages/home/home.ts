import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../core/services/menu.service';
import { SidebarService } from '../../core/services/sidebar.service';
import { MenuItem } from '../../core/models/menu.model';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private menuService = inject(MenuService);
  private sidebarService = inject(SidebarService);
  private router = inject(Router);

  searchQuery = '';
  private allItems = signal<MenuItem[]>([]);

  filteredItems = computed(() => {
    const query = this.searchQuery.trim().toLowerCase();
    const items = this.allItems();
    if (!query) return items;
    return items.filter((item) => this.fuzzyMatch(item.label.toLowerCase(), query));
  });

  ngOnInit(): void {
    this.menuService.getMenuItems().subscribe((items) => {
      this.allItems.set(
        items.filter((i) => i.visible !== false).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
      );
    });
  }

  onSearch(): void {
    this.allItems.update((items) => [...items]);
  }

  onNavigate(item: MenuItem): void {
    if (!item.routerLink) return;

    if (item.children?.length) {
      this.sidebarService.openAndExpand(item.id);
    } else {
      this.sidebarService.open();
    }

    this.router.navigateByUrl(item.routerLink);
  }

  private fuzzyMatch(text: string, query: string): boolean {
    let qi = 0;
    for (let ti = 0; ti < text.length && qi < query.length; ti++) {
      if (text[ti] === query[qi]) qi++;
    }
    return qi === query.length;
  }
}
