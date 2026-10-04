"use server";

import {
  authenticate,
  createUser,
  normalizeUsername,
  UsernameTakenError,
  validateRegistration,
  type RegistrationErrors,
} from "@/lib/server/accounts";
import { mergeProgress } from "@/lib/server/progress";
import { parseLocalProgress } from "@/lib/server/progress-input";
import { endSession, startSession } from "@/lib/server/session";

export interface FormState {
  ok: boolean;
  message?: string;
  errors?: RegistrationErrors;
  username?: string;
}

function text(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

// F21 + F24: Konto anlegen, anmelden und Browser-Fortschritt übernehmen
export async function registerAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const input = {
    username: text(formData, "benutzername"),
    password: text(formData, "passwort"),
    passwordRepeat: text(formData, "passwortWiederholen"),
  };
  const username = normalizeUsername(input.username);
  const errors = validateRegistration(input);
  if (Object.keys(errors).length > 0) return { ok: false, errors, username };

  try {
    const user = await createUser(username, input.password);
    mergeProgress(user.id, parseLocalProgress(formData.get("lokalerFortschritt")));
    await startSession(user.id);
    return { ok: true, username: user.username };
  } catch (error) {
    if (error instanceof UsernameTakenError) {
      return { ok: false, errors: { username: "Dieser Benutzername ist bereits vergeben." }, username };
    }
    throw error;
  }
}

// F22 + F24: Anmelden und Browser-Fortschritt übernehmen
export async function loginAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const username = text(formData, "benutzername");
  const user = await authenticate(username, text(formData, "passwort"));
  if (!user) return { ok: false, message: "Benutzername oder Passwort ist falsch.", username: normalizeUsername(username) };

  mergeProgress(user.id, parseLocalProgress(formData.get("lokalerFortschritt")));
  await startSession(user.id);
  return { ok: true, username: user.username };
}

// F22: Abmelden
export async function logoutAction(): Promise<void> {
  await endSession();
}
