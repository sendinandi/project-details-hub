import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ShoppingCart, Heart, Star, Leaf } from "lucide-react";

const categories = [
  "All",
  "Reusable Bags",
  "Bamboo Products",
  "Organic Food",
  "Recycled Items",
  "Eco Fashion",
];

const products = [
  {
    id: 1,
    name: "Organic Cotton Tote Bag",
    price: 45000,
    originalPrice: 60000,
    rating: 4.8,
    reviews: 124,
    seller: "Green Lifestyle",
    category: "Reusable Bags",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400",
  },
  {
    id: 2,
    name: "Bamboo Cutlery Set",
    price: 35000,
    rating: 4.9,
    reviews: 89,
    seller: "Eco Essentials",
    category: "Bamboo Products",
    badge: "Eco Choice",
    image: "https://images.unsplash.com/photo-1584346133934-a3afd2a33c4a?w=400",
  },
  {
    id: 3,
    name: "Stainless Steel Water Bottle",
    price: 85000,
    rating: 4.7,
    reviews: 256,
    seller: "Hydrate Green",
    category: "Recycled Items",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
  },
  {
    id: 4,
    name: "Natural Beeswax Wraps",
    price: 55000,
    rating: 4.6,
    reviews: 78,
    seller: "Wrap It Up",
    category: "Organic Food",
    badge: "New",
    image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=400",
  },
  {
    id: 5,
    name: "Recycled Paper Notebook",
    price: 25000,
    rating: 4.5,
    reviews: 167,
    seller: "Paper Trail",
    category: "Recycled Items",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400",
  },
  {
    id: 6,
    name: "Bamboo Toothbrush Set",
    price: 28000,
    rating: 4.8,
    reviews: 342,
    seller: "Smile Green",
    category: "Bamboo Products",
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400",
  },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
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
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <p className="text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} variant="feature" className="group overflow-hidden">
                  <CardContent className="p-0">
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
                        <Button size="icon" variant="default">
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
