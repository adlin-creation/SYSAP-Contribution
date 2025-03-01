import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
// imports compoenents to set-up react query, which is used for fetching as weel as posting data.
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const root = ReactDOM.createRoot(document.getElementById("root"));

// create react query client
// so that components in the App can access the react query functions
const reactQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // avoid automatic refresh of the current page
      refetchOnWindowFocus: false,
    },
  },
});

root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Now, all the components have access to react query
    because they are wrapped inside the QueryClientProvider component */}
      <QueryClientProvider client={reactQueryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
