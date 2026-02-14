import { type Product } from "@shared/schema";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Lock, Zap, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-card/40 backdrop-blur-sm rounded-xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/10"
    >
      {/* Decorative Gradient Blob */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/0 via-primary/10 to-secondary/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />

      {/* Image / Preview Area */}
      <div className="relative aspect-video overflow-hidden bg-muted/50">
        {product.previewUrl ? (
          <img 
            src={product.previewUrl} 
            alt={product.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-muted-foreground bg-gradient-to-br from-muted/50 to-background">
            <ShieldCheck className="w-12 h-12 opacity-20" />
            <span className="text-xs uppercase tracking-widest opacity-40 font-display">Secure Asset</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium text-white shadow-lg">
          <Lock className="w-3 h-3 text-primary" />
          <span>Encrypted</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative p-5 space-y-4">
        <div>
          <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors truncate">
            {product.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Price</span>
            <span className="font-display font-bold text-lg text-secondary text-glow-secondary">
              {product.priceNear} Ⓝ
            </span>
          </div>
          
          <Link href={`/products/${product.id}`}>
            <Button size="sm" className="bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20 hover:border-primary transition-all group/btn">
              View Asset
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
