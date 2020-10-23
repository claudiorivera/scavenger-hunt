import { Container, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React from "react";
import StyledButton from "./StyledButton";

const CollectSuccess = ({ itemDescription, successfulImageSource, userid }) => {
  const router = useRouter();
  return (
    <Container align="center" maxWidth="xs">
      <Typography variant="h3">You found {itemDescription}!</Typography>
      <img
        src={successfulImageSource}
        width="300px"
        alt="Successfully uploaded photo"
      />
      <StyledButton
        size="large"
        fullWidth
        color="secondary"
        variant="contained"
        onClick={() => {
          router.push("/collect");
        }}
      >
        Find More
      </StyledButton>
      <StyledButton
        size="large"
        fullWidth
        color="secondary"
        variant="contained"
        onClick={() => {
          router.push(`/collections/${userid}`);
        }}
      >
        View My Collection
      </StyledButton>
    </Container>
  );
};

CollectSuccess.propTypes = {
  itemDescription: PropTypes.string.isRequired,
  successfulImageSource: PropTypes.string.isRequired,
  userid: PropTypes.string.isRequired,
};

export default CollectSuccess;
