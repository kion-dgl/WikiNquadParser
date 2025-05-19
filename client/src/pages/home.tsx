import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WikipediaUrlForm } from "@/components/wikipedia-url-form";
import { ProcessingStatus } from "@/components/processing-status";
import { ResultsContainer } from "@/components/results-container";
import { ErrorDisplay } from "@/components/error-display";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export type ConversionResult = {
  nquads: string;
  stats: {
    triples: number;
    entities: number;
    predicates: number;
    fileSize: string;
  };
  sourceUrl: string;
};

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const convertMutation = useMutation({
    mutationFn: async ({ url, fullContent }: { url: string; fullContent: boolean }) => {
      setIsProcessing(true);
      setProgress(25);
      setCurrentStep("Fetching Wikipedia content");
      
      try {
        const response = await apiRequest("POST", "/api/convert", { url, fullContent });
        const data = await response.json();
        return data as ConversionResult;
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to convert Wikipedia content");
      }
    },
    onSuccess: (data) => {
      setProgress(100);
      setCurrentStep("Formatting results");
      
      setTimeout(() => {
        setIsProcessing(false);
        setConversionResult(data);
        setError(null);
        
        toast({
          title: "Conversion Complete",
          description: "Wikipedia content has been successfully converted to N-Quads format.",
        });
      }, 500);
    },
    onError: (error) => {
      setIsProcessing(false);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
      
      toast({
        title: "Conversion Failed",
        description: error instanceof Error ? error.message : "Failed to convert Wikipedia content to N-Quads format.",
        variant: "destructive",
      });
    }
  });

  const handleConvert = (url: string, fullContent: boolean) => {
    setProgress(0);
    setConversionResult(null);
    setError(null);
    convertMutation.mutate({ url, fullContent });
  };

  const handleTryAgain = () => {
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Convert Wikipedia pages to N-Quads</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter a Wikipedia URL to convert the content into structured N-Quad format using Open Router API. 
            Ideal for semantic web applications and knowledge graphs.
          </p>
        </div>
        
        <WikipediaUrlForm onSubmit={handleConvert} isProcessing={convertMutation.isPending} />
        
        {isProcessing && (
          <ProcessingStatus progress={progress} currentStep={currentStep} />
        )}
        
        {error && (
          <ErrorDisplay errorMessage={error} onTryAgain={handleTryAgain} />
        )}
        
        {conversionResult && !error && !isProcessing && (
          <ResultsContainer result={conversionResult} />
        )}
      </main>
      
      <Footer />
    </div>
  );
}
