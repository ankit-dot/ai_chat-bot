import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
// store variable is a global variable.
export const chatBot = () => {
    return configureStore({
        reducer: {
            user: userReducer,
        },
    });
};

// Infer the type of chatBot
export type AppStore = ReturnType<typeof chatBot>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];