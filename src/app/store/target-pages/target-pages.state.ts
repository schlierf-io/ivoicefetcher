import { TargetPage } from '../../models/target-page.model';

export interface TargetPagesState {
  targetPages: TargetPage[];
  selectedTargetPage: TargetPage | null;
  isLoading: boolean;
  error: string | null;
}

export const initialTargetPagesState: TargetPagesState = {
  targetPages: [],
  selectedTargetPage: null,
  isLoading: false,
  error: null
};