import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Package, Leaf, LogOut, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  name: string | null;
  email: string;
  points: number | null;
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
    month: "long",
    year: "numeric",
  });
};

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/login");
          return;
        }

        // 1. Ambil data Profile
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('name, email, points')
          .eq('id', session.user.id)
          .single();

        if (userError) throw userError;
        setProfile(userData);

        // 2. Ambil data Order History
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('id, created_at, total_amount, status')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;
        setOrders(ordersData || []);

      } catch (error: any) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar / User Info Card */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="text-center overflow-hidden">
                <div className="bg-gradient-hero h-24 w-full"></div>
                <div className="-mt-12 mb-4 flex justify-center">
                  <div className="h-24 w-24 rounded-full bg-background p-1 shadow-lg">
                    <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                </div>
                <CardContent>
                  <h2 className="text-xl font-heading font-bold">{profile?.name || 'User'}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{profile?.email}</p>
                  <Badge variant="secondary" className="mb-6 uppercase text-xs tracking-wider">
                    Member
                  </Badge>
                  
                  <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>

              {/* Points Card (Mobile View usually placed here, but useful in sidebar too) */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <Leaf className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Eco Points Balance</p>
                    <h3 className="text-2xl font-bold text-foreground">
                      {profile?.points || 0} <span className="text-sm font-normal text-muted-foreground">pts</span>
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Order History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>You haven't placed any orders yet.</p>
                      <Button variant="link" onClick={() => navigate("/marketplace")}>
                        Start Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors">
                          <div className="space-y-1 mb-2 sm:mb-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">Order #{order.id}</span>
                              <Badge variant={
                                order.status === 'completed' ? 'default' : 
                                order.status === 'pending' ? 'secondary' : 'outline'
                              } className="text-xs">
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Placed on {formatDate(order.created_at)}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <span className="font-bold">{formatPrice(order.total_amount)}</span>
                            {/* Bisa tambahkan tombol 'View Details' jika nanti membuat halaman detail order */}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;