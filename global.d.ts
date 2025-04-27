// global.d.ts
import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // добавляем поддержку <model-viewer>
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src: string;
          alt?: string;
          // атрибуты веб-компонента model-viewer
          'auto-rotate'?: boolean;
          'camera-controls'?: boolean;
          style?: React.CSSProperties;
        },
        HTMLElement
      >;
    }
  }
}