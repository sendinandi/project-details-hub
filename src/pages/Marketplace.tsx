import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ShoppingCart, Heart, Star, Leaf } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { CartSheet } from "@/components/cart/CartSheet";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const categories = [
  "All",
  "Reusable Bags",
  "Bamboo Products",
  "Organic Food",
  "Recycled Items",
  "Eco Fashion",
];

// Interface untuk data yang diambil dari Supabase
interface ProductData {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  seller: string;
  category: string;
  badge?: string;
  image: string;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

const Marketplace = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);
  
  const { items, addItem, updateQuantity, removeItem, totalItems, totalPrice } = useCart();
  const { toast } = useToast();

  // Fetch Products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (error) {
          console.error("Error fetching products:", error);
          toast({
            title: "Error",
            description: "Failed to load products. Please try again.",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          // Mapping data Database (snake_case) ke Frontend (camelCase)
          const formattedData: ProductData[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: Number(item.price), // Pastikan jadi number
            originalPrice: item.original_price ? Number(item.original_price) : undefined,
            rating: Number(item.rating) || 0,
            reviews: item.reviews_count || 0,
            seller: item.seller_name || "Eco Seller", // Fallback jika kosong
            category: item.category || "General",
            badge: item.badge,
            image: item.image_url || "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400", // Fallback image
          }));
          setProducts(formattedData);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleAddToCart = (product: ProductData) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      seller: product.seller,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Header */}
        <section className="bg-gradient-hero py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-primary-foreground mb-4">
                Eco-Friendly Marketplace
              </h1>
              <p className="text-primary-foreground/80 mb-8">
                Shop sustainable products from verified eco-conscious sellers
              </p>
              
              {/* Search */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search eco-friendly products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 h-14 rounded-2xl bg-background/95 backdrop-blur border-0 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-6 border-b border-border bg-background sticky top-16 lg:top-20 z-30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
              <Button variant="outline" size="sm" className="shrink-0">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="shrink-0"
                >
                  {category}
                </Button>
              ))}
              <div className="ml-auto shrink-0">
                <CartSheet
                  items={items}
                  totalItems={totalItems}
                  totalPrice={totalPrice}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeItem}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <p className="text-muted-foreground">
                {isLoading ? (
                  "Loading products..."
                ) : (
                  <>Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> products</>
                )}
              </p>
            </div>

            {isLoading ? (
               <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {[1,2,3,4].map((i) => (
                   <div key={i} className="h-80 bg-muted rounded-xl animate-pulse"></div>
                 ))}
               </div>
            ) : filteredProducts.length === 0 ? (
               <div className="text-center py-12 text-muted-foreground">
                 No products found matching your criteria.
               </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} variant="feature" className="group overflow-hidden">
                    <CardContent className="p-0">
                      {/* Image */}
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/400?text=No+Image";
                          }}
                        />
                        
                        {/* Badge */}
                        {product.badge && (
                          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                            <Leaf className="w-3 h-3 mr-1" />
                            {product.badge}
                          </Badge>
                        )}
                        
                        {/* Favorite Button */}
                        <button
                          onClick={() => toggleFavorite(product.id)}
                          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
                        >
                          <Heart
                            className={`w-5 h-5 transition-colors ${
                              favorites.includes(product.id)
                                ? "fill-coral text-coral"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">{product.seller}</p>
                        <h3 className="font-heading font-semibold text-foreground mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-3">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium">{product.rating}</span>
                          <span className="text-xs text-muted-foreground">
                            ({product.reviews} reviews)
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-foreground">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through ml-2">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          <Button 
                            size="icon" 
                            variant="default"
                            onClick={() => handleAddToCart(product)}
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;