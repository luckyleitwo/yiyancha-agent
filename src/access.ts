import type { InitialState } from '@/utils/authSession';

export default (initialState: InitialState | undefined) => ({
  isLoggedIn: initialState?.authStatus === 'authenticated',
});
