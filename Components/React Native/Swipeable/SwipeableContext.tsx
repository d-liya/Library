import React, { createContext, useMemo, useState } from "react";
type ContextProps = {
  openedItemKey: number;
  setOpenedItemKey: Function;
  isFocusedScreen: boolean;
};
type Props = {
  initialOpenedItemKey?: number;
  children?: JSX.Element;
  isFocusedScreen: boolean;
};
const swipeContextValues: ContextProps = {
  openedItemKey: 0,
  setOpenedItemKey: () => {},
  isFocusedScreen: false,
};

export const SwipeContext = createContext(swipeContextValues);

export function SwipeProvider({
  initialOpenedItemKey = 0,
  children,
  isFocusedScreen,
}: Props) {
  const [openedItemKey, setOpenedItemKey] = useState(initialOpenedItemKey);

  const value = useMemo(() => {
    return {
      openedItemKey,
      setOpenedItemKey,
      isFocusedScreen,
    };
  }, [openedItemKey, isFocusedScreen]);

  return (
    <SwipeContext.Provider value={value}>{children}</SwipeContext.Provider>
  );
}

SwipeProvider.Context = SwipeContext;
