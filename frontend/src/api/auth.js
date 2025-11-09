const BASE_URL = "http://localhost:8080";

async function request(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return data;
}

export function registerUser(payload) {
  // adapt path to your backend (example)
  return request("/api/auth/register", payload);
}

export function registerGarage(payload) {
  // adapt path to your backend (example)
  return request("/api/register/garage", payload);
}

export function loginUser(payload) {
  // adapt path to your backend (example)
  return request("/api/auth/login", payload);
}
