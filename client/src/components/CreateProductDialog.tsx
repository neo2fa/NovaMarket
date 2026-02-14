import { useState } from "react";
import { useCreateProduct } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, Lock, ShieldCheck, FileKey } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CreateProductDialog() {
  const [open, setOpen] = useState(false);
  const [encryptionStep, setEncryptionStep] = useState<'idle' | 'encrypting' | 'done'>('idle');
  const createProduct = useCreateProduct();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceNear: "",
    previewUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate Encryption Phase
    setEncryptionStep('encrypting');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setEncryptionStep('done');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Actually create the product
    createProduct.mutate({
      ...formData,
      sellerId: 0, // Backend handles this from auth
      encryptedFileUrl: "https://nova-vault.storage/encrypted_" + Math.random().toString(36), // Mocked
    }, {
      onSuccess: () => {
        setOpen(false);
        setEncryptionStep('idle');
        setFormData({ title: "", description: "", priceNear: "", previewUrl: "" });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/25 border-none font-display">
          <Upload className="w-4 h-4 mr-2" />
          Mint New Asset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-primary/20 text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-2xl">
            <FileKey className="w-6 h-6 text-primary" />
            Secure Upload
          </DialogTitle>
        </DialogHeader>

        {encryptionStep === 'idle' ? (
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Asset Name</Label>
                <Input
                  id="title"
                  required
                  placeholder="e.g. Quantum Algorithms v2"
                  className="bg-muted/50 border-border/50 focus:border-primary/50"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="price">Price (NEAR)</Label>
                <div className="relative">
                  <Input
                    id="price"
                    required
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-8 bg-muted/50 border-border/50 focus:border-primary/50 font-mono"
                    value={formData.priceNear}
                    onChange={e => setFormData({ ...formData, priceNear: e.target.value })}
                  />
                  <span className="absolute left-3 top-2.5 text-muted-foreground">Ⓝ</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  required
                  placeholder="Describe the utility of this digital asset..."
                  className="bg-muted/50 border-border/50 focus:border-primary/50 resize-none h-24"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="file">Digital File</Label>
                <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:bg-muted/30 transition-colors cursor-pointer group">
                  <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2 group-hover:text-primary transition-colors" />
                  <p className="text-sm text-muted-foreground">Drop file to encrypt via NOVA SDK</p>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary text-white font-display" disabled={createProduct.isPending}>
              {createProduct.isPending ? "Processing..." : "Encrypt & Mint"}
            </Button>
          </form>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
            <AnimatePresence mode="wait">
              {encryptionStep === 'encrypting' ? (
                <motion.div
                  key="encrypting"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-[spin_3s_linear_infinite]" />
                    <div className="absolute inset-2 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                    <Lock className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-primary animate-pulse">NOVA Encryption Active</h3>
                    <p className="text-muted-foreground mt-2">Securing asset with post-quantum keys...</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30">
                    <ShieldCheck className="w-10 h-10 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-green-500">Asset Secured</h3>
                    <p className="text-muted-foreground mt-2">Ready for marketplace distribution.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
