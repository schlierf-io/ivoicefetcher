import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { Invoice } from '../../models/invoice.model';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatListModule, 
    MatIconModule, 
    MatButtonModule, 
    MatCheckboxModule,
    MatCardModule
  ],
  template: `
    <mat-card class="invoice-list-card">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>receipt</mat-icon>
          Downloaded Invoices ({{ invoices.length }})
        </mat-card-title>
        <div class="header-actions" *ngIf="invoices.length > 0">
          <button mat-raised-button 
                  color="primary" 
                  (click)="downloadSelected()"
                  [disabled]="selectedInvoices.length === 0">
            <mat-icon>download</mat-icon>
            Download Selected ({{ selectedInvoices.length }})
          </button>
        </div>
      </mat-card-header>
      
      <mat-card-content>
        <div *ngIf="invoices.length === 0" class="no-invoices">
          <mat-icon class="large-icon">inbox</mat-icon>
          <p>No invoices downloaded yet</p>
        </div>
        
        <mat-list *ngIf="invoices.length > 0">
          <mat-list-item *ngFor="let invoice of invoices" class="invoice-item">
            <mat-checkbox 
              [checked]="isSelected(invoice.id)"
              (change)="toggleSelection(invoice.id)"
              class="invoice-checkbox">
            </mat-checkbox>
            
            <div class="invoice-info">
              <div class="invoice-name">{{ invoice.invoiceName }}</div>
              <div class="invoice-details">
                <span class="invoice-date">{{ formatDate(invoice.invoiceDate) }}</span>
                <span class="invoice-size">{{ formatFileSize(invoice.fileSize) }}</span>
                <span class="invoice-status" [class]="'status-' + invoice.status">
                  {{ invoice.status }}
                </span>
              </div>
              <div class="invoice-filename">{{ invoice.filename }}</div>
            </div>
            
            <div class="invoice-actions">
              <button mat-icon-button 
                      (click)="viewInvoice(invoice)"
                      matTooltip="View Invoice">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button 
                      (click)="downloadInvoice(invoice)"
                      matTooltip="Download Invoice">
                <mat-icon>download</mat-icon>
              </button>
              <button mat-icon-button 
                      color="warn"
                      (click)="deleteInvoice(invoice)"
                      matTooltip="Delete Invoice">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </mat-list-item>
        </mat-list>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .invoice-list-card {
      margin: 16px 0;
    }
    
    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    
    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .header-actions {
      display: flex;
      gap: 8px;
    }
    
    .no-invoices {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }
    
    .large-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }
    
    .invoice-item {
      border-bottom: 1px solid #eee;
      padding: 16px 0;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .invoice-checkbox {
      flex-shrink: 0;
    }
    
    .invoice-info {
      flex: 1;
      min-width: 0;
    }
    
    .invoice-name {
      font-weight: 500;
      font-size: 16px;
      margin-bottom: 4px;
    }
    
    .invoice-details {
      display: flex;
      gap: 16px;
      font-size: 14px;
      color: #666;
      margin-bottom: 4px;
    }
    
    .invoice-filename {
      font-size: 12px;
      color: #999;
      font-family: monospace;
    }
    
    .invoice-status {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .status-downloaded {
      background-color: #e8f5e8;
      color: #2e7d32;
    }
    
    .status-pending {
      background-color: #fff3e0;
      color: #f57c00;
    }
    
    .status-error {
      background-color: #ffebee;
      color: #d32f2f;
    }
    
    .invoice-actions {
      display: flex;
      gap: 4px;
      flex-shrink: 0;
    }
  `]
})
export class InvoiceListComponent {
  @Input() invoices: Invoice[] = [];
  @Input() selectedInvoices: string[] = [];
  
  @Output() invoiceSelected = new EventEmitter<string[]>();
  @Output() invoiceViewed = new EventEmitter<Invoice>();
  @Output() invoiceDownloaded = new EventEmitter<Invoice>();
  @Output() invoiceDeleted = new EventEmitter<Invoice>();
  @Output() selectedDownloaded = new EventEmitter<string[]>();

  isSelected(invoiceId: string): boolean {
    return this.selectedInvoices.includes(invoiceId);
  }

  toggleSelection(invoiceId: string): void {
    const currentSelection = [...this.selectedInvoices];
    const index = currentSelection.indexOf(invoiceId);
    
    if (index > -1) {
      currentSelection.splice(index, 1);
    } else {
      currentSelection.push(invoiceId);
    }
    
    this.invoiceSelected.emit(currentSelection);
  }

  viewInvoice(invoice: Invoice): void {
    this.invoiceViewed.emit(invoice);
  }

  downloadInvoice(invoice: Invoice): void {
    this.invoiceDownloaded.emit(invoice);
  }

  deleteInvoice(invoice: Invoice): void {
    this.invoiceDeleted.emit(invoice);
  }

  downloadSelected(): void {
    this.selectedDownloaded.emit(this.selectedInvoices);
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
}