import '../styles/globals.scss';
import '../components/Orb/Orb.scss'; // Thêm dòng này

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;