import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import flightsReducer from './redurers/flightsReducer'
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export type RootState = ReturnType<typeof store.getState>


const rootReducer = combineReducers({
    flights: flightsReducer,
    
})

export const store = configureStore({
    reducer: rootReducer,
})