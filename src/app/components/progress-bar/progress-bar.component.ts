import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { ScrapingProgress } from '../../models/target-page.model';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, MatCardModule],
  template: `
    <mat-card class="progress-card" *ngIf="progress">
      <mat-card-content>
        <div class="progress-info">
          <h4>{{ progress.currentStep }}</h4>
          <div class="progress-stats">
            <span>Total: {{ progress.totalInvoices }}</span>
            <span>Downloaded: {{ progress.downloadedInvoices }}</span>
            <span>Failed: {{ progress.failedInvoices }}</span>
          </div>
        </div>
        <mat-progress-bar 
          mode="determinate" 
          [value]="getProgressPercentage()"
          [color]="getProgressColor()">
        </mat-progress-bar>
        <div class="progress-text">
          {{ progress.processedInvoices }} / {{ progress.totalInvoices }} invoices processed
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .progress-card {
      margin: 16px 0;
      background-color: #f5f5f5;
    }
    
    .progress-info h4 {
      margin: 0 0 8px 0;
      color: #333;
    }
    
    .progress-stats {
      display: flex;
      gap: 16px;
      margin-bottom: 12px;
      font-size: 14px;
      color: #666;
    }
    
    .progress-text {
      margin-top: 8px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    
    mat-progress-bar {
      height: 8px;
      border-radius: 4px;
    }
  `]
})
export class ProgressBarComponent {
  @Input() progress: ScrapingProgress | null = null;

  getProgressPercentage(): number {
    if (!this.progress || this.progress.totalInvoices === 0) {
      return 0;
    }
    return (this.progress.processedInvoices / this.progress.totalInvoices) * 100;
  }

  getProgressColor(): 'primary' | 'accent' | 'warn' {
    if (!this.progress) return 'primary';
    
    const failureRate = this.progress.failedInvoices / this.progress.processedInvoices;
    if (failureRate > 0.3) return 'warn';
    if (failureRate > 0.1) return 'accent';
    return 'primary';
  }
}