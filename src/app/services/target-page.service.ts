import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { TargetPage } from '../models/target-page.model';

@Injectable({
  providedIn: 'root'
})
export class TargetPageService {
  private dummyTargetPages: TargetPage[] = [
    {
      id: '1',
      name: 'Klarmobil',
      url: 'https://www.klarmobil.de/online-service',
      scraperType: 'klarmobil',
      config: {
        loginUrl: 'https://www.klarmobil.de/online-service',
        invoicesUrl: 'https://www.klarmobil.de/online-service/meine-rechnungen',
        selectors: {
          invoiceList: '.invoice-item',
          downloadLink: '.download-pdf',
          invoiceDate: '.invoice-date',
          invoiceName: '.invoice-title'
        }
      },
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'Deutsche Telekom',
      url: 'https://www.telekom.de/kundencenter',
      scraperType: 'telekom',
      config: {
        loginUrl: 'https://www.telekom.de/kundencenter/login',
        invoicesUrl: 'https://www.telekom.de/kundencenter/rechnungen',
        selectors: {
          invoiceList: '.bill-item',
          downloadLink: '.download-button',
          invoiceDate: '.bill-date',
          invoiceName: '.bill-title'
        }
      },
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '3',
      name: 'Vodafone',
      url: 'https://www.vodafone.de/meinvodafone',
      scraperType: 'vodafone',
      config: {
        loginUrl: 'https://www.vodafone.de/meinvodafone/login',
        invoicesUrl: 'https://www.vodafone.de/meinvodafone/rechnungen',
        selectors: {
          invoiceList: '.invoice-row',
          downloadLink: '.pdf-download',
          invoiceDate: '.date-column',
          invoiceName: '.invoice-description'
        }
      },
      isActive: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ];

  getAllTargetPages(): Observable<TargetPage[]> {
    return of(this.dummyTargetPages).pipe(delay(300));
  }

  getActiveTargetPages(): Observable<TargetPage[]> {
    const activePages = this.dummyTargetPages.filter(page => page.isActive);
    return of(activePages).pipe(delay(300));
  }

  getTargetPageById(id: string): Observable<TargetPage | undefined> {
    const targetPage = this.dummyTargetPages.find(page => page.id === id);
    return of(targetPage).pipe(delay(200));
  }

  addTargetPage(targetPage: Omit<TargetPage, 'id' | 'createdAt' | 'updatedAt'>): Observable<TargetPage> {
    const newTargetPage: TargetPage = {
      ...targetPage,
      id: (this.dummyTargetPages.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.dummyTargetPages.push(newTargetPage);
    return of(newTargetPage).pipe(delay(500));
  }

  updateTargetPage(id: string, updates: Partial<TargetPage>): Observable<TargetPage | null> {
    const index = this.dummyTargetPages.findIndex(page => page.id === id);
    if (index > -1) {
      this.dummyTargetPages[index] = {
        ...this.dummyTargetPages[index],
        ...updates,
        updatedAt: new Date()
      };
      return of(this.dummyTargetPages[index]).pipe(delay(400));
    }
    return of(null).pipe(delay(400));
  }

  deleteTargetPage(id: string): Observable<boolean> {
    const index = this.dummyTargetPages.findIndex(page => page.id === id);
    if (index > -1) {
      this.dummyTargetPages.splice(index, 1);
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }
}