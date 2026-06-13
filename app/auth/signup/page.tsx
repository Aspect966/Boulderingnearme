"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { signUp } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await signUp(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader>
          <h1 className="text-2xl font-bold text-stone-900">Join the community</h1>
          <p className="text-sm text-stone-600">
            Share outdoor boulders and help build consensus grades. No email verification required.
          </p>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <Input name="display_name" placeholder="Display name" />
            <Input name="email" type="email" placeholder="Email" required />
            <Input
              name="password"
              type="password"
              placeholder="Password (min 6 characters)"
              minLength={6}
              required
            />
            <label className="flex items-start gap-3 text-sm text-stone-600">
              <input
                name="accept_terms"
                type="checkbox"
                value="yes"
                required
                className="mt-1 h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="font-medium text-amber-700 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-medium text-amber-700 hover:underline">
                  Privacy Policy
                </Link>
                , including assumption of risk for outdoor activities.
              </span>
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Creating account..." : "Create account"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-stone-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-amber-700 hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
