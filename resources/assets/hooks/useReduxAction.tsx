// Components==============
import { store } from 'components/App/components/UnauthenticatedApp';
import { useDispatch } from 'react-redux';
// =========================

export type AppDispatch = typeof store.dispatch;
// TODO: Find better solution for as any patch
export const useReduxAction = () => useDispatch<AppDispatch>() as any; // Export a hook that can be reused to resolve type
