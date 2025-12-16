// frontend\src\redux\features\propertyDraftSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: null,
  identity: null,
  location: null,
  legalStatus: null,
  ownership: null,
  boundaries: null,
  additionalInfo: null,
};

const propertyDraftSlice = createSlice({
  name: "propertyDraft",
  initialState,
  reducers: {
    setStatus(state, action) {
      state.status = action.payload;
    },
    setIdentity(state, action) {
      state.identity = action.payload;
    },
    setLocation(state, action) {
      state.location = action.payload;
    },
    setLegalStatus(state, action) {
      state.legalStatus = action.payload;
    },
    setOwnership(state, action) {
      state.ownership = action.payload;
    },
    setBoundaries(state, action) {
      state.boundaries = action.payload;
    },
    setAdditionalInfo(state, action) {
      state.additionalInfo = action.payload;
    },
    resetDraft() {
      return initialState;
    },
  },
});

export const {
  setStatus,
  setIdentity,
  setLocation,
  setLegalStatus,
  setOwnership,
  setBoundaries,
  setAdditionalInfo,
  resetDraft,
} = propertyDraftSlice.actions;

export default propertyDraftSlice.reducer;
