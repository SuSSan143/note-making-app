import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import UserContextProvider from "./context/UserContext";
import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <UserContextProvider>
          <App />
        </UserContextProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
