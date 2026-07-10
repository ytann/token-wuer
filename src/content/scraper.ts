import type { ITextScraper, PlatformConfig } from '../shared/types';

const TRACKED_ATTR = 'data-wc-tracked';

export class DOMScraper implements ITextScraper {
  private observer: MutationObserver | null = null;
  private callbacks: Array<(delta: string) => void> = [];

  constructor(private config: PlatformConfig) {}

  attach(container: Element): void {
    const selector = this.config.selectors.messages;

    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof Element)) continue;

          const messageNodes = node.matches(selector)
            ? [node]
            : Array.from(node.querySelectorAll(selector));

          for (const msgNode of messageNodes) {
            if (msgNode.hasAttribute(TRACKED_ATTR)) continue;
            msgNode.setAttribute(TRACKED_ATTR, '1');

            const text = (msgNode as HTMLElement).textContent ?? '';
            if (text.trim().length > 0) {
              for (const cb of this.callbacks) {
                cb(text);
              }
            }
          }
        }
      }
    });

    this.observer.observe(container, {
      childList: true,
      subtree: true,
    });
  }

  detach(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

  onNewText(callback: (delta: string) => void): () => void {
    this.callbacks.push(callback);
    return () => {
      const idx = this.callbacks.indexOf(callback);
      if (idx >= 0) this.callbacks.splice(idx, 1);
    };
  }
}
