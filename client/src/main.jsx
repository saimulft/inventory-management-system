import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GlobalProvider } from "./Providers/GlobalProviders.jsx";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from 'axios'
import AuthProvider from "./Providers/AuthProvider.jsx";
import StoreProvider from "./Providers/StoreProvider.jsx";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { ChatProvider } from "./Providers/ChatProvider.jsx";
import Cookies from "js-cookie";
import NotificationProvider from "./Providers/NotificationProvider.jsx";
const queryClient = new QueryClient()
import CryptoJS from "crypto-js"
axios.defaults.baseURL = "http://localhost:5000"

// interceptor for set token in headers
axios.interceptors.request.use(
  (config) => {
    const decryptToken = (encryptedToken, secretKey) => {
      try {
        const decryptedBytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
        const decryptedToken = decryptedBytes.toString(CryptoJS.enc.Utf8);
        return decryptedToken;
      } catch (error) {
        return undefined;
      }
    };

    const encryptedTokenFromCookie = Cookies.get('imstoken');
    const token = decryptToken(encryptedTokenFromCookie, "e74cca3d65c871d49a7508bac94a1a4c41b843528411a5823b04d5921d2bf6e0b016164cssdf");

    config.headers.authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GlobalProvider>
        <NotificationProvider>
          <ChatProvider>
            <StoreProvider>
              <App />
            </StoreProvider>
          </ChatProvider>
        </NotificationProvider>
      </GlobalProvider>
    </AuthProvider>
  </QueryClientProvider>
);
