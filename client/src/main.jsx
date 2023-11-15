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
import NotificationProvider from "./Providers/NotificationProvider.jsx";
const queryClient = new QueryClient()

axios.defaults.baseURL = "http://localhost:5000"

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
