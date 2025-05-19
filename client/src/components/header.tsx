import { Group } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-blue-600 text-white p-2 rounded-lg mr-3">
              <Group className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-semibold text-gray-800">WikiQuads</h1>
          </div>
          <a 
            href="https://en.wikipedia.org/wiki/N-Triples" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            Help
          </a>
        </div>
      </div>
    </header>
  );
}
