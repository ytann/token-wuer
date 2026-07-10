import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WaterOverlay } from '../../src/content/overlay';
import type { IOverlayUI } from '../../src/shared/types';

describe('WaterOverlay', () => {
  let overlay: IOverlayUI;

  beforeEach(() => {
    overlay = new WaterOverlay();
  });

  afterEach(() => {
    overlay.unmount();
  });

  it('mounts to document.body', () => {
    overlay.mount();
    const el = document.querySelector('#wc-overlay');
    expect(el).not.toBeNull();
  });

  it('isMounted returns true after mount', () => {
    overlay.mount();
    expect(overlay.isMounted()).toBe(true);
  });

  it('isMounted returns false before mount', () => {
    expect(overlay.isMounted()).toBe(false);
  });

  it('unmount removes from DOM', () => {
    overlay.mount();
    overlay.unmount();
    expect(document.querySelector('#wc-overlay')).toBeNull();
    expect(overlay.isMounted()).toBe(false);
  });

  it('update displays ml value', () => {
    overlay.mount();
    overlay.update(230);
    const counter = document.querySelector('#wc-overlay .wc-counter');
    expect(counter?.textContent).toContain('230');
  });

  it('does not throw if update called before mount', () => {
    expect(() => overlay.update(100)).not.toThrow();
  });

  it('setState adds data-state attribute', () => {
    overlay.mount();
    overlay.setState('minimized');
    const el = document.querySelector('#wc-overlay');
    expect(el?.getAttribute('data-state')).toBe('minimized');
  });
});
