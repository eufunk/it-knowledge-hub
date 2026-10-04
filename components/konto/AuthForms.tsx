"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useSyncExternalStore } from "react";
import { loginAction, registerAction, type FormState } from "@/app/konto/actions";
import { getAccountState, LOADING_STATE, loadAccount, subscribeAccount } from "@/lib/utils/account-store";
import { collectLocalProgress } from "@/lib/utils/progress-store";

const INITIAL: FormState = { ok: false };

const inputClass =
  "mt-1.5 block w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink transition-colors focus:border-accent focus:outline-2 focus:outline-accent/30 aria-invalid:border-danger";
const buttonClass =
  "inline-flex w-full items-center justify-center rounded-xl bg-accent px-5 py-3 font-semibold text-white shadow-sm shadow-accent/25 transition-colors hover:bg-accent-strong focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60";

function Field({
  id,
  label,
  type = "text",
  autoComplete,
  defaultValue,
  error,
  hint,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete: string;
  defaultValue?: string;
  error?: string;
  hint?: string;
}) {
  const describedBy = [error ? `${id}-fehler` : "", hint ? `${id}-hinweis` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={inputClass}
      />
      {hint && !error && (
        <p id={`${id}-hinweis`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-fehler`} className="mt-1 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function useAccount() {
  return useSyncExternalStore(subscribeAccount, getAccountState, () => LOADING_STATE);
}

// Nach Erfolg: Konto neu laden und zum Ziel wechseln. Der Browser-Fortschritt wird mitgeschickt (F24).
function useAuthAction(action: (state: FormState, data: FormData) => Promise<FormState>, next: string) {
  const router = useRouter();
  return useActionState(async (previous: FormState, formData: FormData) => {
    formData.set("lokalerFortschritt", JSON.stringify(collectLocalProgress()));
    const result = await action(previous, formData);
    if (result.ok) {
      await loadAccount();
      router.push(next);
    }
    return result;
  }, INITIAL);
}

function AlreadySignedIn({ username }: { username: string }) {
  return (
    <p className="rounded-xl bg-success-soft p-4 text-sm font-medium text-success">
      Du bist angemeldet als <strong>{username}</strong>.{" "}
      <Link href="/lerninhalte" className="underline">
        Zu den Lerninhalten
      </Link>
    </p>
  );
}

// F22: Anmeldeformular
export function LoginForm({ next }: { next: string }) {
  const account = useAccount();
  const [state, formAction, pending] = useAuthAction(loginAction, next);

  if (account.status === "user" && !pending && !state.ok) return <AlreadySignedIn username={account.username ?? ""} />;

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.message && (
        <p role="alert" className="rounded-xl bg-danger-soft p-3 text-sm font-medium text-danger">
          {state.message}
        </p>
      )}
      <Field id="benutzername" label="Benutzername" autoComplete="username" defaultValue={state.username} />
      <Field id="passwort" label="Passwort" type="password" autoComplete="current-password" />
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "Wird angemeldet …" : "Anmelden"}
      </button>
      <p className="text-center text-sm text-muted">
        Noch kein Konto?{" "}
        <Link href={`/registrieren?weiter=${encodeURIComponent(next)}`} className="font-semibold text-accent hover:underline">
          Jetzt registrieren
        </Link>
      </p>
    </form>
  );
}

// F21: Registrierungsformular
export function RegisterForm({ next }: { next: string }) {
  const account = useAccount();
  const [state, formAction, pending] = useAuthAction(registerAction, next);

  if (account.status === "user" && !pending && !state.ok) return <AlreadySignedIn username={account.username ?? ""} />;

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <Field
        id="benutzername"
        label="Benutzername"
        autoComplete="username"
        defaultValue={state.username}
        error={state.errors?.username}
        hint="3 bis 32 Zeichen: Buchstaben a–z, Ziffern, Punkt, Bindestrich oder Unterstrich"
      />
      <Field
        id="passwort"
        label="Passwort"
        type="password"
        autoComplete="new-password"
        error={state.errors?.password}
        hint="Mindestens 8 Zeichen"
      />
      <Field
        id="passwortWiederholen"
        label="Passwort wiederholen"
        type="password"
        autoComplete="new-password"
        error={state.errors?.passwordRepeat}
      />
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "Konto wird angelegt …" : "Konto anlegen"}
      </button>
      <p className="text-center text-sm text-muted">
        Schon registriert?{" "}
        <Link href={`/anmelden?weiter=${encodeURIComponent(next)}`} className="font-semibold text-accent hover:underline">
          Anmelden
        </Link>
      </p>
    </form>
  );
}
