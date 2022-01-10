/**
 * Accessing secure storage on Android and iOS
 */

import * as SecureStore from "expo-secure-store";
export const useSecureStore = () => {
  const save = async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  };
  const getValuesFor = async (key: string) => {
    return SecureStore.getItemAsync(key);
  };
  const remove = async (key: string) => {
    return SecureStore.deleteItemAsync(key);
  };
  return {
    save,
    getValuesFor,
    remove,
  };
};
