import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Orders" }] }),
  component: AdminPage,
});

const STATUSES = ["pending", "confirmed", "preparing", "ready", "on_the_way", "delivered", "cancelled"] as const;

function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("orders").update({ status: status as any, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  }

  if (loading) return <SiteLayout><div className="p-12 text-center text-muted-foreground">Loading...</div></SiteLayout>;
  if (!isAdmin)
    return (
      <SiteLayout>
        <div className="max-w-md mx-auto p-16 text-center">
          <h1 className="font-display text-3xl">Access denied</h1>
          <p className="text-muted-foreground mt-3">Yeh page sirf admin ke liye hai.</p>
        </div>
      </SiteLayout>
    );

  return (
    <SiteLayout>
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="font-display text-4xl md:text-5xl mb-2">Orders Dashboard</h1>
        <p className="text-muted-foreground mb-8">Saari orders ek jagah — status update karein.</p>
        {isLoading && <p>Loading...</p>}
        <div className="space-y-4">
          {data?.map((o: any) => (
            <div key={o.id} className="bg-card border border-border/60 rounded-2xl p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">#{o.id.slice(0, 8)} · {new Date(o.created_at).toLocaleString()}</p>
                  <p className="font-display text-xl mt-1">{o.customer_name}</p>
                  <p className="text-sm">{o.phone}</p>
                  <p className="text-xs text-muted-foreground capitalize mt-1">{o.method}{o.address ? ` · ${o.address}` : ""}</p>
                  {o.notes && <p className="text-xs italic mt-2">"{o.notes}"</p>}
                </div>
                <div>
                  <ul className="text-sm space-y-1">
                    {o.order_items?.map((it: any) => (
                      <li key={it.id} className="flex justify-between">
                        <span>{it.quantity}× {it.name}</span>
                        <span className="text-muted-foreground">Rs {it.line_total_pkr}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="font-display text-lg mt-3 pt-2 border-t border-border">Rs {o.total_pkr}</p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">Status</label>
                  <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="w-full mt-1 px-4 py-3 rounded-xl bg-background border border-border outline-none focus:border-primary">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
          {data?.length === 0 && <p className="text-muted-foreground">Abhi koi order nahi.</p>}
        </div>
      </section>
    </SiteLayout>
  );
}