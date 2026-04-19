import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { MenuItem } from 'primeng/api';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-user-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, TagModule, AvatarModule, BreadcrumbModule, SkeletonModule, MessageModule, DividerModule],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.scss',
})
export class UserDetail implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected user = signal<User | null>(null);
  protected loading = signal(true);
  protected error = signal<string | null>(null);

  protected breadcrumbItems: MenuItem[] = [
    { label: 'Quản lý hệ thống', routerLink: '/quan-ly-he-thong' },
    { label: 'Người dùng', routerLink: '/quan-ly-he-thong/users' },
    { label: 'Chi tiết' },
  ];

  protected homeItem: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

  protected skeletonFields = Array.from({ length: 4 });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Không tìm thấy ID người dùng.');
      this.loading.set(false);
      return;
    }
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.user.set(user);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Không thể tải thông tin người dùng. Vui lòng thử lại.');
        this.loading.set(false);
      },
    });
  }

  protected goBack(): void {
    this.router.navigate(['/quan-ly-he-thong/users']);
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

  protected formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
