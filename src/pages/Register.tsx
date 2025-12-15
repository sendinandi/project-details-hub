import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Tambah useNavigate
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Recycle, Mail, Lock, Eye, EyeOff, Leaf, User, Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client"; // Import Supabase

type UserType = "user" | "partner";

const Register = () => {
  const [userType, setUserType] = useState<UserType>("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Daftar ke Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id, // <--- JANGAN LUPA INI
              email: email,
              name: name,
              role: userType === 'partner' ? 'seller' : 'user',
            }
          ]);

        if (profileError) {
          console.error("Error creating profile:", profileError);
          // Tetap lanjut karena akun auth sudah dibuat
        }

        toast({
          title: "Account created!",
          description: "Welcome to RecycleBud! Please check your email to verify.",
        });

        // Redirect ke login
        navigate("/login");
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-24 px-4">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center shadow-soft">
                <Recycle className="w-6 h-6 text-primary-foreground" />
              </div>
              <Leaf className="absolute -top-1 -right-1 w-5 h-5 text-leaf animate-pulse-soft" />
            </div>
            <span className="text-2xl font-heading font-bold text-foreground">
              Recycle<span className="text-primary">Bud</span>
            </span>
          </div>

          <Card variant="elevated" className="p-2">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <CardDescription>
                Join the eco-conscious community today
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* User Type Toggle */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setUserType("user")}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                    userType === "user"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <User className={cn("w-6 h-6", userType === "user" ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("text-sm font-medium", userType === "user" ? "text-primary" : "text-muted-foreground")}>
                    User
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("partner")}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                    userType === "partner"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <Store className={cn("w-6 h-6", userType === "partner" ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("text-sm font-medium", userType === "partner" ? "text-primary" : "text-muted-foreground")}>
                    Partner
                  </span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {userType === "partner" ? "Business Name" : "Full Name"}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder={userType === "partner" ? "Eco Shop" : "John Doe"}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" variant="default" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>

                {/* Footer Links (omitted for brevity, same as before) */}
              </form>
              <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;