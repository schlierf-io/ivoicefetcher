export interface TargetPage {
  id: string;
  name: string;
  url: string;
  scraperType: string;
  config: TargetPageConfig;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TargetPageConfig {
  loginUrl: string;
  invoicesUrl: string;
  selectors: {
    invoiceList: string;
    downloadLink: string;
    invoiceDate: string;
    invoiceName: string;
  };
}

export interface ScrapingSession {
  id: string;
  targetPageId: string;
  status: 'authenticating' | 'fetching' | 'downloading' | 'completed' | 'error';
  progress: ScrapingProgress;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface ScrapingProgress {
  totalInvoices: number;
  processedInvoices: number;
  downloadedInvoices: number;
  failedInvoices: number;
  currentStep: string;
}