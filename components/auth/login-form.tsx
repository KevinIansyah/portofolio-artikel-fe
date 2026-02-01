"use client";

import { useLanguage } from "@/hooks/use-language";

import ValidationError from "@/components/validation-error";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/types/api";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setValidationErrors({});

    try {
      await login(email, password);

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);

        if (err.errors) {
          setValidationErrors(err.errors);
        }
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t("heading.login.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("heading.login.description")}</p>
        </div>

        {/* GENERAL ERROR */}
        {error && <ValidationError message={error} />}

        {/* EMAIL */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="youremail@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          {validationErrors.email && <ValidationError message={validationErrors.email[0]} />}
        </Field>

        {/* PASSWORD */}
        <Field>
          <FieldLabel htmlFor="password">{t("form.login.label.password")}</FieldLabel>
          <InputGroup>
            <InputGroupInput id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                aria-label={showPassword ? t("login.hide_password") : t("login.show_password")}
                title={showPassword ? t("login.hide_password") : t("login.show_password")}
                size="icon-xs"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          {validationErrors.password && <ValidationError message={validationErrors.password[0]} />}
        </Field>

        {/* SUBMIT */}
        <Field>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? t("form.login.button.submin.process") : t("form.login.button.submit")}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
