import { InvoicesState } from './invoices/invoices.state';
import { TargetPagesState } from './target-pages/target-pages.state';
import { ScrapingState } from './scraping/scraping.state';

export interface AppState {
  invoices: InvoicesState;
  targetPages: TargetPagesState;
  scraping: ScrapingState;
}