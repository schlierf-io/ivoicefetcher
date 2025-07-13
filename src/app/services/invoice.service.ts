import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Invoice } from '../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private dummyInvoices: Invoice[] = [
    {
      id: '1',
      targetPageId: '1',
      filename: 'klarmobil_invoice_2024_01.pdf',
      invoiceName: 'Rechnung Januar 2024',
      invoiceDate: new Date('2024-01-15'),
      downloadDate: new Date('2024-01-16'),
      filePath: '/downloads/klarmobil_invoice_2024_01.pdf',
      fileSize: 245760,
      checksum: 'abc123def456',
      status: 'downloaded',
      createdAt: new Date('2024-01-16')
    },
    {
      id: '2',
      targetPageId: '1',
      filename: 'klarmobil_invoice_2024_02.pdf',
      invoiceName: 'Rechnung Februar 2024',
      invoiceDate: new Date('2024-02-15'),
      downloadDate: new Date('2024-02-16'),
      filePath: '/downloads/klarmobil_invoice_2024_02.pdf',
      fileSize: 251840,
      checksum: 'def456ghi789',
      status: 'downloaded',
      createdAt: new Date('2024-02-16')
    },
    {
      id: '3',
      targetPageId: '1',
      filename: 'klarmobil_invoice_2024_03.pdf',
      invoiceName: 'Rechnung März 2024',
      invoiceDate: new Date('2024-03-15'),
      downloadDate: new Date('2024-03-16'),
      filePath: '/downloads/klarmobil_invoice_2024_03.pdf',
      fileSize: 248320,
      checksum: 'ghi789jkl012',
      status: 'downloaded',
      createdAt: new Date('2024-03-16')
    },
    {
      id: '4',
      targetPageId: '2',
      filename: 'telekom_invoice_2024_01.pdf',
      invoiceName: 'Telekom Rechnung Januar 2024',
      invoiceDate: new Date('2024-01-20'),
      downloadDate: new Date('2024-01-21'),
      filePath: '/downloads/telekom_invoice_2024_01.pdf',
      fileSize: 312480,
      checksum: 'jkl012mno345',
      status: 'downloaded',
      createdAt: new Date('2024-01-21')
    },
    {
      id: '5',
      targetPageId: '2',
      filename: 'telekom_invoice_2024_02.pdf',
      invoiceName: 'Telekom Rechnung Februar 2024',
      invoiceDate: new Date('2024-02-20'),
      downloadDate: new Date('2024-02-21'),
      filePath: '/downloads/telekom_invoice_2024_02.pdf',
      fileSize: 298760,
      checksum: 'mno345pqr678',
      status: 'downloaded',
      createdAt: new Date('2024-02-21')
    }
  ];

  getAllInvoices(): Observable<Invoice[]> {
    return of(this.dummyInvoices).pipe(delay(500));
  }

  getInvoicesByTargetPage(targetPageId: string): Observable<Invoice[]> {
    const filteredInvoices = this.dummyInvoices.filter(
      invoice => invoice.targetPageId === targetPageId
    );
    return of(filteredInvoices).pipe(delay(300));
  }

  deleteInvoice(invoiceId: string): Observable<boolean> {
    const index = this.dummyInvoices.findIndex(invoice => invoice.id === invoiceId);
    if (index > -1) {
      this.dummyInvoices.splice(index, 1);
      return of(true).pipe(delay(200));
    }
    return of(false).pipe(delay(200));
  }

  downloadInvoicesAsZip(invoiceIds: string[]): Observable<Blob> {
    // Simulate ZIP file creation
    const dummyBlob = new Blob(['dummy zip content'], { type: 'application/zip' });
    return of(dummyBlob).pipe(delay(2000));
  }
}