import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Input } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";
import { Link } from "@heroui/link";
import { useNavigate } from "react-router-dom";

import { useLogin } from "@/components/hooks/use-auth";
import { EyeIcon, EyeOffIcon } from "@/components/icons";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);

  const login = useLogin();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { email, password },
      {
        onSuccess: () => navigate("/"),
      },
    );
  };

  return (
    <div className="min-h-[100dvh] grid place-items-center">
      <Card className="w-full max-w-md ">
        <CardHeader className="flex-col items-center gap-1 pb-0">
          <h1 className="text-lg font-semibold">Sign in</h1>
          <p className="text-sm text-foreground-500">
            Welcome back. Please enter your details.
          </p>
        </CardHeader>

        <CardBody>
          <form className="space-y-3" onSubmit={onSubmit}>
            <Input
              autoComplete="email"
              isDisabled={login.isPending}
              label="Email"
              placeholder="you@example.com"
              type="email"
              value={email}
              onValueChange={setEmail}
            />

            <Input
              autoComplete={remember ? "current-password" : "off"}
              endContent={
                <button
                  aria-label={show ? "Hide password" : "Show password"}
                  className="outline-none"
                  type="button"
                  onClick={() => setShow((s) => !s)}
                >
                  {show ? (
                    <EyeOffIcon className="size-5 text-foreground-500" />
                  ) : (
                    <EyeIcon className="size-5 text-foreground-500" />
                  )}
                </button>
              }
              isDisabled={login.isPending}
              label="Password"
              placeholder="••••••••"
              type={show ? "text" : "password"}
              value={password}
              onValueChange={setPassword}
            />

            <div className="flex items-center justify-between">
              <Checkbox
                isSelected={remember}
                size="sm"
                onValueChange={setRemember}
              >
                Remember me
              </Checkbox>

              <Link color="foreground" href="#" size="sm">
                Forgot password?
              </Link>
            </div>

            <Button
              className="w-full bg-amber-700 text-amber-50 hover:bg-amber-800"
              isDisabled={login.isPending}
              radius="sm"
              type="submit"
            >
              {login.isPending ? "Logging in..." : "Sign in"}
            </Button>

            {login.isError && (
              <p className="text-danger text-sm">
                {(login.error as any)?.message ?? "Login failed"}
              </p>
            )}
          </form>
        </CardBody>

        <CardFooter className="justify-center">
          <p className="text-xs text-foreground-500">
            Don’t have an account?{" "}
            <Link color="primary" href="#" size="sm">
              Create one
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
