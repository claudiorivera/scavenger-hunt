import { Link, styled } from "@mui/material";

const StyledLink = styled(Link)({
  cursor: "pointer",
  "&:hover": {
    textDecoration: "none",
  },
});

export default StyledLink;
