import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchBookings = createAsyncThunk('bookings/fetchBookings', async () => {
    const response = await axios.get('http://localhost:5000/api/bookings');
    return response.data;
});

const bookingSlice = createSlice({
    name: 'bookings',
    initialState: { data: [], status: 'idle', error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchBookings.fulfilled, (state, action) => {
            state.data = action.payload;
        });
    }
});
export default bookingSlice.reducer;
