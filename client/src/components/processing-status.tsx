import { CheckCircle, Circle, Loader } from "lucide-react";

interface ProcessingStatusProps {
  progress: number;
  currentStep: string;
}

export function ProcessingStatus({ progress, currentStep }: ProcessingStatusProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Processing Wikipedia Page</h3>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {progress}%
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {progress >= 25 ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5 text-gray-300" />
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Fetching Wikipedia content</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {progress >= 75 ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : progress >= 25 ? (
              <Loader className="h-5 w-5 text-blue-500 animate-spin" />
            ) : (
              <Circle className="h-5 w-5 text-gray-300" />
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Converting to N-Quads format</p>
          </div>
        </div>
        
        <div className="flex items-center opacity-50">
          <div className="flex-shrink-0">
            {progress >= 100 ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : progress >= 75 ? (
              <Loader className="h-5 w-5 text-blue-500 animate-spin" />
            ) : (
              <Circle className="h-5 w-5 text-gray-300" />
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Formatting results</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>This may take a minute depending on the size of the Wikipedia article...</p>
      </div>
    </div>
  );
}
