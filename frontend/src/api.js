const BASE = '/api';

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const tasksApi = {
  list: () => fetch(`${BASE}/tasks`).then(handle),
  create: (task) =>
    fetch(`${BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    }).then(handle),
  update: (id, task) =>
    fetch(`${BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    }).then(handle),
  remove: (id) => fetch(`${BASE}/tasks/${id}`, { method: 'DELETE' }).then(handle),
};

export const currencyApi = {
  convert: (from, to, amount) =>
    fetch(`${BASE}/currency/convert?from=${from}&to=${to}&amount=${amount}`).then(handle),
};
