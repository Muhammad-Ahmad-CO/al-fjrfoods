import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useState } from "react";
import { Utensils, Coffee, Leaf, Drumstick, Plus, Minus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { dishImageFor } from "@/lib/dishImages";
import { toast } from "sonner";

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

type Product = {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  diet: string;
  price_pkr: number;
};

type Tab = "food" | "beverages";
type Diet = "all" | "veg" | "nonveg";

function MenuPage() {
  const [tab, setTab] = useState<Tab>("food");
  const [diet, setDiet] = useState<Diet>("all");
  const cart = useCart();

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, category, subcategory, diet, price_pkr")
        .eq("is_available", true)
        .order("sort_order");
      if (error) throw error;
      return data as Product[];
    },
  });

  const filtered = (products || []).filter((p) => {
    if (tab === "beverages") return p.category === "beverages";
    if (p.category !== "food") return false;
    if (diet === "veg") return p.diet === "veg";
    if (diet === "nonveg") return p.diet === "nonveg";
    return true;
  });

  const sections = Array.from(
    filtered.reduce<Map<string, Product[]>>((acc, p) => {
      const key = p.subcategory || "Other";
      if (!acc.has(key)) acc.set(key, []);
      acc.get(key)!.push(p);
      return acc;
    }, new Map()),
  );

  const qtyOf = (id: string) => cart.items.find((i) => i.id === id)?.quantity || 0;

  return (
    <SiteLayout>
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-10">
        <div className="max-w-3xl">
          <span className="text-xs uppercase tracking-[0.25em] text-accent">The Menu</span>
          <h1 className="font-display text-5xl md:text-7xl mt-3 leading-[0.95]">Everything we cook, in one place.</h1>
          <p className="text-muted-foreground text-lg mt-5 leading-relaxed">From breakfast halwa puri to late-night biryani — add items and place your order from the cart.</p>
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
        {isLoading && <p className="text-muted-foreground">Loading menu...</p>}
        {sections.map(([title, list]) => (
          <div key={title} className="mb-14">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/60">
              <h3 className="font-display text-3xl">{title}</h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">{list.length} items</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((p) => {
                const q = qtyOf(p.id);
                return (
                  <div key={p.id} className="tilt-card group bg-card rounded-3xl overflow-hidden border border-border/60 shadow-[var(--shadow-soft)] flex flex-col">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={dishImageFor(p.subcategory, p.category)} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <div className="p-5 flex flex-col gap-3 flex-1">
                      <div className="flex-1">
                        <p className="font-display text-xl leading-snug">{p.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">Rs {p.price_pkr}</p>
                      </div>
                      {q > 0 ? (
                        <div className="flex items-center gap-1 border border-border rounded-full self-start">
                          <button onClick={() => cart.setQty(p.id, q - 1)} className="p-2 hover:text-primary"><Minus className="w-3.5 h-3.5" /></button>
                          <span className="w-6 text-center text-sm">{q}</span>
                          <button onClick={() => cart.setQty(p.id, q + 1)} className="p-2 hover:text-primary"><Plus className="w-3.5 h-3.5" /></button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            cart.add({ id: p.id, name: p.name, price_pkr: p.price_pkr });
                            toast.success(`${p.name} added to cart`);
                          }}
                          className="self-start px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:opacity-90"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

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