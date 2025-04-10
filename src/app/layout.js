"use client";

import { ApolloProvider } from "@apollo/client";
import client from "../lib/apollo-client";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <ApolloProvider client={client}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ApolloProvider>
  );
}
