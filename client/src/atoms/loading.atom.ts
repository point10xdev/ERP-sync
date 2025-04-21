import { atom } from 'recoil';

export const loadingState = atom<{
  [key: string]: boolean;
}>({
  key: 'loadingState',
  default: {},
}); 