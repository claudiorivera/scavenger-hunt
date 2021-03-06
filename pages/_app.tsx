import { Container, CssBaseline, Grid } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import { MainAppBar } from "components";
import { appTitle } from "config";
import { Provider } from "next-auth/client";
import { AppProps } from "next/app";
import Error from "next/error";
import Head from "next/head";
import PropTypes from "prop-types";
import { useEffect } from "react";
import theme from "styles/theme";
import { SWRConfig } from "swr";
import { fetcher } from "util/index";

const App = (props: AppProps) => {
  const { Component, pageProps } = props;

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  if (pageProps.error) {
    return (
      <Error
        statusCode={pageProps.error.statusCode}
        title={pageProps.error.message}
      />
    );
  }

  return (
    <>
      <Head>
        <title>{appTitle}</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <ThemeProvider theme={theme}>
        <Provider session={pageProps.session}>
          <CssBaseline />
          <SWRConfig
            value={{
              fetcher,
            }}
          >
            <MainAppBar />
            <Container maxWidth="xs">
              <Grid container direction="column" alignItems="center">
                <Component {...pageProps} />
              </Grid>
            </Container>
          </SWRConfig>
        </Provider>
      </ThemeProvider>
    </>
  );
};

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default App;
