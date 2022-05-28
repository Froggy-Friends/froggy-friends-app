import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface MusicState {
  isPlaying: boolean;
}

const initialState: MusicState = {
  isPlaying: false
}

const musicSlice = createSlice({
  name: "music",
  initialState,
  reducers: {
    togglePlay(state, action) {
      state.isPlaying = action.payload.isPlaying;
    }
  }
});

export const { togglePlay } = musicSlice.actions;

export const isPlaying = (state: RootState) => state.music.isPlaying;

export default musicSlice.reducer;