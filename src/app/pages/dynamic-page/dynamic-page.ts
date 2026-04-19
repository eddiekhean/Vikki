import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dynamic-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardModule],
  templateUrl: './dynamic-page.html',
  styleUrl: './dynamic-page.scss',
})
export class DynamicPage {
  private route = inject(ActivatedRoute);
  protected pageId =
    this.route.snapshot.data['pageId'] ?? this.route.snapshot.params['id'] ?? 'unknown';
}
