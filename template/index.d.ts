declare module '*.html' {
  const value: any;
  export = value;
}

interface Window {
  __ENV__: Record<string, string>;
}
