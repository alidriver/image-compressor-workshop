/// <reference types="vite/client" />

declare module 'virtual:version-mtimes' {
  const value: Record<string, number>;
  export default value;
}
