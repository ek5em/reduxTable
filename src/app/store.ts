import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import rowsReducer from './rowsSlice';


export const store = configureStore({
  reducer: {
    rows: rowsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
