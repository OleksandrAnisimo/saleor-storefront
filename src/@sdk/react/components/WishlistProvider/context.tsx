import * as React from "react";

import { WishlistItem } from "@sdk/fragments/types/WishlistItem";

import { ApolloErrorWithUserInput } from "../../types";

export interface IWishlistContext {
  wishlist: WishlistItem[] | null;
  loading: boolean;
  error: ApolloErrorWithUserInput | null;
  update(wishlist: WishlistItem[]): void;
}

export const WishlistContext = React.createContext<IWishlistContext>({
  error: null,
  loading: false,
  update: wishlist => null,
  wishlist: [],
});

WishlistContext.displayName = "WishlistContext";
