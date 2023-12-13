import { getSavedState } from '../util';

export type State = {
  language: string;
};

export const defaultState: State = Object.freeze({
  language: 'r',
});

export const state = getSavedState('environment', defaultState);
