import { getSavedState } from '../util';

export type State = {
  platform: string;
  program: string;
};

export const defaultState: State = Object.freeze({
  platform: 'mac',
  program: 'cli',
});

export const state = getSavedState('environment', defaultState);
