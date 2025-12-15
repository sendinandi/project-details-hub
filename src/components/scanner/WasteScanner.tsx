import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Loader2, Recycle, Leaf, X, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ScanResult {
  waste_type: string;
  confidence: number;
  recyclable: boolean;
  description: string;
  recycling_guide: string;
  base_points: number;
}

interface WasteScannerProps {
  onClose?: () => void;
}

export const WasteScanner = ({ onClose }: WasteScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "destructive",
      });
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setPreviewImage(base64);
      await analyzeImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (imageData: string) => {
    setIsScanning(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('scan-waste', {
        body: { image: imageData }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      
      if (data.base_points > 0) {
        toast({
          title: `+${data.base_points} Points Earned!`,
          description: `Successfully identified: ${data.waste_type}`,
        });
      }
    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : "Failed to analyze image",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const resetScanner = () => {
    setResult(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Recycle className="w-5 h-5 text-primary" />
          AI Waste Scanner
        </CardTitle>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        {!previewImage && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-heading font-semibold text-foreground mb-2">
              Scan Your Waste
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload or take a photo to identify waste type
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Preview Image */}
        {previewImage && (
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={previewImage}
              alt="Scanned waste"
              className="w-full h-64 object-cover"
            />
            {isScanning && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
                <p className="text-sm font-medium">Analyzing waste...</p>
              </div>
            )}
          </div>
        )}

        {/* Scan Result */}
        {result && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-heading font-bold text-xl text-foreground">
                  {result.waste_type}
                </h3>
                <p className="text-sm text-muted-foreground">{result.description}</p>
              </div>
              <Badge
                variant={result.recyclable ? "default" : "destructive"}
                className="shrink-0"
              >
                <Leaf className="w-3 h-3 mr-1" />
                {result.recyclable ? "Recyclable" : "Non-Recyclable"}
              </Badge>
            </div>

            {/* Confidence */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Confidence:</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
              <span className="text-sm font-medium">{result.confidence}%</span>
            </div>

            {/* Points */}
            {result.base_points > 0 && (
              <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-xl">
                <Award className="w-5 h-5 text-primary" />
                <span className="font-medium text-primary">
                  +{result.base_points} Points Earned
                </span>
              </div>
            )}

            {/* Recycling Guide */}
            <div className="p-4 bg-muted/50 rounded-xl">
              <h4 className="font-semibold text-foreground mb-2">
                Recycling Guide
              </h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {result.recycling_guide}
              </p>
            </div>

            {/* Actions */}
            <Button onClick={resetScanner} className="w-full">
              <Camera className="w-4 h-4 mr-2" />
              Scan Another Item
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
