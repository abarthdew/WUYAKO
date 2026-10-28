import { describe, expect, it, vi } from 'vitest';
import { createHttpAdapter } from '../src/features/analytics/adapters/httpAdapter.js';

describe('httpAdapter', () => {
  it('세션을 먼저 등록하고 이벤트를 묶어서 보낸다', async () => {
    const calls = [];
    vi.stubGlobal('fetch', vi.fn(async (url, init) => calls.push([url, JSON.parse(init.body)])));
    const a = createHttpAdapter('/api');
    a.startSession({ id: 's1' });
    a.send({ sessionId: 's1', seq: 1, type: 'tap', ts: 1, payload: { targetId: 'x' } });
    a.send({ sessionId: 's1', seq: 2, type: 'tap', ts: 2, payload: {} });
    a.flush();
    await vi.waitFor(() => expect(calls).toHaveLength(2));
    expect(calls[0]).toEqual(['/api/track/sessions', { id: 's1' }]);
    expect(calls[1][0]).toBe('/api/track/events');
    expect(calls[1][1].events.map((e) => e.seq)).toEqual([1, 2]);
    vi.unstubAllGlobals();
  });
});
