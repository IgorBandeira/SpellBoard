import { createSlice } from "@reduxjs/toolkit";
import { darkTheme, lightTheme } from "../../theme";

const initialState = {
  value: darkTheme,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.value =
        state.value.palette.mode === "dark" ? lightTheme : darkTheme;
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
