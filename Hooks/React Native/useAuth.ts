/**
 * This hokk is used to authenticate the user with Github/Firebase.
 */

import {
  makeRedirectUri,
  useAuthRequest,
  AuthSessionResult,
} from "expo-auth-session";
import {
  GithubAuthProvider,
  signInWithCredential,
  signOut,
  UserCredential,
} from "firebase/auth";
import {
  GithubStorageKey,
  GITHUB_CRED,
  GITHUB_DISCOVERY,
  GITHUB_SCOPE,
  REDIRECT_URI,
  SERVER_URL,
} from "../constants/Common";

// This auth is just getAuth method provided by firebase wrap with the initializaApp method
import { auth } from "../methods/initFIrebase";

import { useSecureStore } from "./useSecureStore";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

async function createTokenWithCode(code: any, redirect_uri: string) {
  const url = `${SERVER_URL}auth?code=${code}&redirect_uri=${redirect_uri}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return res.json();
}

async function getGithubTokenAsync(
  response: AuthSessionResult,
  redirect_uri: string
): Promise<{
  access_token?: string;
  error?: string;
  type: string;
  message?: string;
}> {
  try {
    if (response.type !== "success") {
      // type === 'cancel' = if you cancel out of the modal
      // type === 'error' = if you click "no" on the redirect page
      return { type: response.type };
    }
    const { params } = response;
    // this is different to `type === 'error'`
    if (params.error) {
      const { error, error_description } = params;
      if (error === "redirect_uri_mismatch") {
        console.warn(
          `Please set the "Authorization callback URL" in your Github application settings to ${redirect_uri}`
        );
        return { error, message: error_description, type: "error" };
      }
      throw new Error(`Github Auth: ${error} ${error_description}`);
    }
    const { access_token } = await createTokenWithCode(
      params.code,
      redirect_uri
    );
    return { access_token, type: "success" };
  } catch ({ message }) {
    console.log("getGithubTokenAsync: C: ", { message });
    return { type: "error" };
  }
}

const SCHEME = Constants.manifest?.scheme;
WebBrowser.maybeCompleteAuthSession();
const USE_PROXY = Platform.select({
  web: false,
  default: Constants.appOwnership === "standalone" ? false : true,
});
const REDIRECT_URI = makeRedirectUri({
  useProxy: USE_PROXY,
  native: REDIRECT_URI,
});

export default function useAuth() {
  const { save, getValuesFor, remove } = useSecureStore();
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: GITHUB_CRED.id,
      scopes: GITHUB_SCOPE,
      redirectUri: REDIRECT_URI,
      extraParams: {
        // On Android it will just skip right past sign in otherwise
        show_dialog: "true",
      },
    },
    GITHUB_DISCOVERY
  );

  async function signInAsync(token?: string): Promise<{
    githubToken?: string;
    user?: UserCredential["user"];
    message?: string;
    type: string;
  }> {
    try {
      if (!token) {
        const response = await promptAsync({ useProxy: USE_PROXY });

        const { type, access_token, error, message } =
          await getGithubTokenAsync(response, REDIRECT_URI);
        if (type === "success" && access_token) {
          await save(GithubStorageKey, access_token);
          return signInAsync(access_token);
        } else {
          return {
            type: "error",
            message: "No token found",
          };
        }
      }
      const credential = GithubAuthProvider.credential(token);
      const res = await signInWithCredential(auth, credential);
      return {
        githubToken: token,
        user: res.user,
        type: "success",
      };
    } catch ({ message }) {
      console.log(message);
      await remove(GithubStorageKey);
      await signOutAsync();
      return {
        message: "Something went wrong",
        type: "error",
      };
    }
  }

  async function signOutAsync() {
    try {
      await remove(GithubStorageKey);
      await signOut(auth);
    } catch ({ message }) {
      console.log(message);
    }
  }

  async function attemptToRestoreAuthAsync() {
    let token = await getValuesFor(GithubStorageKey);
    if (token) {
      console.log("Token found in the storage", token);
      return signInAsync(token);
    }
  }
  return {
    signInAsync,
    signOutAsync,
    attemptToRestoreAuthAsync,
  };
}
