import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { MantineProvider } from "@mantine/core";

import { ReceiptListPage } from "./RecieptListPage.tsx";

const router = createBrowserRouter([
  { path: "/", element: <ReceiptListPage /> }
,
]);

createRoot(document.getElementById("root")!).render(
  <MantineProvider>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </MantineProvider>,
);
