import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  payments: [],
  loading: false,
  error: null,
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setPayments: (state, action) => {
      state.payments = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setPayments, setLoading, setError } = paymentsSlice.actions;
export default paymentsSlice.reducer;