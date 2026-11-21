// Client for mosAIc's HTTP API. The caller is the trusted integration: it supplies user identity, never the model.
export function mosaicClient(baseUrl, fetchImpl = fetch) {
  const root = baseUrl.replace(/\/+$/, '');
  async function call(method, path, body) {
    const res = await fetchImpl(root + path, {
      method,
      headers: body ? { 'content-type': 'application/json' } : {},
      body: body && JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`mosAIc ${res.status}: ${JSON.stringify(data.detail ?? res.statusText)}`);
    return data;
  }
  return {
    message: (item) => call('POST', '/v1/messages', item),
    observe: (observations) => call('POST', '/v1/observations', { observations }),
    inbox: (user) => call('GET', `/v1/inbox/${encodeURIComponent(user)}`),
  };
}
