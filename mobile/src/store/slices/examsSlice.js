import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  exams: [],
  currentExam: null,
  results: [],
  loading: false,
  error: null,
};

const examsSlice = createSlice({
  name: 'exams',
  initialState,
  reducers: {
    setExams: (state, action) => {
      state.exams = action.payload;
    },
    setCurrentExam: (state, action) => {
      state.currentExam = action.payload;
    },
    setResults: (state, action) => {
      state.results = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setExams, setCurrentExam, setResults, setLoading, setError } = examsSlice.actions;
export default examsSlice.reducer;