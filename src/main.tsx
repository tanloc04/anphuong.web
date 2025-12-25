import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
import { RecoilRoot } from 'recoil';
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const value = {
  ripple: true
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    },
  },
});

const GOOGLE_CLIENT_ID = "1019604719049-i0na91bgcgaiddk7kim6ck12qotuj38s.apps.googleusercontent.com";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <PrimeReactProvider value={value}>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <RouterProvider router={router} />
          </GoogleOAuthProvider>
        </PrimeReactProvider>
      </RecoilRoot>
    </QueryClientProvider>
  </StrictMode>
);