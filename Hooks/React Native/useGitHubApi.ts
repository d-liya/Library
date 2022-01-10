/**
 * Crud operations for GitHub API
 */

import {
  deleteInGithub,
  getFromGitHub,
  updateToGithub,
} from "../methods/gitHubApis";
import { useAuthStore } from "../redux/authSlice";

export default function useGitHubApi() {
  const { accessToken } = useAuthStore();
  const get = (url: string) => getFromGitHub(url, accessToken);
  const put = (url: string, body?: BodyInit) =>
    updateToGithub(url, accessToken, body);
  const remove = (url: string, body?: BodyInit) =>
    deleteInGithub(url, accessToken, body);
  return {
    get,
    put,
    remove,
  };
}
