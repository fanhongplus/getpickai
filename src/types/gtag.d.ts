// Google Analytics gtag 类型声明
interface Window {
  gtag: (...args: unknown[]) => void;
  dataLayer: unknown[];
}
