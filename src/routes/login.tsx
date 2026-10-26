import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "./auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — Al Fajr Foods" },
      { name: "description", content: "Sign in to your Al Fajr Foods account to place orders." },
    ],
  }),
  component: () => <AuthPage initialMode="signin" />,
});
