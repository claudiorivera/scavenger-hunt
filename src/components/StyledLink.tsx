import { Link, makeStyles } from "@material-ui/core";
import { ReactNode } from "react";

const useStyles = makeStyles({
  link: {
    cursor: "pointer",
    "&:hover": {
      textDecoration: "none",
    },
  },
});

type StyledLinkProps = {
  children: ReactNode;
  [key: string]: any;
};
export const StyledLink = ({ children, ...linkProps }: StyledLinkProps) => {
  const styles = useStyles();

  return (
    <Link {...linkProps} className={styles.link}>
      {children}
    </Link>
  );
};
