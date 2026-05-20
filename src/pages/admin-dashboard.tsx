import { useCallback, useEffect, useState, type ComponentType, type FormEvent } from "react";
import {
  Activity,
  Ban,
  Clock,
  Globe,
  ListOrdered,
  Mail,
  RefreshCw,
  ShieldBan,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { ADMIN_LOGIN_PATH } from "~/config/env";
import { getAdminEmail } from "~/features/admin/lib/admin-auth";
import {
  adminLogout,
  createSoftBan,
  fetchAdminDashboard,
} from "~/features/admin/lib/admin-api";

const AUTO_REFRESH_MS = 30_000;
import type { AdminDashboardResponse } from "~/features/admin/models/admin.models";
import { cn } from "~/lib/utils";

function formatTimestamp(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function formatRemaining(minutes: number, seconds: number) {
  if (minutes >= 1) {
    return `${Math.ceil(minutes)} min left`;
  }
  return `${seconds} sec left`;
}

function StatCard({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardContent className="flex items-center justify-between gap-3 pt-6">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-semibold tabular-nums tracking-tight">{value}</p>
        </div>
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden />
        </div>
      </CardContent>
    </Card>
  );
}

function IpListCard({
  title,
  description,
  ips,
  emptyLabel,
  variant = "default",
}: {
  title: string;
  description: string;
  ips: string[];
  emptyLabel: string;
  variant?: "default" | "warning";
}) {
  return (
    <Card className="flex min-h-[280px] flex-col shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col pt-0">
        <ScrollArea className="min-h-0 flex-1 rounded-lg border bg-muted/30 p-3">
          {ips.length === 0 ? (
            <p className="text-sm text-muted-foreground">{emptyLabel}</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {ips.map((ip) => (
                <li key={ip}>
                  <Badge
                    variant={variant === "warning" ? "warning" : "secondary"}
                    className="font-mono text-xs"
                  >
                    {ip}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
        <p className="mt-3 text-xs text-muted-foreground">
          {ips.length} {ips.length === 1 ? "address" : "addresses"}
        </p>
      </CardContent>
    </Card>
  );
}

function DashboardContent({ data }: { data: AdminDashboardResponse }) {
  const { stats } = data;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Last updated {formatTimestamp(data.generated_at)}
      </p>

      <section aria-label="Overview statistics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Active IPs" value={stats.active_ips_count} icon={Globe} />
        <StatCard label="Visited IPs" value={stats.visited_ips_count} icon={Activity} />
        <StatCard label="Queue size" value={stats.queue_size} icon={ListOrdered} />
        <StatCard label="Active sessions" value={stats.active_sessions} icon={Users} />
        <StatCard
          label="Active soft bans"
          value={stats.active_soft_bans_count}
          icon={ShieldBan}
          className="sm:col-span-2 lg:col-span-1"
        />
      </section>

      <section
        aria-label="IP lists"
        className="grid gap-6 lg:grid-cols-2"
      >
        <IpListCard
          title="Active IPs"
          description="Currently connected or active on the platform"
          ips={data.active_ips}
          emptyLabel="No active IPs right now"
        />
        <IpListCard
          title="Visited IPs"
          description="All IPs seen recently"
          ips={data.visited_ips}
          emptyLabel="No visited IPs recorded"
        />
      </section>

      <section aria-label="Soft bans" className="space-y-4">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Ban className="size-4 text-destructive" aria-hidden />
              Active soft bans
            </CardTitle>
            <CardDescription>
              Temporary bans currently in effect (30 minutes each)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.banned_ip_addresses.length > 0 && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-destructive">
                  Banned IP addresses
                </p>
                <ul className="flex flex-wrap gap-2">
                  {data.banned_ip_addresses.map((ip) => (
                    <li key={ip}>
                      <Badge variant="destructive" className="font-mono text-xs">
                        {ip}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.active_soft_bans.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active soft bans</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {data.active_soft_bans.map((ban) => (
                  <div
                    key={`${ban.ip_address}-${ban.created_at}`}
                    className="rounded-xl border bg-card p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="destructive" className="font-mono">
                        {ban.ip_address}
                      </Badge>
                      <Badge variant="outline" className="gap-1 shrink-0">
                        <Clock className="size-3" aria-hidden />
                        {formatRemaining(ban.remaining_minutes, ban.remaining_seconds)}
                      </Badge>
                    </div>
                    <dl className="mt-3 space-y-2 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Reason</dt>
                        <dd>{ban.reason}</dd>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <dt className="text-muted-foreground">Created</dt>
                          <dd>{formatTimestamp(ban.created_at)}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Expires</dt>
                          <dd>{formatTimestamp(ban.expires_at)}</dd>
                        </div>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-4 w-48 rounded bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl border bg-muted/40" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-72 rounded-xl border bg-muted/40" />
        <div className="h-72 rounded-xl border bg-muted/40" />
      </div>
      <div className="h-48 rounded-xl border bg-muted/40" />
    </div>
  );
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [adminEmail] = useState(() => getAdminEmail());
  const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [ipAddress, setIpAddress] = useState("");
  const [banning, setBanning] = useState(false);

  const loadDashboard = useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = options?.silent ?? false;
      try {
        if (silent) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        const data = await fetchAdminDashboard();
        setDashboard(data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load dashboard";
        toast.error(message);
        navigate(ADMIN_LOGIN_PATH, { replace: true });
      } finally {
        if (silent) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [navigate],
  );

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void loadDashboard({ silent: true });
    }, AUTO_REFRESH_MS);
    return () => clearInterval(intervalId);
  }, [loadDashboard]);

  const handleLogout = async () => {
    try {
      await adminLogout();
      toast.success("Logged out");
    } catch {
      toast.error("Logout request failed");
    } finally {
      navigate(ADMIN_LOGIN_PATH, { replace: true });
    }
  };

  const handleSoftBan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ipAddress.trim()) {
      toast.error("IP address is required");
      return;
    }

    try {
      setBanning(true);
      await createSoftBan({ ip_address: ipAddress.trim() });
      toast.success("Soft ban applied");
      await loadDashboard({ silent: true });
      setIpAddress("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Soft ban failed");
    } finally {
      setBanning(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted/20 p-4 md:p-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Admin dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Live moderation and traffic overview
            </p>
            {adminEmail && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-foreground/80">
                <Mail className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                Signed in as <span className="font-medium">{adminEmail}</span>
              </p>
            )}
            <p className="mt-0.5 text-xs text-muted-foreground">
              Auto-refreshes every 30 seconds
              {refreshing && " · Updating…"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => void loadDashboard({ silent: !!dashboard })}
              disabled={loading || refreshing}
              className="gap-2"
            >
              <RefreshCw
                className={cn("size-4", (loading || refreshing) && "animate-spin")}
                aria-hidden
              />
              Refresh
            </Button>
            <Button variant="destructive" onClick={() => void handleLogout()}>
              Logout
            </Button>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Soft ban (30 minutes)</CardTitle>
            <CardDescription>
              Block an IP from matching for 30 minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-4 sm:flex-row sm:items-end"
              onSubmit={handleSoftBan}
            >
              <div className="flex-1 space-y-2">
                <Label htmlFor="soft-ban-ip">IP address</Label>
                <Input
                  id="soft-ban-ip"
                  value={ipAddress}
                  onChange={(event) => setIpAddress(event.target.value)}
                  placeholder="e.g. 203.0.113.42"
                  className="font-mono"
                />
              </div>
              <Button type="submit" disabled={banning}>
                {banning ? "Applying..." : "Apply soft ban"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {loading && !dashboard ? (
          <DashboardSkeleton />
        ) : dashboard ? (
          <DashboardContent data={dashboard} />
        ) : null}
      </div>
    </main>
  );
}
