import { ScrapingSession } from '../../models/target-page.model';

export interface ScrapingState {
  activeSessions: ScrapingSession[];
  isAuthenticated: { [targetPageId: string]: boolean };
  isLoading: boolean;
  error: string | null;
}

export const initialScrapingState: ScrapingState = {
  activeSessions: [],
  isAuthenticated: {},
  isLoading: false,
  error: null
};