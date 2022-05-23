import { CacheProvider, EmotionCache } from "@emotion/react";
import { Container, CssBaseline, Grid } from "@mui/material";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { MainAppBar } from "components";
import { appTitle } from "config";
import { AppProps } from "next/app";
import Error from "next/error";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import PropTypes from "prop-types";
import createEmotionCache from "styles/createEmotionCache";
import theme from "styles/theme";
import { SWRConfig } from "swr";
import { fetcher } from "util/index";

const clientSideEmotionCache = createEmotionCache();

const App = (props: AppProps & { emotionCache: EmotionCache }) => {
  const { Component, pageProps, emotionCache = clientSideEmotionCache } = props;

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
      <CacheProvider value={emotionCache}>
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
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <SessionProvider session={pageProps.session}>
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
            </SessionProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </CacheProvider>
    </>
  );
};

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
  emotionCache: PropTypes.object,
};

export default App;
