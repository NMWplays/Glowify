declare const SpotiKit: any;

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}


declare module '*?worker' {
  const source: string;
  export default source;
}
