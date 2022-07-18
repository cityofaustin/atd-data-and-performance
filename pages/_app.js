import ErrorBoundary from "../components/ErrorBoundary";
import "../styles/global.scss";

function App({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}

export default App;
