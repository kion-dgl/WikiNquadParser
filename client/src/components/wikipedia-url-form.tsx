import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Link, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const wikipediaUrlSchema = z.object({
  url: z.string()
    .url("Please enter a valid URL")
    .refine((url) => {
      const regex = /^https?:\/\/([\w-]+\.)*wikipedia\.org\/wiki\/.+$/i;
      return regex.test(url);
    }, "Please enter a valid Wikipedia URL"),
  fullContent: z.boolean().default(false),
});

type WikipediaUrlFormValues = z.infer<typeof wikipediaUrlSchema>;

interface WikipediaUrlFormProps {
  onSubmit: (url: string, fullContent: boolean) => void;
  isProcessing: boolean;
}

export function WikipediaUrlForm({ onSubmit, isProcessing }: WikipediaUrlFormProps) {
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null);
  
  const form = useForm<WikipediaUrlFormValues>({
    resolver: zodResolver(wikipediaUrlSchema),
    defaultValues: {
      url: "",
      fullContent: false,
    },
  });

  const handleUrlChange = (value: string) => {
    if (!value) {
      setIsValidUrl(null);
      return;
    }
    
    try {
      const regex = /^https?:\/\/([\w-]+\.)*wikipedia\.org\/wiki\/.+$/i;
      setIsValidUrl(regex.test(value));
    } catch (error) {
      setIsValidUrl(false);
    }
  };

  const handleSubmit = (values: WikipediaUrlFormValues) => {
    onSubmit(values.url, values.fullContent);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">
                  Wikipedia URL
                </FormLabel>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link className="h-4 w-4 text-gray-400" />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="https://en.wikipedia.org/wiki/Example"
                      className={cn(
                        "pl-10 pr-12 py-3",
                        isValidUrl === true && "pr-10",
                        isValidUrl === false && "border-red-300 focus:ring-red-500 focus:border-red-500 pr-10"
                      )}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleUrlChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {isValidUrl === true && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {isValidUrl === false && <XCircle className="h-4 w-4 text-red-500" />}
                  </div>
                </div>
                <FormMessage />
                <p className="mt-2 text-xs text-gray-500">
                  Example: https://en.wikipedia.org/wiki/Semantic_Web
                </p>
              </FormItem>
            )}
          />
          
          <div className="flex items-center justify-between pt-2">
            <FormField
              control={form.control}
              name="fullContent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="fullContent"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel
                      htmlFor="fullContent"
                      className="text-sm font-normal text-gray-700 cursor-pointer"
                    >
                      Process full article content
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <span>Convert to N-Quads</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
