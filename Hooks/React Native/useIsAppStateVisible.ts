/**
 * Check if the app is in teh background or the foregorund.
 */

import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

export default function useIsAppStateVisible() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const handleAppState = (nextAppState: AppStateStatus) => {
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };
  useEffect(() => {
    AppState.addEventListener("change", handleAppState);
    return () => {
      AppState.removeEventListener("change", handleAppState);
    };
  }, []);
  return appStateVisible;
}
