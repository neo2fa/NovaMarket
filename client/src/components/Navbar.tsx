import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  LayoutDashboard, 
  LogIn, 
  LogOut, 
  Cpu, 
  Menu,
  X 
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
    ...(user ? [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="relative flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg overflow-hidden group-hover:bg-primary/20 transition-all">
              <Cpu className="w-6 h-6 text-primary animate-pulse" />
              <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-wider leading-none text-white">
                NOVA<span className="text-primary">MARKET</span>
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] leading-none mt-1">
                Decentralized Nexus
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div className={`
                  flex items-center gap-2 text-sm font-medium tracking-wide transition-all cursor-pointer group
                  ${location === link.href ? "text-primary text-glow" : "text-muted-foreground hover:text-foreground"}
                `}>
                  <link.icon className={`w-4 h-4 transition-transform group-hover:-translate-y-0.5 ${location === link.href ? "text-primary" : ""}`} />
                  {link.label}
                </div>
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-4 pl-8 border-l border-border/50">
                <div className="flex flex-col items-end">
                  <span className="text-xs text-muted-foreground">Connected as</span>
                  <span className="text-sm font-semibold text-secondary text-glow-secondary">
                    {user.username}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => logout()}
                  className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <Link href="/api/login">
                <Button className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:border-primary/50 font-display tracking-wide">
                  <LogIn className="w-4 h-4 mr-2" />
                  Connect Identity
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-border/40 bg-background/95 backdrop-blur-xl"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer
                    ${location === link.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50"}
                  `}>
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </div>
                </Link>
              ))}
              
              <div className="h-px bg-border/50 my-4" />
              
              {user ? (
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm text-muted-foreground">Logged in as <span className="text-foreground font-semibold">{user.username}</span></span>
                  <Button variant="ghost" size="sm" onClick={() => logout()}>
                    Log Out
                  </Button>
                </div>
              ) : (
                <div className="px-4">
                  <Link href="/api/login">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Connect Identity
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
