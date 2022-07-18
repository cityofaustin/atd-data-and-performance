import ErrorBoundary from "../components/ErrorBoundary";
import ErrorFallback from "../components/ErrorFallback";
import "../styles/global.scss";

function App({ Component, pageProps }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}

export default App;
