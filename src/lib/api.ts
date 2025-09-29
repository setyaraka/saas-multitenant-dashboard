import { useAuth } from "@/store/auth";

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
  