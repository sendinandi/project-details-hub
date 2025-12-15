import { useEffect } from "react"; // Tambahkan ini
import { supabase } from "@/integrations/supabase/client"; // Tambahkan ini
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { CTASection } from "@/components/sections/CTASection";

const Index = () => {

  useEffect(() => {
    const testConnection = async () => {
      console.log("🔄 Mencoba koneksi ke Supabase...");
      
      // GANTI 'NAMA_TABEL_KAMU' dengan nama tabel yang benar-benar ada di database kamu
      // Gunakan 'as any' sementara karena types.ts kamu masih kosong agar tidak error merah di editor
      const { data, error } = await supabase.from('order_items' as any).select('*').limit(1);

      if (error) {
        console.error("❌ Koneksi Gagal atau Tabel tidak ditemukan:", error.message);
      } else {
        console.log("✅ Koneksi Berhasil! Data:", data);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
