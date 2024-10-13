"use client";

import { AppStore, chatBot } from "@/lib/store/store";
import React, { ReactNode, useRef } from "react";
import { Provider } from "react-redux";

const StoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = chatBot();

    // Add initial state
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
};

export default StoreProvider;
