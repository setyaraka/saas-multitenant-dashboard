import { useAuth } from "@/store/auth";

const TOKEN_KEY = "auth_token";

export type LoginResponse =
  | { error: string }
  | { access_token?: string; token?: string; user?: any };

export type LoginResult = {
  token: string;
  user: any;
};

export async function login(
  email: string,
  password: string,
  remember = true,
): Promise<LoginResult> {
  const base = import.meta.env.VITE_API_URL ?? "";
  const url = `${base.replace(/\/$/, "")}/auth/login`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error(`Login failed (${res.status})`);
  }

  const data: LoginResponse = await res.json();

  if ("error" in data) {
    throw new Error(data.error || "Invalid credentials");
  }

  const token = data.access_token ?? data.token;

  if (!token) throw new Error("No token received from server");

  const result: LoginResult = {
    token,
    user: data.user ?? { email },
  };

  const store = remember ? localStorage : sessionStorage;

  store.setItem(TOKEN_KEY, token);

  return result;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return Boolean(
    localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY),
  );
}

export const api = {
  async get(path: string, tenantScoped = false) {
    const { userToken, tenantToken } = useAuth.getState();
    const token = tenantScoped ? tenantToken : userToken;
    const res = await fetch(import.meta.env.VITE_API_URL + path, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (res.status === 401) useAuth.getState().clear();

    return res.json();
  },
  async json(
    path: string,
    method: string,
    body: unknown,
    tenantScoped = false,
  ) {
    const { userToken, tenantToken } = useAuth.getState();
    const token = tenantScoped ? tenantToken : userToken;
    const res = await fetch(import.meta.env.VITE_API_URL + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw await res.json();

    return res.json();
  },
  async form(path: string, form: FormData) {
    const { tenantToken } = useAuth.getState();
    const res = await fetch(import.meta.env.VITE_API_URL + path, {
      method: "POST",
      headers: tenantToken ? { Authorization: `Bearer ${tenantToken}` } : {},
      body: form,
    });

    if (!res.ok) throw await res.json();

    return res.json();
  },
};
