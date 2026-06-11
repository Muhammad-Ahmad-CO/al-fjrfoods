import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import interior from "@/assets/interior.jpg";
import bbq from "@/assets/bbq.jpg";
import breakfast from "@/assets/breakfast.jpg";
import { Award, Heart, Users, Clock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Al Fajr Foods, Latifabad Unit 7" },
      { name: "description", content: "Al Fajr Foods is a family-friendly Pakistani kitchen in Latifabad, Hyderabad — known for biryani, BBQ and a warm dining experience." },
      { property: "og:title", content: "About Al Fajr Foods" },
      { property: "og:description", content: "Our story, kitchen and the people behind Latifabad's beloved restaurant." },
      { property: "og:image", content: interior },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-20">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center">
          <div className="animate-fade-up">
            <span className="text-xs uppercase tracking-[0.25em] text-accent">Our Story</span>
            <h1 className="font-display text-5xl md:text-7xl mt-3 leading-[0.95]">A neighbourhood kitchen with a generous heart.</h1>
            <p className="text-muted-foreground text-lg mt-6 leading-relaxed">
              Al Fajr Foods began as a simple promise to Latifabad: serve fresh, flavorful food the way families cook at home — only better, faster, and from morning till the small hours of the night.
            </p>
            <p className="text-muted-foreground text-lg mt-4 leading-relaxed">
              Today, our copper handis of biryani, smoky kababs, crispy broast and crisp puris feed thousands every week. The recipes are still the same. The welcome is still warm. The portions are still generous.
            </p>
            <Link to="/visit" className="inline-flex items-center gap-2 mt-10 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-medium hover:-translate-y-0.5 transition-transform shadow-[var(--shadow-soft)]">
              Plan a Visit <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative animate-tilt-in">
            <div className="absolute -inset-4 bg-[var(--gradient-gold)] rounded-[2rem] blur-2xl opacity-25 animate-float-slow" />
            <img src={interior} alt="Al Fajr Foods dining area" width={1600} height={1000} loading="lazy" className="relative rounded-[2rem] w-full h-[480px] object-cover shadow-[var(--shadow-elegant)] ring-1 ring-border/60" />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Award, k: "4.0★", v: "4,807 Google reviews" },
            { icon: Users, k: "1000s", v: "Guests served weekly" },
            { icon: Clock, k: "Till 2 AM", v: "Open late, every night" },
            { icon: Heart, k: "Family-first", v: "Built for shared tables" },
          ].map((s) => (
            <div key={s.k} className="tilt-card bg-card border border-border/60 rounded-3xl p-7 shadow-[var(--shadow-soft)]">
              <s.icon className="w-6 h-6 text-accent" />
              <p className="font-display text-3xl mt-4">{s.k}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="tilt-card rounded-[2rem] overflow-hidden relative h-[420px] group">
            <img src={bbq} alt="BBQ at Al Fajr" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative h-full flex flex-col justify-end p-8 text-white">
              <h3 className="font-display text-3xl">Live coal kitchen</h3>
              <p className="mt-2 opacity-90 max-w-md">Every kabab, tikka and seekh is hand-skewered and grilled fresh — no shortcuts, no microwave finishes.</p>
            </div>
          </div>
          <div className="tilt-card rounded-[2rem] overflow-hidden relative h-[420px] group">
            <img src={breakfast} alt="Halwa puri breakfast" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative h-full flex flex-col justify-end p-8 text-white">
              <h3 className="font-display text-3xl">The 7 AM ritual</h3>
              <p className="mt-2 opacity-90 max-w-md">Latifabad wakes up to our halwa puri — fluffy puris, slow-cooked channa and golden semolina halwa, every single morning.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 lg:px-10 py-20 text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-accent">Accessibility & Comfort</span>
        <h2 className="font-display text-4xl md:text-5xl mt-3">Built for everyone at the table.</h2>
        <p className="text-muted-foreground mt-5 max-w-2xl mx-auto leading-relaxed">Wheelchair-accessible entrance, parking, seating and restroom. Assistive hearing loop, high chairs, kids' menu and Wi-Fi — so every guest feels at home.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {["Wheelchair accessible", "Family-friendly", "Kids' menu", "High chairs", "Wi-Fi", "Hearing loop", "Free parking", "Late-night dining", "Vegetarian options"].map((tag) => (
            <span key={tag} className="px-4 py-2 rounded-full text-sm bg-secondary text-secondary-foreground">{tag}</span>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}