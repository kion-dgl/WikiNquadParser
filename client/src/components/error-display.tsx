import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  errorMessage: string;
  onTryAgain: () => void;
}

export function ErrorDisplay({ errorMessage, onTryAgain }: ErrorDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-red-500">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-red-800">Processing Error</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{errorMessage}</p>
          </div>
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={onTryAgain}
              className="text-red-700 bg-red-100 hover:bg-red-200 border-transparent"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
