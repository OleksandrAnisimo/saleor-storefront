import * as React from "react";

import { ApolloConsumer } from "react-apollo";
import { Footer, MainMenu, MobileNav, SearchOverlay, TopNavOverlay } from "..";
import { CartOverlay } from "../CartOverlay";
import CartProvider from "../CartProvider";
import { LoginOverlay } from "../LoginOverlay";
import { NotificationOverlay } from "../NotificationOverlay";
import { PasswordOverlay } from "../PasswordOverlay";
import { Routes } from "./routes";

import "./scss/index.scss";

const App: React.SFC<{}> = () => (
  <ApolloConsumer>
    {client => (
      <CartProvider apolloClient={client}>
        <header>
          <MainMenu />
        </header>
        <Routes />
        <Footer />
        <CartOverlay />
        <LoginOverlay />
        <PasswordOverlay />
        <MobileNav />
        <NotificationOverlay />
        <SearchOverlay />
        <TopNavOverlay />
      </CartProvider>
    )}
  </ApolloConsumer>
);

export default App;
