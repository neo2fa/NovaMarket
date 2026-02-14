import { useAuth } from "@/hooks/use-auth";
import { useTransactions } from "@/hooks/use-transactions";
import { useProducts } from "@/hooks/use-products";
import { CreateProductDialog } from "@/components/CreateProductDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, Download, Key } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: transactions } = useTransactions();
  // Filter products where sellerId matches user (mock logic since we don't have real user IDs in this mock frontend for filtering)
  const { data: allProducts } = useProducts();
  const myProducts = allProducts?.filter(p => p.sellerId === 0) || []; 

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Command Center</h1>
          <p className="text-muted-foreground mt-1">Manage your digital assets and acquisitions.</p>
        </div>
        <CreateProductDialog />
      </div>

      <Tabs defaultValue="purchases" className="w-full">
        <TabsList className="bg-muted/30 border border-white/5 p-1 mb-8">
          <TabsTrigger value="purchases" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-display">
            <ShoppingBag className="w-4 h-4 mr-2" />
            My Acquisitions
          </TabsTrigger>
          <TabsTrigger value="listings" className="data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary font-display">
            <Package className="w-4 h-4 mr-2" />
            My Listings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="purchases">
          <div className="grid gap-4">
            {transactions?.length === 0 ? (
              <EmptyState 
                icon={ShoppingBag} 
                title="No purchases yet" 
                description="Explore the marketplace to find secure digital assets." 
              />
            ) : (
              transactions?.map((tx, i) => (
                <motion.div 
                  key={tx.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="bg-card/30 border-white/5 hover:border-white/10 transition-colors">
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20">
                          <Key className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground">Decryption Key #{tx.id}</h4>
                          <p className="text-sm text-muted-foreground">Transaction Hash: {tx.txHash.substring(0, 12)}...</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20 uppercase tracking-wider">
                          Unlocked
                        </span>
                        <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                          <Download className="w-5 h-5 text-muted-foreground" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="listings">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProducts.length === 0 ? (
              <div className="col-span-full">
                <EmptyState 
                  icon={Package} 
                  title="No active listings" 
                  description="Mint your first encrypted asset to start selling." 
                />
              </div>
            ) : (
              myProducts.map((product) => (
                <Card key={product.id} className="bg-card/30 border-white/5">
                  <CardHeader>
                    <CardTitle className="truncate">{product.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-secondary">{product.priceNear} Ⓝ</span>
                      <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs">Active</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-white/5 rounded-xl bg-white/5">
      <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm">{description}</p>
    </div>
  );
}
