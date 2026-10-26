import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "./auth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — Al Fajr Foods" },
      { name: "description", content: "Create your Al Fajr Foods account to place orders." },
    ],
  }),
  component: () => <AuthPage initialMode="signup" />,
});
