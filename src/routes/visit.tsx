import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { MapPin, Phone, Clock, Car, Wifi, CreditCard, Instagram } from "lucide-react";
import heroBiryani from "@/assets/hero-biryani.jpg";
import bbq from "@/assets/bbq.jpg";
import breakfast from "@/assets/breakfast.jpg";
import burger from "@/assets/burger.jpg";
import interior from "@/assets/interior.jpg";

export const Route = createFileRoute("/visit")({
  head: () => ({
    meta: [
      { title: "Visit Us — Al Fajr Foods, Latifabad Unit 7, Hyderabad" },
      { name: "description", content: "House 46, 7 Latifabad Rd, Unit 7 Block D, Hyderabad. Open till 2 AM. Dine-in, takeout, delivery and free parking." },
      { property: "og:title", content: "Visit Al Fajr Foods" },
      { property: "og:description", content: "Location, hours and directions for Al Fajr Foods, Latifabad." },
      { property: "og:image", content: interior },
    ],
  }),
  component: VisitPage,
});

function VisitPage() {
  return (
    <SiteLayout>
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-12">
        <div className="max-w-3xl">
          <span className="text-xs uppercase tracking-[0.25em] text-accent">Visit Us</span>
          <h1 className="font-display text-5xl md:text-7xl mt-3 leading-[0.95]">Come hungry. Leave happy.</h1>
          <p className="text-muted-foreground text-lg mt-5 leading-relaxed">Find us in the heart of Latifabad — easy to reach, easy to park, and open well past midnight.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-16 grid lg:grid-cols-[1fr_1.2fr] gap-8">
        <div className="space-y-4">
          <InfoCard icon={MapPin} title="Address" lines={["House 46, 99C4+896", "7 Latifabad Rd, Latifabad Unit 7", "Block D, Hyderabad, 71000, Pakistan"]} action={{ href: "https://www.google.com/maps/search/?api=1&query=Al+Fajr+Foods+Latifabad+Unit+7+Hyderabad", label: "Get Directions" }} />
          <InfoCard icon={Clock} title="Hours" lines={["Open daily", "Closes 2 AM", "Breakfast served from early morning"]} />
          <InfoCard icon={Phone} title="Call & Order" lines={["+92 332 0336000", "Dine-in · Takeout · Delivery"]} action={{ href: "tel:+923320336000", label: "Call Now" }} />
        </div>

        <div className="relative tilt-card rounded-[2rem] overflow-hidden border border-border/60 shadow-[var(--shadow-elegant)] min-h-[520px]">
          <iframe
            title="Al Fajr Foods location"
            src="https://www.google.com/maps?q=Al+Fajr+Foods+Latifabad+Unit+7+Hyderabad&output=embed"
            className="absolute inset-0 w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <h2 className="font-display text-3xl md:text-4xl mb-8">Good to know</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Car, label: "Free parking", sub: "Lot & street" },
            { icon: CreditCard, label: "Cash only", sub: "Please carry cash" },
            { icon: Wifi, label: "Wi-Fi available", sub: "Free & paid options" },
            { icon: Clock, label: "Open late", sub: "Until 2 AM daily" },
          ].map((p) => (
            <div key={p.label} className="bg-card border border-border/60 rounded-2xl p-6 shadow-[var(--shadow-soft)]">
              <p.icon className="w-5 h-5 text-accent" />
              <p className="font-medium mt-3">{p.label}</p>
              <p className="text-sm text-muted-foreground mt-1">{p.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-accent">@alfajrfoods</span>
            <h2 className="font-display text-3xl md:text-4xl mt-2">From our Instagram</h2>
          </div>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card hover:bg-secondary transition text-sm font-medium">
            <Instagram className="w-4 h-4" /> Follow us
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {[heroBiryani, bbq, breakfast, burger, interior].map((src, i) => (
            <a key={i} href="https://instagram.com" target="_blank" rel="noreferrer" className="relative aspect-square rounded-2xl overflow-hidden group">
              <img src={src} alt="Instagram post" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition grid place-items-center">
                <Instagram className="w-6 h-6 text-primary-foreground opacity-0 group-hover:opacity-100 transition" />
              </div>
            </a>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

function InfoCard({ icon: Icon, title, lines, action }: { icon: React.ComponentType<{ className?: string }>; title: string; lines: string[]; action?: { href: string; label: string } }) {
  return (
    <div className="bg-card border border-border/60 rounded-3xl p-7 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-10 h-10 rounded-full grid place-items-center bg-secondary"><Icon className="w-5 h-5 text-primary" /></span>
        <h3 className="font-display text-xl">{title}</h3>
      </div>
      {lines.map((l) => (<p key={l} className="text-[15px] text-foreground/85 leading-relaxed">{l}</p>))}
      {action && (
        <a href={action.href} className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-primary hover:gap-3 transition-all">
          {action.label} →
        </a>
      )}
    </div>
  );
}