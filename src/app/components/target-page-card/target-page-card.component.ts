import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TargetPage, ScrapingSession } from '../../models/target-page.model';
import { Invoice } from '../../models/invoice.model';
import { InvoiceListComponent } from '../invoice-list/invoice-list.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';

@Component({
  selector: 'app-target-page-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatTooltipModule,
    InvoiceListComponent,
    ProgressBarComponent
  ],
  template: `
    <mat-card class="target-page-card">
      <mat-card-header>
        <div mat-card-avatar class="target-page-avatar">
          <mat-icon>{{ getTargetPageIcon() }}</mat-icon>
        </div>
        <mat-card-title>{{ targetPage.name }}</mat-card-title>
        <mat-card-subtitle>{{ targetPage.url }}</mat-card-subtitle>
        
        <div class="header-actions">
          <button mat-raised-button 
                  color="primary"
                  [disabled]="isDownloading"
                  (click)="startDownload()"
                  class="download-button">
            <mat-icon>{{ isDownloading ? 'hourglass_empty' : 'download' }}</mat-icon>
            {{ getDownloadButtonText() }}
          </button>
          
          <button mat-icon-button 
                  [matTooltip]="targetPage.isActive ? 'Active' : 'Inactive'"
                  [color]="targetPage.isActive ? 'primary' : 'warn'">
            <mat-icon>{{ targetPage.isActive ? 'check_circle' : 'cancel' }}</mat-icon>
          </button>
        </div>
      </mat-card-header>

      <mat-card-content>
        <div class="target-page-stats">
          <div class="stat-item">
            <mat-icon>receipt</mat-icon>
            <span>{{ invoices.length }} invoices</span>
          </div>
          <div class="stat-item" *ngIf="getLatestInvoice()">
            <mat-icon>schedule</mat-icon>
            <span>Latest: {{ formatDate(getLatestInvoice()!.invoiceDate) }}</span>
          </div>
          <div class="stat-item">
            <mat-icon>folder</mat-icon>
            <span>{{ getTotalFileSize() }}</span>
          </div>
        </div>

        <!-- Progress Bar for Active Downloads -->
        <app-progress-bar 
          *ngIf="activeSession" 
          [progress]="activeSession.progress">
        </app-progress-bar>

        <!-- Invoice List -->
        <app-invoice-list
          [invoices]="invoices"
          [selectedInvoices]="selectedInvoices"
          (invoiceSelected)="onInvoiceSelected($event)"
          (invoiceViewed)="onInvoiceViewed($event)"
          (invoiceDownloaded)="onInvoiceDownloaded($event)"
          (invoiceDeleted)="onInvoiceDeleted($event)"
          (selectedDownloaded)="onSelectedDownloaded($event)">
        </app-invoice-list>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .target-page-card {
      margin: 24px 0;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    mat-card-header {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .target-page-avatar {
      background-color: #1976d2;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    
    .header-actions {
      margin-left: auto;
      display: flex;
      gap: 8px;
      align-items: center;
    }
    
    .download-button {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .target-page-stats {
      display: flex;
      gap: 24px;
      margin-bottom: 16px;
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 8px;
    }
    
    .stat-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #666;
    }
    
    .stat-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    
    @media (max-width: 768px) {
      .target-page-stats {
        flex-direction: column;
        gap: 12px;
      }
      
      .header-actions {
        flex-direction: column;
        gap: 4px;
      }
    }
  `]
})
export class TargetPageCardComponent {
  @Input() targetPage!: TargetPage;
  @Input() invoices: Invoice[] = [];
  @Input() selectedInvoices: string[] = [];
  @Input() activeSession: ScrapingSession | null = null;
  
  @Output() downloadStarted = new EventEmitter<TargetPage>();
  @Output() invoiceSelected = new EventEmitter<string[]>();
  @Output() invoiceViewed = new EventEmitter<Invoice>();
  @Output() invoiceDownloaded = new EventEmitter<Invoice>();
  @Output() invoiceDeleted = new EventEmitter<Invoice>();
  @Output() selectedDownloaded = new EventEmitter<string[]>();

  get isDownloading(): boolean {
    return this.activeSession !== null && 
           ['authenticating', 'fetching', 'downloading'].includes(this.activeSession.status);
  }

  startDownload(): void {
    this.downloadStarted.emit(this.targetPage);
  }

  getDownloadButtonText(): string {
    if (!this.activeSession) {
      return 'Download Invoices';
    }
    
    switch (this.activeSession.status) {
      case 'authenticating':
        return 'Authenticating...';
      case 'fetching':
        return 'Fetching...';
      case 'downloading':
        return 'Downloading...';
      case 'completed':
        return 'Download Invoices';
      case 'error':
        return 'Retry Download';
      default:
        return 'Download Invoices';
    }
  }

  getTargetPageIcon(): string {
    const name = this.targetPage.name.toLowerCase();
    if (name.includes('klarmobil')) return 'phone_android';
    if (name.includes('telekom')) return 'phone';
    if (name.includes('vodafone')) return 'signal_cellular_4_bar';
    return 'language';
  }

  getLatestInvoice(): Invoice | null {
    if (this.invoices.length === 0) return null;
    return this.invoices.reduce((latest, current) => 
      new Date(current.invoiceDate) > new Date(latest.invoiceDate) ? current : latest
    );
  }

  getTotalFileSize(): string {
    const totalBytes = this.invoices.reduce((sum, invoice) => sum + invoice.fileSize, 0);
    return this.formatFileSize(totalBytes);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('de-DE');
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onInvoiceSelected(selectedIds: string[]): void {
    this.invoiceSelected.emit(selectedIds);
  }

  onInvoiceViewed(invoice: Invoice): void {
    this.invoiceViewed.emit(invoice);
  }

  onInvoiceDownloaded(invoice: Invoice): void {
    this.invoiceDownloaded.emit(invoice);
  }

  onInvoiceDeleted(invoice: Invoice): void {
    this.invoiceDeleted.emit(invoice);
  }

  onSelectedDownloaded(selectedIds: string[]): void {
    this.selectedDownloaded.emit(selectedIds);
  }
}