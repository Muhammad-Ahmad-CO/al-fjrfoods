import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import heroBiryani from "@/assets/hero-biryani.jpg";
import bbq from "@/assets/bbq.jpg";
import breakfast from "@/assets/breakfast.jpg";
import burger from "@/assets/burger.jpg";
import interior from "@/assets/interior.jpg";
import { Star, Instagram, ArrowRight, Flame, Utensils, Sunrise, Coffee } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Al Fajr Foods — Biryani, BBQ & Halwa Puri in Latifabad" },
      { name: "description", content: "Hyderabad's beloved Pakistani kitchen. Biryani, kababs, broast and breakfast served fresh — dine in, takeout, or delivery." },
      { property: "og:title", content: "Al Fajr Foods — Latifabad's home of Biryani & BBQ" },
      { property: "og:description", content: "Family-friendly Pakistani dining in Latifabad Unit 7. Open till 2 AM." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,oklch(0.92_0.06_70/0.6),transparent_60%),radial-gradient(ellipse_at_bottom_left,oklch(0.88_0.08_50/0.5),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 lg:pt-24 pb-20 grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Open now · Closes 2 AM
            </span>
            <h1 className="mt-6 font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95] text-foreground">
              Latifabad's home of <span className="italic text-gradient-gold">Biryani</span>, BBQ & Broast.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Pakistani flavor served fresh under one roof — from saffron-laced biryani to smoky seekh kababs and the neighborhood's most-loved halwa puri.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/menu" className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-primary text-primary-foreground font-medium shadow-[var(--shadow-elegant)] hover:-translate-y-0.5 transition-transform">
                Explore the Menu <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/visit" className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-border bg-card hover:bg-secondary transition font-medium">
                Find Us
              </Link>
            </div>
            <div className="mt-12 flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                {[0,1,2,3].map((i) => (<Star key={i} className="w-4 h-4 fill-[var(--gold)] text-[var(--gold)]" />))}
                <Star className="w-4 h-4 fill-[var(--gold)]/40 text-[var(--gold)]" />
              </div>
              <span className="text-sm text-muted-foreground"><strong className="text-foreground">4.0</strong> · 4,807 reviews on Google</span>
            </div>
          </div>
          <div className="relative animate-tilt-in">
            <div className="absolute -inset-6 bg-[var(--gradient-gold)] rounded-[2.5rem] blur-2xl opacity-30 animate-float-slow" />
            <div className="relative tilt-card rounded-[2rem] overflow-hidden shadow-[var(--shadow-elegant)] ring-1 ring-border/60">
              <img src={heroBiryani} alt="Chicken biryani with raita" width={1600} height={1280} className="w-full h-[520px] lg:h-[640px] object-cover" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-3 backdrop-blur-md bg-background/80 rounded-2xl px-5 py-4 border border-border/60">
                <div>
                  <p className="font-display text-lg">Chicken Biryani</p>
                  <p className="text-xs text-muted-foreground">Most loved · served with raita</p>
                </div>
                <span className="text-xs px-3 py-1.5 rounded-full bg-accent/20 text-accent-foreground font-medium">Signature</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-accent">What we serve</span>
            <h2 className="font-display text-4xl md:text-5xl mt-2">A whole kitchen, one address.</h2>
          </div>
          <Link to="/menu" className="text-sm font-medium text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">View full menu <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { img: heroBiryani, icon: Utensils, title: "Desi & Rice", desc: "Chicken biryani, pulao, channa salan." },
            { img: bbq, icon: Flame, title: "Bar B Que", desc: "Turkish kabab, tikka, seekh." },
            { img: burger, icon: Coffee, title: "Fast Food", desc: "Broast, zinger, chutney rolls." },
            { img: breakfast, icon: Sunrise, title: "Breakfast", desc: "Halwa puri & traditional platters." },
          ].map((c) => (
            <div key={c.title} className="tilt-card group bg-card rounded-3xl overflow-hidden border border-border/60 shadow-[var(--shadow-soft)]">
              <div className="aspect-[4/5] overflow-hidden">
                <img src={c.img} alt={c.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="p-6">
                <c.icon className="w-5 h-5 text-accent mb-3" />
                <h3 className="font-display text-2xl">{c.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative py-24 bg-[oklch(0.22_0.04_38)] text-[oklch(0.95_0.02_80)] overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_50%,oklch(0.78_0.14_75/0.4),transparent_50%)]" />
        <div className="relative max-w-5xl mx-auto px-6 lg:px-10 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">الفجر فوڈز</span>
          <h2 className="font-display text-4xl md:text-6xl mt-4 leading-tight">
            "A well-managed place for eating." <span className="opacity-60">— a guest</span>
          </h2>
          <p className="mt-8 text-lg opacity-80 max-w-2xl mx-auto leading-relaxed">
            From the morning's first puri to a late-night plate of biryani, Al Fajr has been Latifabad's everyday celebration table. Fresh ingredients, generous portions, and a kitchen that never sleeps.
          </p>
          <Link to="/about" className="inline-flex items-center gap-2 mt-10 px-7 py-3.5 rounded-full bg-[var(--gradient-gold)] text-[oklch(0.2_0.04_30)] font-medium hover:-translate-y-0.5 transition-transform">
            Our Story <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-accent">@alfajrfoods</span>
            <h2 className="font-display text-4xl md:text-5xl mt-3">Fresh from our kitchen, daily.</h2>
            <p className="text-muted-foreground mt-5 leading-relaxed">Follow along on Instagram for daily specials, behind-the-counter moments, and a steady feed of food worth showing up for.</p>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-8 px-6 py-3.5 rounded-full border border-border bg-card hover:bg-secondary font-medium transition">
              <Instagram className="w-4 h-4" /> Follow on Instagram
            </a>
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {[heroBiryani, bbq, breakfast, burger, interior, heroBiryani].map((src, i) => (
              <a key={i} href="https://instagram.com" target="_blank" rel="noreferrer" className="relative aspect-square rounded-2xl overflow-hidden group">
                <img src={src} alt="Instagram post" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition grid place-items-center">
                  <Instagram className="w-6 h-6 text-primary-foreground opacity-0 group-hover:opacity-100 transition" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}