import "../styles/main.scss";
import { AuthProvider } from "../auth/auth";
import { FirebaseProvider} from "../firebase/FirebaseContext";

export default function MyApp({ Component, pageProps }) {
  return (
    <FirebaseProvider>
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
    </FirebaseProvider>
  );
}
