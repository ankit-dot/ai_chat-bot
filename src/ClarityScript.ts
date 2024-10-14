"use client";

import { useEffect } from 'react';

declare global {
  interface Window {
    clarity: (...args: any[]) => void;
  }
}

const ClarityScript: React.FC = () => {
  useEffect(() => {
    (function (c: any, l: Document, a: string, r: string, i: string) {
      c[a] =
        c[a] ||
        function (...args: any[]) {
          (c[a].q = c[a].q || []).push(args);
        };

      // Explicitly typing `t` as HTMLScriptElement
      const t: HTMLScriptElement = l.createElement(r) as HTMLScriptElement;
      t.async = true;
      t.src = 'https://www.clarity.ms/tag/' + i;
      
      const y = l.getElementsByTagName(r)[0];
      if (y && y.parentNode) {
        y.parentNode.insertBefore(t, y);
      }
    })(window, document, 'clarity', 'script', 'oijlg11hjl');
  }, []);

  return null;
};

export default ClarityScript;
