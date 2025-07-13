import { Injectable } from '@angular/core';
import { Observable, of, delay, interval, map, take } from 'rxjs';
import { ScrapingSession, ScrapingProgress } from '../models/target-page.model';

@Injectable({
  providedIn: 'root'
})
export class ScraperService {
  private activeSessions: Map<string, ScrapingSession> = new Map();

  startAuthentication(targetPageId: string): Observable<ScrapingSession> {
    const sessionId = this.generateSessionId();
    const session: ScrapingSession = {
      id: sessionId,
      targetPageId,
      status: 'authenticating',
      progress: {
        totalInvoices: 0,
        processedInvoices: 0,
        downloadedInvoices: 0,
        failedInvoices: 0,
        currentStep: 'Opening browser window for authentication...'
      },
      startedAt: new Date()
    };

    this.activeSessions.set(sessionId, session);
    return of(session).pipe(delay(1000));
  }

  fetchInvoices(sessionId: string): Observable<ScrapingSession> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Simulate the fetching process
    return this.simulateFetchingProcess(session);
  }

  getSessionStatus(sessionId: string): Observable<ScrapingSession | null> {
    const session = this.activeSessions.get(sessionId);
    return of(session || null).pipe(delay(100));
  }

  getAllActiveSessions(): Observable<ScrapingSession[]> {
    return of(Array.from(this.activeSessions.values())).pipe(delay(100));
  }

  private simulateFetchingProcess(session: ScrapingSession): Observable<ScrapingSession> {
    const totalInvoices = Math.floor(Math.random() * 5) + 3; // 3-7 invoices
    
    return interval(1000).pipe(
      take(totalInvoices + 3), // +3 for setup steps
      map((step) => {
        const updatedSession = { ...session };
        
        if (step === 0) {
          updatedSession.status = 'fetching';
          updatedSession.progress = {
            ...updatedSession.progress,
            totalInvoices,
            currentStep: 'Navigating to invoices page...'
          };
        } else if (step === 1) {
          updatedSession.progress = {
            ...updatedSession.progress,
            currentStep: 'Scanning for available invoices...'
          };
        } else if (step === 2) {
          updatedSession.status = 'downloading';
          updatedSession.progress = {
            ...updatedSession.progress,
            currentStep: 'Starting invoice downloads...'
          };
        } else {
          const invoiceIndex = step - 2;
          const isSuccess = Math.random() > 0.1; // 90% success rate
          
          updatedSession.progress = {
            ...updatedSession.progress,
            processedInvoices: invoiceIndex,
            downloadedInvoices: isSuccess ? 
              updatedSession.progress.downloadedInvoices + 1 : 
              updatedSession.progress.downloadedInvoices,
            failedInvoices: isSuccess ? 
              updatedSession.progress.failedInvoices : 
              updatedSession.progress.failedInvoices + 1,
            currentStep: `Downloading invoice ${invoiceIndex}/${totalInvoices}...`
          };

          if (invoiceIndex === totalInvoices) {
            updatedSession.status = 'completed';
            updatedSession.completedAt = new Date();
            updatedSession.progress.currentStep = 'Download completed successfully!';
          }
        }

        this.activeSessions.set(session.id, updatedSession);
        return updatedSession;
      })
    );
  }

  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9);
  }

  // Simulate authentication completion (would be called when user completes manual auth)
  completeAuthentication(sessionId: string): Observable<boolean> {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.status = 'fetching';
      session.progress.currentStep = 'Authentication completed. Starting invoice fetch...';
      this.activeSessions.set(sessionId, session);
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(500));
  }

  // Clean up completed sessions
  removeSession(sessionId: string): void {
    this.activeSessions.delete(sessionId);
  }
}