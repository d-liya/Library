export default function useLocalStorage() {
  const get = (key: string) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  };
  const set = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };
  const remove = (key: string) => {
    localStorage.removeItem(key);
  };
  return {
    get,
    set,
    remove,
  };
}
