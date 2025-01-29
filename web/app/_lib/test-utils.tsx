import { render } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import React from "react";

interface MockAuth {
  sessionClaims: Record<string, unknown>;
  sessionId: string;
  userId: string | null;
  actor: null;
  orgId: null;
  orgRole: null;
  orgSlug: null;
  orgPermissions: never[];
  session: null;
  user: null;
  organization: null;
  has: () => boolean;
  redirectToSignIn: () => Promise<string>;
}

export const createMockAuth = (userId: string | null = null): MockAuth => ({
  sessionClaims: {},
  sessionId: "test-session-id",
  userId,
  actor: null,
  orgId: null,
  orgRole: null,
  orgSlug: null,
  orgPermissions: [],
  session: null,
  user: null,
  organization: null,
  has: () => false,
  redirectToSignIn: async () => "/sign-in",
}); 

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

export default function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      forcedTheme="light"
    >
      {ui}
    </ThemeProvider>
  );
}