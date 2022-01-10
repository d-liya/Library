/**
 * This hook is used to access the file system.
 */

import {
  writeAsStringAsync,
  readAsStringAsync,
  documentDirectory,
  getInfoAsync,
} from "expo-file-system";

export const useFileSystem = () => {
  const writeFile = async (fileUri: string, data: string) => {
    await writeAsStringAsync(documentDirectory + fileUri, data);
  };
  const exists = async (fileUri: string) => {
    const file = await getInfoAsync(documentDirectory + fileUri);
    return file.exists;
  };
  const readFile = async (fileUri: string) => {
    const isExists = await exists(fileUri);
    if (isExists) {
      return readAsStringAsync(documentDirectory + fileUri);
    }
    return "";
  };

  return {
    writeFile,
    readFile,
    exists,
  };
};
