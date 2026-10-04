import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";
import { resetAccountStore } from "@/lib/utils/account-store";

// Standard in Tests: nicht angemeldet (Fortschritt im Browser). Tests mit Konto setzen den Zustand selbst.
beforeEach(() => {
  resetAccountStore({ status: "anonymous", username: null, progress: {} });
});

afterEach(() => {
  cleanup();
});
