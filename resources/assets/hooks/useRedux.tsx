import { TypedUseSelectorHook, useSelector } from 'react-redux';

// Use throughout your app instead of plain `useSelector`
export const useRedux: TypedUseSelectorHook<ReduxStore> = useSelector;
