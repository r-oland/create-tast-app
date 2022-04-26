// Components==============
import { store } from 'components/App/components/UnauthenticatedApp';
import { useDispatch } from 'react-redux';
// =========================

export type AppDispatch = typeof store.dispatch;
export const useReduxAction = () => useDispatch<AppDispatch>(); // Export a hook that can be reused to resolve type
