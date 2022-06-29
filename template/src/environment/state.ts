import { getSavedState } from '../util';

export type State = {
  platform: string;
  program: string;
};

export const defaultState: State = Object.freeze({
  platform: 'platform-mac',
  program: 'program-cli',
});

export const state = getSavedState('environment', defaultState);
