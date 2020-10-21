import { Link, styled } from "@material-ui/core";

const StyledLink = styled(Link)({
  cursor: "pointer",
  "&:hover": {
    textDecoration: "none",
  },
});

export default StyledLink;
