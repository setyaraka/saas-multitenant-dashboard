// src/pages/Login.tsx
import { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Link } from "@heroui/link";
import { useNavigate } from "react-router-dom";

import { assumeTenantById, getMe, login, myTenants } from "@/services/auth";
import { useAuth } from "@/store/auth";
import { queryClient } from "@/lib/react-query";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUserToken, setUser, setTenant } = useAuth();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const emailError = useMemo(() => {
    if (!email) return "";

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Email tidak valid";
  }, [email]);

  const pwdError = useMemo(() => {
    if (!pwd) return "";

    return pwd.length >= 6 ? "" : "Minimal 6 karakter";
  }, [pwd]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (emailError || pwdError || !email || !pwd) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await login({ email, password: pwd });

      setUserToken(res.access_token);
      const me = await getMe();

      setUser({ id: me.userId, email: me.email });
      queryClient.setQueryData(["me"], me);

      const memberships = await myTenants();

      if (!memberships || memberships.length === 0) {
        navigate("/no-tenant");

        return;
      }

      if (memberships.length === 1) {
        const t = memberships[0];
        const assumed = await assumeTenantById(t.tenantId);

        setTenant({
          tenantId: assumed.tenantId,
          token: assumed.token,
          permissions: assumed.permissions ?? t.permissions ?? [],
        });

        navigate("/");

        return;
      }

      navigate("/select-tenant");
    } catch (e: any) {
      const msg =
        e?.status === 401
          ? "Email atau password salah."
          : e?.status === 422
            ? "Data tidak valid."
            : (e?.message ?? "Login gagal. Coba lagi.");

      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-content2/60 to-content1 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mt-5 rounded-2xl shadow-2xl">
        <CardHeader className="flex-col items-center gap-1 pb-0">
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="text-sm text-gray-500">
            Welcome back. Please enter your details.
          </p>
        </CardHeader>

        <CardBody className="pt-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input
                aria-label="Email"
                errorMessage={emailError}
                id="email"
                isInvalid={!!emailError}
                placeholder="you@example.com"
                radius="sm"
                type="email"
                value={email}
                onValueChange={setEmail}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <Input
                aria-label="Password"
                endContent={
                  <button
                    aria-label={showPwd ? "Hide password" : "Show password"}
                    className="text-sm text-gray-500 hover:text-gray-700"
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                  >
                    {showPwd ? "Hide" : "Show"}
                  </button>
                }
                errorMessage={pwdError}
                id="password"
                isInvalid={!!pwdError}
                placeholder="••••••••"
                radius="sm"
                type={showPwd ? "text" : "password"}
                value={pwd}
                onValueChange={setPwd}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <Checkbox
                isSelected={remember}
                size="sm"
                onValueChange={setRemember}
              >
                <span className="text-sm">Remember me</span>
              </Checkbox>

              <Link
                className="text-gray-600"
                href="#"
                size="sm"
                underline="hover"
              >
                Forgot password?
              </Link>
            </div>

            {err && (
              <div className="rounded-lg border border-danger-200 bg-danger-50 px-3 py-2 text-sm text-danger-700">
                {err}
              </div>
            )}

            {/* Tombol utama warna karamel */}
            <Button
              className="w-full h-11 rounded-md bg-[#b68051] text-white font-medium hover:opacity-90"
              isDisabled={!email || !pwd || !!emailError || !!pwdError}
              isLoading={loading}
              type="submit"
            >
              Sign in
            </Button>
          </form>

          <div className="my-4">or continue with</div>

          <Button
            className="w-full h-11 rounded-md justify-start gap-3"
            variant="bordered"
            onPress={() => alert("Continue with Google (demo)")}
          >
            <GoogleIcon className="h-5 w-5" />
            <span className="mx-auto pr-8">Continue with Google</span>
          </Button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link className="text-[#b68051]" href="#" underline="hover">
              Create one
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}

function GoogleIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        d="M12 10.2v3.9h5.5c-.2 1.2-1.6 3.6-5.5 3.6-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 4 1.5l2.7-2.6C16.7 3 14.6 2 12 2 6.9 2 2.7 6.2 2.7 11.3S6.9 20.7 12 20.7c6.1 0 9.3-4.3 9.3-8.2 0-.6-.1-1-.2-1.4H12z"
        fill="#EA4335"
      />
    </svg>
  );
}
