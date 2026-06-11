import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/orders")({
  head: () => ({ meta: [{ title: "My Orders — Al Fajr Foods" }] }),
  component: OrdersPage,
});

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
  confirmed: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  preparing: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  ready: "bg-purple-500/15 text-purple-700 dark:text-purple-400",
  on_the_way: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400",
  delivered: "bg-green-500/15 text-green-700 dark:text-green-400",
  cancelled: "bg-red-500/15 text-red-700 dark:text-red-400",
};

function OrdersPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["my-orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <SiteLayout>
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl md:text-5xl">My Orders</h1>
            <p className="text-muted-foreground mt-2">Aap ki saari orders ki history.</p>
          </div>
          <Link to="/menu" className="text-sm text-primary hover:underline">+ Naya order</Link>
        </div>

        {isLoading && <p className="text-muted-foreground">Loading...</p>}
        {!isLoading && (!data || data.length === 0) && (
          <div className="bg-card border border-border/60 rounded-2xl p-12 text-center">
            <p className="text-muted-foreground">Abhi koi order nahi.</p>
            <Link to="/menu" className="inline-block mt-4 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm">Menu dekhein</Link>
          </div>
        )}

        <div className="space-y-4">
          {data?.map((o: any) => (
            <div key={o.id} className="bg-card border border-border/60 rounded-2xl p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Order #{o.id.slice(0, 8)}</p>
                  <p className="font-display text-xl mt-1">Rs {o.total_pkr}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(o.created_at).toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[o.status] || "bg-muted"}`}>{o.status}</span>
                  <span className="text-xs text-muted-foreground capitalize">{o.method}</span>
                </div>
              </div>
              <ul className="space-y-1 text-sm border-t border-border pt-3">
                {o.order_items?.map((it: any) => (
                  <li key={it.id} className="flex justify-between">
                    <span>{it.quantity}× {it.name}</span>
                    <span className="text-muted-foreground">Rs {it.line_total_pkr}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}