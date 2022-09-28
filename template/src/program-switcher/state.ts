import { getSavedState } from '../util';

export type State = {
  program: string;
};

export const defaultState: State = Object.freeze({
  program: 'command-line',
});

export const state = getSavedState('environment', defaultState);
