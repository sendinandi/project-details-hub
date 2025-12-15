import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Recycle, Leaf, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/blog", label: "Edu-Corner" },
  { href: "/map", label: "Recycle Map" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null); // State untuk user Auth
  const [userName, setUserName] = useState<string>(""); // State untuk nama dari DB
  const location = useLocation();

  useEffect(() => {
    // 1. Cek session saat ini
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.email);
      }
    };

    checkUser();

    // 2. Listen perubahan auth (login/logout otomatis update navbar)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.email);
      } else {
        setUser(null);
        setUserName("");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fungsi ambil nama dari tabel public.users
  const fetchProfile = async (email: string | undefined) => {
    if (!email) return;
    const { data } = await supabase
      .from('users')
      .select('name')
      .eq('email', email)
      .single();
    
    if (data) {
      setUserName(data.name);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-soft group-hover:shadow-elevated transition-shadow">
                <Recycle className="w-5 h-5 text-primary-foreground" />
              </div>
              <Leaf className="absolute -top-1 -right-1 w-4 h-4 text-leaf animate-pulse-soft" />
            </div>
            <span className="text-xl font-heading font-bold text-foreground">
              Recycle<span className="text-primary">Bud</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  location.pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons / Profile */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User className="w-4 h-4" />
                    </div>
                    <span>{userName || "User"}</span>
                 </div>
                 <Button variant="ghost" size="sm" onClick={handleLogout}>
                   Logout
                 </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button variant="default" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border/50 animate-slide-up">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
                    location.pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/50">
                {user ? (
                   <>
                     <div className="px-4 py-2 text-sm font-semibold flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Hi, {userName}
                     </div>
                     <Button variant="ghost" className="justify-start px-4 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => { handleLogout(); setIsOpen(false); }}>
                        Logout
                     </Button>
                   </>
                ) : (
                  <>
                    <Button variant="ghost" className="justify-center" asChild>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                        Sign In
                    </Link>
                    </Button>
                    <Button variant="default" className="justify-center" asChild>
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                        Get Started
                    </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}