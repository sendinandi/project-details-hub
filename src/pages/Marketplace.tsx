import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ShoppingCart, Heart, Star, Leaf, SlidersHorizontal, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { CartSheet } from "@/components/cart/CartSheet";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Interface untuk data yang diambil dari Supabase
interface ProductData {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  seller: string;
  category: string;
  badge?: string;
  image: string;
  stock: number;
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
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
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
          .select('*')
          .order('created_at', { ascending: false });

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
          // Extract unique categories
          const uniqueCategories = [...new Set(data.map((item: any) => item.category).filter(Boolean))];
          setCategories(["All", ...uniqueCategories]);

          // Mapping data Database (snake_case) ke Frontend (camelCase)
          const formattedData: ProductData[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description || "",
            price: Number(item.price),
            originalPrice: item.original_price ? Number(item.original_price) : undefined,
            rating: Number(item.rating) || 0,
            reviews: item.reviews_count || 0,
            seller: item.seller_name || "Eco Seller",
            category: item.category || "General",
            badge: item.badge,
            image: item.image_url || "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400",
            stock: item.stock || 0,
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

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("newest");
    setPriceRange("all");
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "All" || sortBy !== "newest" || priceRange !== "all";

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      
      let matchesPrice = true;
      switch (priceRange) {
        case "under50":
          matchesPrice = product.price < 50000;
          break;
        case "50to100":
          matchesPrice = product.price >= 50000 && product.price <= 100000;
          break;
        case "over100":
          matchesPrice = product.price > 100000;
          break;
      }
      
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "name":
          return a.name.localeCompare(b.name);
        default: // newest
          return 0;
      }
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
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Filters Bar */}
        <section className="py-4 border-b border-border bg-background sticky top-16 lg:top-20 z-30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4">
              {/* Top row: Categories and Cart */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <Button 
                  variant={showFilters ? "default" : "outline"} 
                  size="sm" 
                  className="shrink-0"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      !
                    </Badge>
                  )}
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

              {/* Expanded filters */}
              {showFilters && (
                <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-xl animate-slide-up">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[160px] h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Highest Rating</SelectItem>
                        <SelectItem value="name">Name A-Z</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Price:</span>
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger className="w-[160px] h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Prices</SelectItem>
                        <SelectItem value="under50">Under Rp 50,000</SelectItem>
                        <SelectItem value="50to100">Rp 50,000 - 100,000</SelectItem>
                        <SelectItem value="over100">Over Rp 100,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {hasActiveFilters && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilters}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear all
                    </Button>
                  )}
                </div>
              )}
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
               <div className="text-center py-12">
                 <div className="text-muted-foreground mb-4">
                   No products found matching your criteria.
                 </div>
                 <Button variant="outline" onClick={clearFilters}>
                   Clear Filters
                 </Button>
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
                        
                        {/* Category Badge */}
                        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                          <Leaf className="w-3 h-3 mr-1" />
                          {product.category}
                        </Badge>
                        
                        {/* Stock indicator */}
                        {product.stock < 10 && (
                          <Badge variant="destructive" className="absolute bottom-3 left-3">
                            Only {product.stock} left
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
                            disabled={product.stock === 0}
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