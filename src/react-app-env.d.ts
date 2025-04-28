/// <reference types="react-scripts" />

// 确保 JSX 元素能被使用
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// 声明模块，避免导入错误
declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.jpg' {
  const content: any;
  export default content;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// 扩展 React 的命名空间
declare namespace React {
  interface FunctionComponent<P = {}> {
    (props: P): JSX.Element | null;
  }

  type FC<P = {}> = FunctionComponent<P>;
} 