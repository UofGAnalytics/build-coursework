import { getSavedState } from '../util';

export type State = {
  theme: string;
  font: string;
  fontSize: string;
  lineSpacing: string;
  letterSpacing: string;
  lineWidth: string;
};

export const defaultState: State = Object.freeze({
  theme: 'theme-light',
  font: 'font-default',
  fontSize: '1',
  lineSpacing: '1',
  letterSpacing: '0',
  lineWidth: '1',
});

export const state = getSavedState('view-options', defaultState);
