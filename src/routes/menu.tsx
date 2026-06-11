import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useState } from "react";
import { Utensils, Coffee, Leaf, Drumstick } from "lucide-react";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Al Fajr Foods | Biryani, BBQ, Broast & Breakfast" },
      { name: "description", content: "Browse the full Al Fajr Foods menu — desi rice, BBQ, fast food, breakfast and beverages. Vegetarian and non-vegetarian options." },
      { property: "og:title", content: "Al Fajr Foods Menu" },
      { property: "og:description", content: "Full menu of Pakistani favorites — biryani, kababs, broast, halwa puri and more." },
    ],
  }),
  component: MenuPage,
});

type Section = { title: string; items: string[] };

const foodVeg: Section[] = [
  { title: "Desi & Rice", items: ["Channa Salan", "Channa Alo Tarkari", "Halwa", "Chapati / Roti"] },
  { title: "Breakfast", items: ["Halwa Puri (Specialty)", "Channa Alo", "Traditional Breakfast Platter"] },
  { title: "Sides & Add-ons", items: ["Raita", "Mint Chutney", "Salad", "Pickles"] },
];

const foodNonVeg: Section[] = [
  { title: "Desi & Rice", items: ["Chicken Biryani with Raita (Most Popular)", "Chicken Pulao Rice"] },
  { title: "Bar B Que (BBQ)", items: ["Turkish Kabab", "Chicken Tikka", "Chicken Seekh Kabab", "Beef Seekh Kabab", "Mixed BBQ Platter"] },
  { title: "Fast Food & Rolls", items: ["Chicken Broast", "Zinger Burger", "Chicken Sandwich", "Chicken Chutney Roll", "Chicken Cheese Roll", "Assorted Chicken Rolls"] },
];

const beverages: Section[] = [
  { title: "Refreshers", items: ["Strawberry Lemonade", "Fresh Lime", "Mint Margarita"] },
  { title: "Soft Drinks", items: ["Cold Drinks (Regular)", "Cold Drinks (1.5 L)", "Mineral Water"] },
  { title: "Hot", items: ["Doodh Patti Chai", "Karak Chai", "Green Tea"] },
];

type Tab = "food" | "beverages";
type Diet = "all" | "veg" | "nonveg";

function MenuPage() {
  const [tab, setTab] = useState<Tab>("food");
  const [diet, setDiet] = useState<Diet>("all");

  const sections =
    tab === "beverages"
      ? beverages
      : diet === "veg"
      ? foodVeg
      : diet === "nonveg"
      ? foodNonVeg
      : [...foodNonVeg, ...foodVeg];

  return (
    <SiteLayout>
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-10">
        <div className="max-w-3xl">
          <span className="text-xs uppercase tracking-[0.25em] text-accent">The Menu</span>
          <h1 className="font-display text-5xl md:text-7xl mt-3 leading-[0.95]">Everything we cook, in one place.</h1>
          <p className="text-muted-foreground text-lg mt-5 leading-relaxed">From breakfast halwa puri to late-night biryani — explore our food and beverage menu. Tap a category to dive in.</p>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <CategoryButton active={tab === "food"} onClick={() => setTab("food")} icon={<Utensils className="w-4 h-4" />}>
            Food
          </CategoryButton>
          <CategoryButton active={tab === "beverages"} onClick={() => setTab("beverages")} icon={<Coffee className="w-4 h-4" />}>
            Beverages
          </CategoryButton>
        </div>

        {tab === "food" && (
          <div className="mt-6 flex flex-wrap gap-2">
            <DietChip active={diet === "all"} onClick={() => setDiet("all")}>All</DietChip>
            <DietChip active={diet === "veg"} onClick={() => setDiet("veg")} icon={<Leaf className="w-3.5 h-3.5" />}>
              Vegetarian
            </DietChip>
            <DietChip active={diet === "nonveg"} onClick={() => setDiet("nonveg")} icon={<Drumstick className="w-3.5 h-3.5" />}>
              Non-Vegetarian
            </DietChip>
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((s) => (
            <div key={s.title} className="tilt-card bg-card border border-border/60 rounded-3xl p-7 shadow-[var(--shadow-soft)]">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-border/60">
                <h3 className="font-display text-2xl">{s.title}</h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">{s.items.length}</span>
              </div>
              <ul className="space-y-3">
                {s.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 group">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0 group-hover:scale-150 transition-transform" />
                    <span className="text-[15px] text-foreground/90 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 md:p-10 rounded-3xl border border-border/60 bg-[var(--gradient-warm)] text-primary-foreground flex flex-col md:flex-row items-start md:items-center gap-6 justify-between shadow-[var(--shadow-elegant)]">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] opacity-70">Ready to order?</p>
            <h3 className="font-display text-3xl md:text-4xl mt-2">Call us — we'll have it hot and ready.</h3>
          </div>
          <a href="tel:+923320336000" className="px-7 py-3.5 rounded-full bg-[var(--gradient-gold)] text-[oklch(0.2_0.04_30)] font-medium hover:-translate-y-0.5 transition-transform">
            +92 332 0336000
          </a>
        </div>
      </section>
    </SiteLayout>
  );
}

function CategoryButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
        active
          ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
          : "bg-card text-foreground border border-border hover:bg-secondary"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function DietChip({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition ${
        active ? "bg-accent text-accent-foreground" : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}