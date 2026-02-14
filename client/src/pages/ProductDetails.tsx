import { useRoute, Link } from "wouter";
import { useProduct } from "@/hooks/use-products";
import { useCreateTransaction } from "@/hooks/use-transactions";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ShieldCheck, Download, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function ProductDetails() {
  const [, params] = useRoute("/products/:id");
  const id = params ? parseInt(params.id) : 0;
  
  const { data: product, isLoading } = useProduct(id);
  const { user } = useAuth();
  const createTransaction = useCreateTransaction();
  
  const [purchaseStep, setPurchaseStep] = useState<'idle' | 'wallet' | 'processing' | 'success'>('idle');

  const handlePurchase = async () => {
    if (!product) return;
    
    // Step 1: Mock Wallet Connection
    setPurchaseStep('wallet');
    await new Promise(r => setTimeout(r, 1500));
    
    // Step 2: Processing / AI Verification
    setPurchaseStep('processing');
    
    createTransaction.mutate({
      productId: product.id,
      buyerId: 0, // Handled by backend/auth
      txHash: "mock_near_tx_" + Date.now(),
      status: "completed"
    }, {
      onSuccess: () => {
        // Step 3: Success
        setTimeout(() => setPurchaseStep('success'), 2000);
      },
      onError: () => {
        setPurchaseStep('idle');
      }
    });
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Product not found</div>;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <Link href="/marketplace">
        <Button variant="ghost" className="mb-8 pl-0 hover:bg-transparent hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Market
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Visuals */}
        <div className="space-y-6">
          <div className="aspect-video rounded-2xl overflow-hidden bg-muted/30 border border-white/5 relative group">
            {product.previewUrl ? (
              <img src={product.previewUrl} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
                <ShieldCheck className="w-24 h-24 opacity-20" />
              </div>
            )}
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-60" />
          </div>

          <div className="p-6 rounded-xl bg-card/40 border border-white/10 backdrop-blur-md">
            <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-accent" />
              AI Agent Verification
            </h3>
            <div className="space-y-4">
              <VerificationStep label="Seller Identity Verified" status="completed" delay={0} />
              <VerificationStep label="Asset Integrity Check" status="completed" delay={0.2} />
              <VerificationStep label="NOVA Encryption Valid" status="completed" delay={0.4} />
            </div>
          </div>
        </div>

        {/* Right Column: Details & Action */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-white mb-4">{product.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">Encrypted Asset</span>
              <span>Released {new Date(product.createdAt!).toLocaleDateString()}</span>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-6">
              {product.description}
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 space-y-6">
            <div className="flex items-end justify-between">
              <span className="text-muted-foreground uppercase tracking-widest text-sm">Current Price</span>
              <span className="text-5xl font-display font-bold text-white tracking-tight">
                {product.priceNear} <span className="text-2xl text-secondary">Ⓝ</span>
              </span>
            </div>

            {user ? (
              <Button 
                size="lg" 
                className="w-full h-14 text-lg font-bold bg-secondary text-background hover:bg-secondary/90 shadow-lg shadow-secondary/20"
                onClick={handlePurchase}
                disabled={purchaseStep !== 'idle'}
              >
                Purchase with NEAR
              </Button>
            ) : (
              <Link href="/api/login">
                <Button size="lg" className="w-full h-14 text-lg font-bold bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30">
                  Connect Wallet to Buy
                </Button>
              </Link>
            )}
            
            <p className="text-center text-xs text-muted-foreground/60">
              Transaction monitored by autonomous AI agent. Decryption key released instantly upon confirmation.
            </p>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      <Dialog open={purchaseStep !== 'idle'}>
        <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-secondary/20 [&>button]:hidden">
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-6">
            <AnimatePresence mode="wait">
              {purchaseStep === 'wallet' && (
                <motion.div
                  key="wallet"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center gap-4"
                >
                  <Loader2 className="w-12 h-12 text-secondary animate-spin" />
                  <h3 className="text-xl font-display font-bold">Connecting Wallet...</h3>
                  <p className="text-muted-foreground">Please approve the transaction in your NEAR wallet.</p>
                </motion.div>
              )}
              
              {purchaseStep === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="relative">
                    <Bot className="w-12 h-12 text-accent animate-pulse" />
                    <div className="absolute inset-0 bg-accent/20 blur-xl animate-pulse" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-accent">AI Agent Verifying</h3>
                  <p className="text-muted-foreground">Confirming transaction on blockchain...</p>
                </motion.div>
              )}

              {purchaseStep === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30">
                    <Download className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-green-500">Purchase Complete</h3>
                  <p className="text-muted-foreground mb-4">Decryption key has been released.</p>
                  <Link href="/dashboard">
                    <Button className="w-full">Go to Dashboard</Button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function VerificationStep({ label, status, delay }: { label: string, status: 'pending' | 'completed', delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3 text-sm"
    >
      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${status === 'completed' ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'border-muted-foreground/30'}`}>
        {status === 'completed' && <div className="w-2 h-2 rounded-full bg-current" />}
      </div>
      <span className={status === 'completed' ? 'text-foreground' : 'text-muted-foreground'}>{label}</span>
    </motion.div>
  );
}
