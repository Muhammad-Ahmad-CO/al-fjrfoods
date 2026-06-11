import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, Instagram, MapPin, Phone, Clock, ShoppingBag, User as UserIcon, LogOut, Shield } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/about", label: "About" },
  { to: "/visit", label: "Visit Us" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/75 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="w-10 h-10 rounded-full grid place-items-center bg-[var(--gradient-warm)] text-primary-foreground font-display text-lg shadow-[var(--shadow-soft)] transition-transform group-hover:rotate-12">AF</span>
            <span className="flex flex-col leading-tight">
              <span className="font-display text-lg text-foreground">Al Fajr Foods</span>
              <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Latifabad · Unit 7</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative"
                activeProps={{ className: "px-4 py-2 text-sm font-semibold text-primary" }}
              >
                {n.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" className="ml-2 inline-flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-primary">
                <Shield className="w-4 h-4" /> Admin
              </Link>
            )}
            <Link to="/checkout" className="ml-2 relative inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition">
              <ShoppingBag className="w-4 h-4" /> Cart
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] w-5 h-5 grid place-items-center rounded-full">{count}</span>
              )}
            </Link>
            {user ? (
              <div className="ml-2 flex items-center gap-1">
                <Link to="/orders" className="px-3 py-2 text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1.5"><UserIcon className="w-4 h-4" />Orders</Link>
                <button onClick={signOut} className="p-2 text-muted-foreground hover:text-primary" aria-label="Sign out"><LogOut className="w-4 h-4" /></button>
              </div>
            ) : (
              <Link to="/auth" className="ml-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition shadow-[var(--shadow-soft)]">
                Sign In
              </Link>
            )}
          </nav>
          <div className="md:hidden flex items-center gap-2">
            <Link to="/checkout" className="relative p-2">
              <ShoppingBag className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] w-4 h-4 grid place-items-center rounded-full">{count}</span>
              )}
            </Link>
            <button className="p-2" onClick={() => setOpen((v) => !v)} aria-label="Menu">
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden border-t border-border/60 bg-background animate-fade-up">
            <div className="flex flex-col px-6 py-4 gap-1">
              {navItems.map((n) => (
                <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-3 text-base font-medium text-foreground">{n.label}</Link>
              ))}
              {user ? (
                <>
                  <Link to="/orders" onClick={() => setOpen(false)} className="py-3 text-base font-medium">My Orders</Link>
                  {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="py-3 text-base font-medium">Admin</Link>}
                  <button onClick={() => { setOpen(false); signOut(); }} className="py-3 text-left text-base font-medium text-muted-foreground">Sign out</button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setOpen(false)} className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium">Sign In</Link>
              )}
              <a href="tel:+923320336000" className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-border text-sm font-medium">
                <Phone className="w-4 h-4" /> +92 332 0336000
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-24 border-t border-border/60 bg-[oklch(0.22_0.04_38)] text-[oklch(0.92_0.02_70)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-full grid place-items-center bg-[var(--gradient-gold)] text-[oklch(0.2_0.04_30)] font-display">AF</span>
              <span className="font-display text-xl">Al Fajr Foods</span>
            </div>
            <p className="text-sm opacity-80 max-w-md leading-relaxed">A well-loved Pakistani kitchen in Latifabad serving biryani, BBQ, broast and halwa puri — all under one warm, family-friendly roof.</p>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-6 text-sm hover:text-[var(--gold)] transition">
              <Instagram className="w-4 h-4" /> @alfajrfoods
            </a>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-4 opacity-60">Visit</h4>
            <p className="text-sm leading-relaxed flex gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" />House 46, 7 Latifabad Rd, Unit 7 Block D, Hyderabad</p>
            <p className="text-sm mt-3 flex gap-2"><Clock className="w-4 h-4 mt-0.5 shrink-0" />Open daily · Closes 2 AM</p>
            <p className="text-sm mt-3 flex gap-2"><Phone className="w-4 h-4 mt-0.5 shrink-0" />+92 332 0336000</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-4 opacity-60">Explore</h4>
            <ul className="space-y-2 text-sm">
              {navItems.map((n) => (
                <li key={n.to}><Link to={n.to} className="hover:text-[var(--gold)] transition">{n.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 text-xs opacity-60 flex flex-col md:flex-row justify-between gap-2">
            <span>© {new Date().getFullYear()} Al Fajr Foods. All rights reserved.</span>
            <span>Cash only · Free parking · Family seating</span>
          </div>
        </div>
      </footer>
    </div>
  );
}