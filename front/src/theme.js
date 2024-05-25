import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1d1d1d",
    },
  },
  images: {
    logo: require("./assets/images/SpellBoard_dark_bg.png"),
    brand: require("./assets/images/icon_dark_bg.png"),
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#ffffff",
      paper: "#f4f4f4",
    },
  },
  images: {
    logo: require("./assets/images/SpellBoard_light_bg.png"),
    brand: require("./assets/images/icon_light_bg.png"),
  },
});
