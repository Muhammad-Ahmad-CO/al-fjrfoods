import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { SiteLayout } from "@/components/SiteLayout";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — Al Fajr Foods" },
      { name: "description", content: "Sign in or create your Al Fajr Foods account to place orders." },
    ],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email("Sahi email daalein").max(255);
const passwordSchema = z.string().min(6, "Password kam az kam 6 characters").max(72);
const nameSchema = z.string().trim().min(2, "Naam zaroori hai").max(80);
const phoneSchema = z.string().trim().min(7, "Phone zaroori hai").max(20);

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const e1 = emailSchema.safeParse(email);
      const e2 = passwordSchema.safeParse(password);
      if (!e1.success) throw new Error(e1.error.issues[0].message);
      if (!e2.success) throw new Error(e2.error.issues[0].message);

      if (mode === "signup") {
        const n = nameSchema.safeParse(fullName);
        const p = phoneSchema.safeParse(phone);
        if (!n.success) throw new Error(n.error.issues[0].message);
        if (!p.success) throw new Error(p.error.issues[0].message);
        const { error } = await supabase.auth.signUp({
          email: e1.data,
          password: e2.data,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: n.data, phone: p.data },
          },
        });
        if (error) throw error;
        toast.success("Account ban gaya! Aap ab order kar sakte hain.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: e1.data,
          password: e2.data,
        });
        if (error) throw error;
        toast.success("Welcome back!");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kuch ghalat ho gaya");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) toast.error("Google sign-in fail ho gaya");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteLayout>
      <section className="max-w-md mx-auto px-6 py-20">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl">{mode === "signin" ? "Welcome back" : "Account banayein"}</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {mode === "signin" ? "Order karne ke liye sign in karein" : "Sirf 1 minute me sign up"}
          </p>
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full py-3 rounded-full border border-border bg-card hover:bg-secondary transition flex items-center justify-center gap-3 text-sm font-medium"
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
          Google se continue karein
        </button>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">YA</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Naam</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={80} className="w-full mt-1 px-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} placeholder="+92 3xx xxxxxxx" className="w-full mt-1 px-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none" />
              </div>
            </>
          )}
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} className="w-full mt-1 px-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} maxLength={72} className="w-full mt-1 px-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-60">
            {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          {mode === "signin" ? "Naya account?" : "Pehle se account hai?"}{" "}
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-primary font-medium hover:underline">
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
        <p className="text-center mt-4 text-xs"><Link to="/" className="text-muted-foreground hover:text-foreground">← Home</Link></p>
      </section>
    </SiteLayout>
  );
}