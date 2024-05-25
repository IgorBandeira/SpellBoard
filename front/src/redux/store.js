import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import boardReducer from "./features/boardSlice";
import favouriteReducer from "./features/favouriteSlice";
import themeReducer from "./features/themeSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    board: boardReducer,
    favourites: favouriteReducer,
    theme: themeReducer,
  },
});
