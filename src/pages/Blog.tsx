import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Clock, User, ArrowRight, BookOpen } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const categories = ["All", "Zero Waste Tips", "Recycling Guide", "News", "Tutorials"];

const articles = [
  {
    id: 1,
    title: "10 Easy Ways to Start Your Zero Waste Journey",
    excerpt: "Simple steps to reduce your environmental footprint and live more sustainably.",
    category: "Zero Waste Tips",
    author: "Sarah Green",
    date: "Dec 10, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800",
    featured: true,
  },
  {
    id: 2,
    title: "How to Properly Sort Your Recyclables",
    excerpt: "A comprehensive guide to sorting waste for maximum recycling efficiency.",
    category: "Recycling Guide",
    author: "Mike Earth",
    date: "Dec 8, 2025",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=800",
  },
  {
    id: 3,
    title: "DIY: Turn Old T-Shirts into Reusable Bags",
    excerpt: "Creative upcycling project that gives new life to your old clothes.",
    category: "Tutorials",
    author: "Lisa Craft",
    date: "Dec 5, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800",
  },
  {
    id: 4,
    title: "Indonesia's New Plastic Ban: What You Need to Know",
    excerpt: "Breaking down the new regulations and how they affect everyday consumers.",
    category: "News",
    author: "Admin",
    date: "Dec 3, 2025",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800",
  },
  {
    id: 5,
    title: "Composting 101: A Beginner's Complete Guide",
    excerpt: "Everything you need to know to start composting at home.",
    category: "Tutorials",
    author: "Tom Soil",
    date: "Dec 1, 2025",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
  },
  {
    id: 6,
    title: "The Impact of Single-Use Plastics on Ocean Life",
    excerpt: "Understanding the crisis and what we can do to help marine ecosystems.",
    category: "News",
    author: "Ocean Watch",
    date: "Nov 28, 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=800",
  },
];

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticle = filteredArticles.find((a) => a.featured);
  const regularArticles = filteredArticles.filter((a) => !a.featured);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Header */}
        <section className="bg-gradient-subtle py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <BookOpen className="w-4 h-4" />
                <span>Edu-Corner</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
                Learn & Get Inspired
              </h1>
              <p className="text-muted-foreground mb-8">
                Discover tips, tutorials, and news about sustainable living
              </p>
              
              {/* Search */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 rounded-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-6 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
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

        {/* Featured Article */}
        {featuredArticle && (
          <section className="py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <Card variant="feature" className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid lg:grid-cols-2">
                    <div className="aspect-video lg:aspect-auto overflow-hidden">
                      <img
                        src={featuredArticle.image}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <Badge className="w-fit mb-4">{featuredArticle.category}</Badge>
                      <h2 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-4">
                        {featuredArticle.title}
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        {featuredArticle.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {featuredArticle.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {featuredArticle.readTime}
                        </span>
                      </div>
                      <Button variant="default" className="w-fit">
                        Read Article
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Articles Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularArticles.map((article) => (
                <Card key={article.id} variant="feature" className="overflow-hidden group">
                  <CardContent className="p-0">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <Badge variant="secondary" className="mb-3">
                        {article.category}
                      </Badge>
                      <h3 className="text-lg font-heading font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {article.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </span>
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

export default Blog;
