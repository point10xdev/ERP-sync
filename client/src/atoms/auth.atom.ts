import { atom } from 'recoil';
import { AuthResponse } from '../services/auth.service';

export const authState = atom<AuthResponse['user'] | null>({
  key: 'authState',
  default: null,
});

export const isAuthenticatedState = atom<boolean>({
  key: 'isAuthenticatedState',
  default: false,
}); 