import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import jsonData from '../../data/flights.json';
import { BestPrices, Flight } from '../../types/types';

let flightsFromJson = JSON.parse(JSON.stringify(jsonData)).result


interface flightsState {
    flights: Flight[],
    bestPrices: BestPrices
}

const initialState = {
    flights: flightsFromJson.flights,
    bestPrices: flightsFromJson.bestPrices
} satisfies flightsState as flightsState


const flightSlice = createSlice({
    name: 'flights',
    initialState,
    reducers: {
        
    }
})

export default flightSlice.reducer