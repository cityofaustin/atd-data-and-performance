import ErrorBoundary from "../components/ErrorBoundary";
import ErrorFallback from "../components/ErrorFallback";
import UmamiAnalytics from "../components/UmamiAnalytics";
import "../styles/global.scss";

function App({ Component, pageProps }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <UmamiAnalytics />
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}

export default App;
