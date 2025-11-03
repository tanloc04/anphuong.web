import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { RecoilRoot } from 'recoil';
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

const value = {
  ripple: true
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RecoilRoot>
      <PrimeReactProvider value={value}>
        <RouterProvider router={router} />
      </PrimeReactProvider>
    </RecoilRoot>
  </StrictMode>
);