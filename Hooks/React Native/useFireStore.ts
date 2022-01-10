/**
 * Firestore read and write hook
 */

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../methods/initFIrebase";
import { useAuthStore } from "../redux/authSlice";

export default function useFireStore() {
  const { uuid } = useAuthStore();
  const setDocument = (data: any, docName: string, id?: string) => {
    const ref = doc(db, docName, id ? id : uuid);
    return setDoc(ref, data, { merge: true });
  };
  const getDocument = (docName: string) => {
    const ref = doc(db, docName, uuid);
    return getDoc(ref);
  };
  return {
    setDocument,
    getDocument,
  };
}
