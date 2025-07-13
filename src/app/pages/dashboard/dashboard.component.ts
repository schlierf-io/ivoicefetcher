import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil, combineLatest } from 'rxjs';

import { TargetPageCardComponent } from '../../components/target-page-card/target-page-card.component';
import { TargetPage, ScrapingSession } from '../../models/target-page.model';
import { Invoice } from '../../models/invoice.model';
import { TargetPageService } from '../../services/target-page.service';
import { InvoiceService } from '../../services/invoice.service';
import { ScraperService } from '../../services/scraper.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    TargetPageCardComponent
  ],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <mat-icon class="toolbar-icon">receipt_long</mat-icon>
      <span>Invoice Fetcher</span>
      <span class="toolbar-spacer"></span>
      <button mat-icon-button (click)="refreshData()" [disabled]="isLoading">
        <mat-icon>refresh</mat-icon>
      </button>
    </mat-toolbar>

    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Invoice Management Dashboard</h1>
        <p class="dashboard-subtitle">
          Manage your invoice downloads from various providers
        </p>
      </div>

      <div class="dashboard-stats">
        <div class="stat-card">
          <mat-icon>business</mat-icon>
          <div class="stat-content">
            <div class="stat-number">{{ targetPages.length }}</div>
            <div class="stat-label">Target Pages</div>
          </div>
        </div>
        
        <div class="stat-card">
          <mat-icon>receipt</mat-icon>
          <div class="stat-content">
            <div class="stat-number">{{ getTotalInvoices() }}</div>
            <div class="stat-label">Total Invoices</div>
          </div>
        </div>
        
        <div class="stat-card">
          <mat-icon>download</mat-icon>
          <div class="stat-content">
            <div class="stat-number">{{ getActiveDownloads() }}</div>
            <div class="stat-label">Active Downloads</div>
          </div>
        </div>
      </div>

      <div class="target-pages-container">
        <app-target-page-card
          *ngFor="let targetPage of targetPages"
          [targetPage]="targetPage"
          [invoices]="getInvoicesForTargetPage(targetPage.id)"
          [selectedInvoices]="getSelectedInvoicesForTargetPage(targetPage.id)"
          [activeSession]="getActiveSessionForTargetPage(targetPage.id)"
          (downloadStarted)="onDownloadStarted($event)"
          (invoiceSelected)="onInvoiceSelected(targetPage.id, $event)"
          (invoiceViewed)="onInvoiceViewed($event)"
          (invoiceDownloaded)="onInvoiceDownloaded($event)"
          (invoiceDeleted)="onInvoiceDeleted($event)"
          (selectedDownloaded)="onSelectedDownloaded($event)">
        </app-target-page-card>
      </div>

      <div *ngIf="targetPages.length === 0 && !isLoading" class="no-target-pages">
        <mat-icon class="large-icon">business_center</mat-icon>
        <h2>No Target Pages Configured</h2>
        <p>Add target pages to start downloading invoices</p>
        <button mat-raised-button color="primary" (click)="addTargetPage()">
          <mat-icon>add</mat-icon>
          Add Target Page
        </button>
      </div>
    </div>
  `,
  styles: [`
    .app-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .toolbar-icon {
      margin-right: 8px;
    }
    
    .toolbar-spacer {
      flex: 1 1 auto;
    }
    
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }
    
    .dashboard-header {
      text-align: center;
      margin-bottom: 32px;
    }
    
    .dashboard-header h1 {
      margin: 0 0 8px 0;
      color: #333;
    }
    
    .dashboard-subtitle {
      color: #666;
      font-size: 16px;
      margin: 0;
    }
    
    .dashboard-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    
    .stat-card {
      display: flex;
      align-items: center;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      gap: 16px;
    }
    
    .stat-card mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #1976d2;
    }
    
    .stat-content {
      flex: 1;
    }
    
    .stat-number {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      line-height: 1;
    }
    
    .stat-label {
      font-size: 14px;
      color: #666;
      margin-top: 4px;
    }
    
    .target-pages-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .no-target-pages {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
    
    .large-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      opacity: 0.5;
    }
    
    .no-target-pages h2 {
      margin: 16px 0 8px 0;
    }
    
    .no-target-pages p {
      margin-bottom: 24px;
    }
    
    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }
      
      .dashboard-stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  targetPages: TargetPage[] = [];
  invoices: Invoice[] = [];
  activeSessions: ScrapingSession[] = [];
  selectedInvoicesByTargetPage: { [targetPageId: string]: string[] } = {};
  isLoading = false;
  
  private destroy$ = new Subject<void>();

  constructor(
    private targetPageService: TargetPageService,
    private invoiceService: InvoiceService,
    private scraperService: ScraperService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.isLoading = true;
    
    combineLatest([
      this.targetPageService.getActiveTargetPages(),
      this.invoiceService.getAllInvoices(),
      this.scraperService.getAllActiveSessions()
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: ([targetPages, invoices, sessions]) => {
        this.targetPages = targetPages;
        this.invoices = invoices;
        this.activeSessions = sessions;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.snackBar.open('Error loading data', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  refreshData(): void {
    this.loadData();
    this.snackBar.open('Data refreshed', 'Close', { duration: 2000 });
  }

  getTotalInvoices(): number {
    return this.invoices.length;
  }

  getActiveDownloads(): number {
    return this.activeSessions.filter(session => 
      ['authenticating', 'fetching', 'downloading'].includes(session.status)
    ).length;
  }

  getInvoicesForTargetPage(targetPageId: string): Invoice[] {
    return this.invoices.filter(invoice => invoice.targetPageId === targetPageId);
  }

  getSelectedInvoicesForTargetPage(targetPageId: string): string[] {
    return this.selectedInvoicesByTargetPage[targetPageId] || [];
  }

  getActiveSessionForTargetPage(targetPageId: string): ScrapingSession | null {
    return this.activeSessions.find(session => session.targetPageId === targetPageId) || null;
  }

  onDownloadStarted(targetPage: TargetPage): void {
    this.scraperService.startAuthentication(targetPage.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (session) => {
          this.activeSessions.push(session);
          this.snackBar.open(
            `Authentication started for ${targetPage.name}. Please complete authentication in the browser window.`,
            'Close',
            { duration: 5000 }
          );
          
          // Simulate authentication completion after 10 seconds
          setTimeout(() => {
            this.completeAuthentication(session.id);
          }, 10000);
        },
        error: (error) => {
          console.error('Error starting download:', error);
          this.snackBar.open('Error starting download', 'Close', { duration: 3000 });
        }
      });
  }

  private completeAuthentication(sessionId: string): void {
    this.scraperService.completeAuthentication(sessionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.scraperService.fetchInvoices(sessionId)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (session) => {
              const index = this.activeSessions.findIndex(s => s.id === sessionId);
              if (index > -1) {
                this.activeSessions[index] = session;
              }
              
              if (session.status === 'completed') {
                this.snackBar.open('Invoice download completed!', 'Close', { duration: 3000 });
                this.loadData(); // Refresh to show new invoices
              }
            },
            error: (error) => {
              console.error('Error fetching invoices:', error);
              this.snackBar.open('Error fetching invoices', 'Close', { duration: 3000 });
            }
          });
      });
  }

  onInvoiceSelected(targetPageId: string, selectedIds: string[]): void {
    this.selectedInvoicesByTargetPage[targetPageId] = selectedIds;
  }

  onInvoiceViewed(invoice: Invoice): void {
    this.snackBar.open(`Viewing ${invoice.invoiceName}`, 'Close', { duration: 2000 });
    // In a real app, this would open the PDF viewer
  }

  onInvoiceDownloaded(invoice: Invoice): void {
    this.snackBar.open(`Downloading ${invoice.invoiceName}`, 'Close', { duration: 2000 });
    // In a real app, this would trigger the file download
  }

  onInvoiceDeleted(invoice: Invoice): void {
    this.invoiceService.deleteInvoice(invoice.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (success) => {
          if (success) {
            this.invoices = this.invoices.filter(i => i.id !== invoice.id);
            this.snackBar.open(`${invoice.invoiceName} deleted`, 'Close', { duration: 2000 });
          }
        },
        error: (error) => {
          console.error('Error deleting invoice:', error);
          this.snackBar.open('Error deleting invoice', 'Close', { duration: 3000 });
        }
      });
  }

  onSelectedDownloaded(selectedIds: string[]): void {
    this.invoiceService.downloadInvoicesAsZip(selectedIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          this.snackBar.open(`Downloading ${selectedIds.length} invoices as ZIP`, 'Close', { duration: 3000 });
          // In a real app, this would trigger the ZIP download
        },
        error: (error) => {
          console.error('Error downloading ZIP:', error);
          this.snackBar.open('Error downloading ZIP file', 'Close', { duration: 3000 });
        }
      });
  }

  addTargetPage(): void {
    this.snackBar.open('Add Target Page functionality would be implemented here', 'Close', { duration: 3000 });
    // In a real app, this would open a dialog to add a new target page
  }
}