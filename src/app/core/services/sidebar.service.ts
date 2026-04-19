import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  readonly isOpen = signal(false);

  readonly expandGroupId = signal<string | null>(null);

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggle(): void {
    this.isOpen.update((v) => !v);
  }

  openAndExpand(groupId: string): void {
    this.expandGroupId.set(groupId);
    this.isOpen.set(true);
  }
}
