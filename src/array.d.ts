declare global {
  interface Array<T> {
    clone: () => Array<T>;
  }
}
