import { Button, makeStyles } from "@material-ui/core";
import { ReactNode } from "react";

const useStyles = makeStyles({
  button: {
    margin: "0.5rem",
  },
});

type StyledButtonProps = {
  children: ReactNode;
  [key: string]: any;
};
export const StyledButton = ({
  children,
  ...buttonProps
}: StyledButtonProps) => {
  const styles = useStyles();

  return (
    <Button {...buttonProps} className={styles.button}>
      {children}
    </Button>
  );
};
