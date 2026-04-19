import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SkeletonModule } from 'primeng/skeleton';
import { MenuItem } from 'primeng/api';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-user-management',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    AvatarModule,
    IconFieldModule,
    InputIconModule,
    BreadcrumbModule,
    SkeletonModule,
  ],
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss',
})
export class UserManagement implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  protected users = signal<User[]>([]);
  protected loading = signal(true);
  protected searchQuery = signal('');

  protected filteredUsers = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const users = this.users();
    if (!query) return users;
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.phone.includes(query) ||
        u.role.toLowerCase().includes(query),
    );
  });

  protected breadcrumbItems: MenuItem[] = [
    { label: 'Quản lý hệ thống', routerLink: '/quan-ly-he-thong' },
    { label: 'Người dùng' },
  ];

  protected homeItem: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

  protected skeletonRows = Array.from({ length: 6 });

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  protected navigateToDetail(user: User): void {
    this.router.navigate(['/quan-ly-he-thong/users', user.id]);
  }

  protected getStatusSeverity(status: string): 'success' | 'danger' {
    return status === 'active' ? 'success' : 'danger';
  }

  protected getStatusLabel(status: string): string {
    return status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động';
  }

  protected getInitials(fullName: string): string {
    const parts = fullName.trim().split(' ');
    return parts
      .slice(-2)
      .map((p) => p[0])
      .join('')
      .toUpperCase();
  }
}
