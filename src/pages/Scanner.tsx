import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WasteScanner } from "@/components/scanner/WasteScanner";

const Scanner = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-3">
              AI Waste Scanner
            </h1>
            <p className="text-muted-foreground">
              Take a photo of any waste item to identify its type and get recycling instructions
            </p>
          </div>
          
          <WasteScanner />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Scanner;
