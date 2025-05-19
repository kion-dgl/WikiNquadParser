import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, Info } from "lucide-react";
import { type ConversionResult } from "@/pages/home";

interface ResultsContainerProps {
  result: ConversionResult;
}

export function ResultsContainer({ result }: ResultsContainerProps) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.nquads);
      setIsCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "N-Quads content has been copied to the clipboard",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Failed to copy content to clipboard",
        variant: "destructive",
      });
    }
  };
  
  const handleDownload = () => {
    try {
      const blob = new Blob([result.nquads], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      
      // Extract page title from the URL for the filename
      const urlPath = new URL(result.sourceUrl).pathname;
      const pageName = urlPath.split("/").pop() || "wikipedia";
      
      a.href = url;
      a.download = `${pageName}_nquads.nq`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Downloaded successfully",
        description: "N-Quads file has been downloaded",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download N-Quads file",
        variant: "destructive",
      });
    }
  };
  
  // Function to display a shortened, sanitized URL
  const formatSourceUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname;
    } catch (error) {
      return url;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-4 sm:px-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">N-Quads Result</h3>
          <p className="text-sm text-gray-500 mt-1">
            <Info className="h-4 w-4 inline mr-1" />
            From <a 
              href={result.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline"
            >
              {formatSourceUrl(result.sourceUrl)}
            </a>
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleCopy}
            className="h-9"
          >
            {isCopied ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1.5" />
                Copy
              </>
            )}
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleDownload}
            className="h-9"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Download
          </Button>
        </div>
      </div>
      
      <div className="p-1 overflow-auto max-h-[50vh] bg-gray-800">
        <pre className="text-sm font-mono p-4 text-gray-100">
          <code>{result.nquads}</code>
        </pre>
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Stats</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
            <div className="text-xl font-semibold text-blue-600">{result.stats.triples}</div>
            <div className="text-xs text-gray-500">Triples</div>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
            <div className="text-xl font-semibold text-indigo-600">{result.stats.entities}</div>
            <div className="text-xs text-gray-500">Entities</div>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
            <div className="text-xl font-semibold text-purple-600">{result.stats.predicates}</div>
            <div className="text-xs text-gray-500">Predicates</div>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
            <div className="text-xl font-semibold text-green-600">{result.stats.fileSize}</div>
            <div className="text-xs text-gray-500">File Size</div>
          </div>
        </div>
      </div>
    </div>
  );
}
