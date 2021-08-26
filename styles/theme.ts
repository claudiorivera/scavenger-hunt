import { createTheme } from "@material-ui/core/styles";
import { primaryColor, secondaryColor } from "config";

const theme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor,
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 830,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default theme;
