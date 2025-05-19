import { GithubIcon, BookIcon, TwitterIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white mt-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-600">
              <span className="sr-only">Documentation</span>
              <BookIcon className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-600">
              <span className="sr-only">GitHub</span>
              <GithubIcon className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-600">
              <span className="sr-only">Twitter</span>
              <TwitterIcon className="h-5 w-5" />
            </a>
          </div>
          <p className="mt-4 text-center text-sm text-gray-500 md:mt-0">
            &copy; {new Date().getFullYear()} WikiQuads. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
