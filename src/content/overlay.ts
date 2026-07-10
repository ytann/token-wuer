import type { IOverlayUI, OverlayState } from '../shared/types';

const OVERLAY_ID = 'wc-overlay';
const STYLE_ID = 'wc-overlay-styles';
const MAX_WATER_ML = 500;

const CSS = `
#${OVERLAY_ID} {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2147483647;
  width: 200px;
  height: 280px;
  background: linear-gradient(135deg, rgba(30, 60, 120, 0.65), rgba(20, 40, 90, 0.75));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  user-select: none;
  cursor: grab;
  transition: opacity 300ms, transform 300ms;
}

#${OVERLAY_ID}:active {
  cursor: grabbing;
}

#${OVERLAY_ID}[data-state="minimized"] {
  height: 48px;
  overflow: hidden;
}

#${OVERLAY_ID} .wc-header {
  display: flex;
  justify-content: flex-end;
  padding: 6px 8px;
  gap: 4px;
}

#${OVERLAY_ID} .wc-minimize,
#${OVERLAY_ID} .wc-close {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: background 200ms;
}

#${OVERLAY_ID} .wc-minimize:hover,
#${OVERLAY_ID} .wc-close:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

#${OVERLAY_ID} .wc-water-container {
  position: relative;
  width: 100%;
  height: calc(100% - 32px);
  overflow: hidden;
}

#${OVERLAY_ID} .wc-water-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0%;
  background: linear-gradient(180deg, rgba(30, 144, 255, 0.7), rgba(0, 100, 200, 0.85));
  transition: height 300ms ease-in-out;
  border-top: 2px solid rgba(100, 180, 255, 0.6);
}

#${OVERLAY_ID} .wc-water-fill::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 0;
  right: 0;
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
}

#${OVERLAY_ID} .wc-counter {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
  white-space: nowrap;
  z-index: 1;
}
`;

export class WaterOverlay implements IOverlayUI {
  private el: HTMLElement | null = null;
  private styleEl: HTMLStyleElement | null = null;
  private fillEl: HTMLElement | null = null;
  private counterEl: HTMLElement | null = null;
  private mounted = false;

  private dragStartX = 0;
  private dragStartY = 0;
  private origLeft = 0;
  private origTop = 0;
  private dragging = false;

  mount(): void {
    if (this.mounted) return;

    this.styleEl = document.createElement('style');
    this.styleEl.id = STYLE_ID;
    this.styleEl.textContent = CSS;
    document.head.appendChild(this.styleEl);

    this.el = document.createElement('div');
    this.el.id = OVERLAY_ID;
    this.el.setAttribute('data-state', 'idle');
    this.el.innerHTML = `
      <div class="wc-header">
        <button class="wc-minimize" title="Minimize">_</button>
        <button class="wc-close" title="Close">\u00d7</button>
      </div>
      <div class="wc-water-container">
        <div class="wc-water-fill"></div>
        <div class="wc-counter">\ud83d\udca7 0 ml</div>
      </div>
    `;

    document.body.appendChild(this.el);

    this.fillEl = this.el.querySelector('.wc-water-fill');
    this.counterEl = this.el.querySelector('.wc-counter');

    this.el.addEventListener('mousedown', this.onDragStart);
    document.addEventListener('mousemove', this.onDragMove);
    document.addEventListener('mouseup', this.onDragEnd);

    const minimizeBtn = this.el.querySelector('.wc-minimize') as HTMLElement;
    const closeBtn = this.el.querySelector('.wc-close') as HTMLElement;

    minimizeBtn.addEventListener('mousedown', (e) => e.stopPropagation());
    closeBtn.addEventListener('mousedown', (e) => e.stopPropagation());

    minimizeBtn.addEventListener('click', () => {
      this.toggleMinimize();
    });
    closeBtn.addEventListener('click', () => {
      this.unmount();
    });

    this.mounted = true;
  }

  unmount(): void {
    if (!this.mounted) return;

    if (this.el) {
      this.el.removeEventListener('mousedown', this.onDragStart);
      this.el.remove();
      this.el = null;
    }

    document.removeEventListener('mousemove', this.onDragMove);
    document.removeEventListener('mouseup', this.onDragEnd);

    if (this.styleEl) {
      this.styleEl.remove();
      this.styleEl = null;
    }

    this.fillEl = null;
    this.counterEl = null;
    this.mounted = false;
    this.dragging = false;
  }

  update(ml: number): void {
    if (!this.fillEl || !this.counterEl) return;

    const pct = Math.min((ml / MAX_WATER_ML) * 100, 100);
    this.fillEl.style.height = `${pct}%`;

    this.counterEl.textContent = `\ud83d\udca7 ${ml} ml`;
  }

  setState(state: OverlayState): void {
    if (!this.el) return;
    this.el.setAttribute('data-state', state);
  }

  isMounted(): boolean {
    return this.mounted;
  }

  private toggleMinimize(): void {
    if (!this.el) return;
    const current = this.el.getAttribute('data-state');
    if (current === 'minimized') {
      this.setState('active');
    } else {
      this.setState('minimized');
    }
  }

  private onDragStart = (e: MouseEvent): void => {
    if (!this.el) return;
    this.dragging = true;
    const rect = this.el.getBoundingClientRect();
    this.origLeft = rect.left;
    this.origTop = rect.top;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
  };

  private onDragMove = (e: MouseEvent): void => {
    if (!this.dragging || !this.el) return;
    const dx = e.clientX - this.dragStartX;
    const dy = e.clientY - this.dragStartY;
    this.el.style.top = `${this.origTop + dy}px`;
    this.el.style.right = 'auto';
    this.el.style.left = `${this.origLeft + dx}px`;
  };

  private onDragEnd = (): void => {
    this.dragging = false;
  };
}
