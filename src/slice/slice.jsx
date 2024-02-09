import { createSlice } from '@reduxjs/toolkit';
//
const initialState = {
  account: '',
  positionCount: 0,
  proceedsCount: 0,
  pending: 0,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setAccount: (state, action) => {
      state.account = action.payload;
    },
    setPositionCount: (state, action) => {
      state.positionCount = action.payload;
    },
    setProceedsCount: (state, action) => {
      state.proceedsCount = action.payload;
    },
    increasePending(state) {
      state.pending++;
    },
    decreasePending(state) {
      state.pending--;
    },
  },
});

export const {
  setAccount,
  setPositionCount,
  setProceedsCount,
  increasePending,
  decreasePending,
} = counterSlice.actions;

export default counterSlice.reducer;
