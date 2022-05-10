import { amber, deepOrange } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: deepOrange[900],
    },
    secondary: {
      main: amber[500],
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
});

export default theme;
