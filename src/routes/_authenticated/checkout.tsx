import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { SiteLayout } from "@/components/SiteLayout";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Minus, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Al Fajr Foods" }] }),
  component: Checkout,
});

const DELIVERY_FEE = 100;

const schema = z.object({
  customer_name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7).max(20),
  method: z.enum(["delivery", "pickup"]),
  address: z.string().trim().max(300).optional(),
  notes: z.string().trim().max(300).optional(),
});

function Checkout() {
  const { items, subtotal, setQty, remove, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [method, setMethod] = useState<"delivery" | "pickup">("delivery");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setName((n) => n || data.full_name || "");
          setPhone((p) => p || data.phone || "");
        }
      });
  }, [user]);

  const deliveryFee = method === "delivery" ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  async function placeOrder() {
    if (items.length === 0) return toast.error("Cart khali hai");
    const parsed = schema.safeParse({
      customer_name: name,
      phone,
      method,
      address: method === "delivery" ? address : undefined,
      notes,
    });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    if (method === "delivery" && (!address || address.trim().length < 5))
      return toast.error("Delivery ke liye address chahiye");

    setSubmitting(true);
    try {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: user!.id,
          status: "pending",
          method,
          customer_name: parsed.data.customer_name,
          phone: parsed.data.phone,
          address: method === "delivery" ? address.trim() : null,
          notes: notes.trim() || null,
          subtotal_pkr: subtotal,
          delivery_fee_pkr: deliveryFee,
          total_pkr: total,
        })
        .select("id")
        .single();
      if (error) throw error;

      const orderItems = items.map((i) => ({
        order_id: order.id,
        product_id: i.id,
        name: i.name,
        unit_price_pkr: i.price_pkr,
        quantity: i.quantity,
        line_total_pkr: i.price_pkr * i.quantity,
      }));
      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
      if (itemsErr) throw itemsErr;

      clear();
      toast.success("Order place ho gaya! Hum jald confirm karenge.");
      navigate({ to: "/orders" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Order fail");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <SiteLayout>
        <section className="max-w-2xl mx-auto px-6 py-24 text-center">
          <h1 className="font-display text-4xl">Cart khali hai</h1>
          <p className="text-muted-foreground mt-3">Menu se kuch add karein.</p>
          <Link to="/menu" className="inline-block mt-6 px-6 py-3 rounded-full bg-primary text-primary-foreground">Menu dekhein</Link>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-4">
          <h1 className="font-display text-4xl">Checkout</h1>

          <div className="bg-card border border-border/60 rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-xl">Order Method</h2>
            <div className="grid grid-cols-2 gap-3">
              {(["delivery", "pickup"] as const).map((m) => (
                <button key={m} type="button" onClick={() => setMethod(m)} className={`px-4 py-3 rounded-xl border text-sm font-medium capitalize ${method === m ? "border-primary bg-primary/5 text-primary" : "border-border"}`}>{m}</button>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border/60 rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-xl">Aap ki details</h2>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Naam</label>
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} className="w-full mt-1 px-4 py-3 rounded-xl bg-background border border-border outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} className="w-full mt-1 px-4 py-3 rounded-xl bg-background border border-border outline-none focus:border-primary" />
            </div>
            {method === "delivery" && (
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Delivery Address</label>
                <textarea value={address} onChange={(e) => setAddress(e.target.value)} maxLength={300} rows={3} className="w-full mt-1 px-4 py-3 rounded-xl bg-background border border-border outline-none focus:border-primary" />
              </div>
            )}
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Notes (optional)</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={300} rows={2} className="w-full mt-1 px-4 py-3 rounded-xl bg-background border border-border outline-none focus:border-primary" />
            </div>
          </div>
        </div>

        <aside className="lg:col-span-2">
          <div className="bg-card border border-border/60 rounded-2xl p-6 sticky top-24">
            <h2 className="font-display text-xl mb-4">Aap ka order</h2>
            <ul className="space-y-3 mb-4 max-h-80 overflow-y-auto">
              {items.map((i) => (
                <li key={i.id} className="flex items-center gap-3 text-sm">
                  <div className="flex-1">
                    <p className="font-medium">{i.name}</p>
                    <p className="text-muted-foreground text-xs">Rs {i.price_pkr} × {i.quantity}</p>
                  </div>
                  <div className="flex items-center gap-1 border border-border rounded-full">
                    <button onClick={() => setQty(i.id, i.quantity - 1)} className="p-1.5"><Minus className="w-3 h-3" /></button>
                    <span className="w-6 text-center text-xs">{i.quantity}</span>
                    <button onClick={() => setQty(i.id, i.quantity + 1)} className="p-1.5"><Plus className="w-3 h-3" /></button>
                  </div>
                  <button onClick={() => remove(i.id)} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                </li>
              ))}
            </ul>
            <div className="border-t border-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>Rs {subtotal}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{deliveryFee ? `Rs ${deliveryFee}` : "Free"}</span></div>
              <div className="flex justify-between font-display text-lg pt-2 border-t border-border"><span>Total</span><span>Rs {total}</span></div>
            </div>
            <button onClick={placeOrder} disabled={submitting} className="mt-5 w-full py-3.5 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-60">
              {submitting ? "Placing..." : "Place Order"}
            </button>
            <p className="text-xs text-muted-foreground mt-3 text-center">Cash on delivery / pickup</p>
          </div>
        </aside>
      </section>
    </SiteLayout>
  );
}