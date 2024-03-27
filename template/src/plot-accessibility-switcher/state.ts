import { getSavedState } from '../util';

export type State = {
  plotAccessibility: string;
};

export const defaultState: State = Object.freeze({
  plotAccessibility: 'visualisation',
});

export const state = getSavedState('environment', defaultState);
