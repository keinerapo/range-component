import "@testing-library/jest-dom/vitest";
import { configureAxe, toHaveNoViolations } from "jest-axe";
import { expect, beforeAll, afterEach, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "./server";

expect.extend(toHaveNoViolations);

export const axe = configureAxe({});

beforeAll(() => {
  server.listen({ onUnhandledRequest: "warn" });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
