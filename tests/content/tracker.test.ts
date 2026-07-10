import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConversationTracker } from '../../src/content/tracker';
import type { IConversationStore, IOverlayUI, ConversationRecord } from '../../src/shared/types';

function makeStore(records: ConversationRecord[] = []): IConversationStore {
  const map = new Map<string, ConversationRecord>();
  for (const r of records) map.set(r.id, { ...r });
  return {
    create: vi.fn(async (r) => { map.set(r.id, { ...r }); }),
    update: vi.fn(async (id, fields) => {
      const r = map.get(id);
      if (r) Object.assign(r, fields);
    }),
    findByUrl: vi.fn(async (url) => {
      for (const r of map.values()) { if (r.url === url) return { ...r }; }
      return null;
    }),
    findAll: vi.fn(async () => [...map.values()]),
    delete: vi.fn(async (id) => { map.delete(id); }),
  };
}

function makeOverlay(): IOverlayUI {
  return {
    mount: vi.fn(),
    unmount: vi.fn(),
    update: vi.fn(),
    setState: vi.fn(),
    isMounted: vi.fn(() => true),
  };
}

describe('ConversationTracker', () => {
  it('start creates a new record and updates overlay', async () => {
    const store = makeStore();
    const overlay = makeOverlay();
    const tracker = new ConversationTracker(store, overlay);

    const record = await tracker.start('https://chatgpt.com/c/1', 'chatgpt');

    expect(record.url).toBe('https://chatgpt.com/c/1');
    expect(record.platform).toBe('chatgpt');
    expect(record.waterMl).toBe(0);
    expect(store.create).toHaveBeenCalled();
    expect(overlay.update).toHaveBeenCalledWith(0);
  });

  it('resume loads existing record', async () => {
    const existing: ConversationRecord = {
      id: 'uuid-1',
      url: 'https://chatgpt.com/c/1',
      platform: 'chatgpt',
      topic: 'Old chat',
      waterMl: 150,
      tokenCount: 500,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const store = makeStore([existing]);
    const overlay = makeOverlay();
    const tracker = new ConversationTracker(store, overlay);

    const record = await tracker.resume('https://chatgpt.com/c/1');

    expect(record).not.toBeNull();
    expect(record!.waterMl).toBe(150);
    expect(overlay.update).toHaveBeenCalledWith(150);
  });

  it('resume returns null for unknown url', async () => {
    const store = makeStore();
    const overlay = makeOverlay();
    const tracker = new ConversationTracker(store, overlay);

    const record = await tracker.resume('https://unknown.com');

    expect(record).toBeNull();
  });

  it('addDelta increments waterMl and tokens via params object', async () => {
    const store = makeStore();
    const overlay = makeOverlay();
    const tracker = new ConversationTracker(store, overlay);

    await tracker.start('https://chatgpt.com/c/1', 'chatgpt');
    await tracker.addDelta({ ml: 3, tokens: 1000 });

    const current = tracker.getCurrent();
    expect(current!.waterMl).toBe(3);
    expect(current!.tokenCount).toBe(1000);
    expect(overlay.update).toHaveBeenCalledWith(3);
  });

  it('addDelta updates topic when provided', async () => {
    const store = makeStore();
    const overlay = makeOverlay();
    const tracker = new ConversationTracker(store, overlay);

    await tracker.start('https://chatgpt.com/c/1', 'chatgpt');
    await tracker.addDelta({ ml: 0, tokens: 0, topic: 'New Topic' });

    expect(tracker.getCurrent()!.topic).toBe('New Topic');
  });
});
