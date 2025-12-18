import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, Package, Leaf, Scan, Gift, MapPin, ShoppingBag,
  TrendingUp, Clock, CheckCircle2, Loader2, ArrowRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  name: string | null;
  email: string;
  points: number | null;
}

interface ScanHistory {
  id: string;
  created_at: string;
  points_earned: number | null;
  result: any;
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string | null;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getStatusColor = (status: string | null) => {
  switch (status) {
    case 'completed': return 'bg-green-500/10 text-green-600 border-green-500/20';
    case 'paid': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    case 'shipped': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
    case 'cancelled': return 'bg-red-500/10 text-red-600 border-red-500/20';
    default: return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
  }
};

const Dashboard = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [scans, setScans] = useState<ScanHistory[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalScans, setTotalScans] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/login");
          return;
        }

        // Fetch user profile
        const { data: userData } = await supabase
          .from('users')
          .select('name, email, points')
          .eq('id', session.user.id)
          .single();

        if (userData) setProfile(userData);

        // Fetch recent scans (last 5)
        const { data: scansData, count: scansCount } = await supabase
          .from('scan_histories')
          .select('*', { count: 'exact' })
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (scansData) setScans(scansData);
        if (scansCount) setTotalScans(scansCount);

        // Fetch recent orders (last 5)
        const { data: ordersData } = await supabase
          .from('orders')
          .select('id, created_at, total_amount, status')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (ordersData) setOrders(ordersData);

      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Calculate next reward milestone
  const currentPoints = profile?.points || 0;
  const nextMilestone = Math.ceil(currentPoints / 500) * 500 || 500;
  const progressToMilestone = (currentPoints / nextMilestone) * 100;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const quickActions = [
    { icon: Scan, label: "Scan Waste", href: "/scanner", color: "bg-primary" },
    { icon: ShoppingBag, label: "Marketplace", href: "/marketplace", color: "bg-secondary" },
    { icon: MapPin, label: "Find Location", href: "/map", color: "bg-accent" },
    { icon: Gift, label: "Rewards", href: "/rewards", color: "bg-chart-4" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Welcome back, {profile?.name || 'User'}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's your recycling journey overview
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Eco Points</p>
                    <h3 className="text-3xl font-bold text-primary">{currentPoints}</h3>
                  </div>
                  <div className="p-3 bg-primary/20 rounded-full">
                    <Leaf className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Scans</p>
                    <h3 className="text-3xl font-bold text-foreground">{totalScans}</h3>
                  </div>
                  <div className="p-3 bg-secondary/20 rounded-full">
                    <Scan className="w-6 h-6 text-secondary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Orders</p>
                    <h3 className="text-3xl font-bold text-foreground">{orders.length}</h3>
                  </div>
                  <div className="p-3 bg-chart-2/20 rounded-full">
                    <Package className="w-6 h-6 text-chart-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Next Reward</p>
                    <h3 className="text-3xl font-bold text-foreground">{nextMilestone - currentPoints}</h3>
                    <p className="text-xs text-muted-foreground">pts to go</p>
                  </div>
                  <div className="p-3 bg-chart-4/20 rounded-full">
                    <Gift className="w-6 h-6 text-chart-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress to Next Reward */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="font-medium">Progress to {nextMilestone} Points</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {currentPoints} / {nextMilestone} pts
                </span>
              </div>
              <Progress value={progressToMilestone} className="h-3" />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center gap-3 hover:bg-primary/5 hover:border-primary/30 transition-all"
                  onClick={() => navigate(action.href)}
                >
                  <div className={`p-3 rounded-full ${action.color}/10`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <span className="font-medium">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Recent Activity Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Scans */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Scan className="w-5 h-5" />
                    Recent Scans
                  </CardTitle>
                  <CardDescription>Your latest waste scanning activity</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/scanner")}>
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                {scans.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Scan className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No scans yet</p>
                    <Button variant="link" onClick={() => navigate("/scanner")}>
                      Start scanning waste
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {scans.map((scan) => (
                      <div 
                        key={scan.id} 
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {scan.result?.waste_type || 'Waste Scanned'}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {formatDate(scan.created_at)}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          +{scan.points_earned || 0} pts
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Recent Orders
                  </CardTitle>
                  <CardDescription>Your marketplace purchases</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/profile")}>
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No orders yet</p>
                    <Button variant="link" onClick={() => navigate("/marketplace")}>
                      Browse marketplace
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div 
                        key={order.id} 
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-chart-2/10 rounded-full">
                            <Package className="w-4 h-4 text-chart-2" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              Order #{order.id.slice(0, 8)}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {formatDate(order.created_at)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">{formatPrice(order.total_amount)}</p>
                          <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                            {order.status || 'pending'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
