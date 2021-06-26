import { createMuiTheme } from "@material-ui/core/styles";
import { primaryColor, secondaryColor } from "config";

const theme = createMuiTheme({
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
});

export default theme;
