import { getSavedState } from '../util';

export type State = {
  program: string;
};

export const defaultState: State = Object.freeze({
  program: 'github-desktop',
});

export const state = getSavedState('environment', defaultState);
