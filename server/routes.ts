import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { fetchWikipediaContent } from "./wikipedia";
import { convertToNquads } from "./openrouter";
import { formatFileSize, countEntitiesAndPredicates } from "../client/src/lib/utils";

export async function registerRoutes(app: Express): Promise<Server> {
  // Endpoint to convert Wikipedia URL to nquads
  app.post("/api/convert", async (req, res) => {
    try {
      const { url, fullContent } = req.body;
      
      // Validate URL
      if (!url || typeof url !== "string") {
        return res.status(400).json({ message: "URL is required and must be a string" });
      }
      
      // Validate that the URL is a Wikipedia URL
      try {
        const urlObj = new URL(url);
        if (!urlObj.hostname.includes('wikipedia.org') || !urlObj.pathname.startsWith('/wiki/')) {
          return res.status(400).json({ message: "Invalid Wikipedia URL" });
        }
      } catch (error) {
        return res.status(400).json({ message: "Invalid URL format" });
      }
      
      // Fetch Wikipedia content
      const wikiContent = await fetchWikipediaContent(url, !!fullContent);
      
      if (!wikiContent) {
        return res.status(404).json({ message: "Failed to fetch Wikipedia content" });
      }
      
      // Convert to nquads using Open Router
      const nquads = await convertToNquads(wikiContent, url);
      
      if (!nquads) {
        return res.status(500).json({ message: "Failed to convert content to nquads" });
      }
      
      // Count triples
      const lines = nquads.split('\n').filter(line => line.trim().length > 0);
      const triplesCount = lines.length;
      
      // Count entities and predicates
      const { entities, predicates } = countEntitiesAndPredicates(nquads);
      
      // Calculate file size
      const fileSize = formatFileSize(Buffer.byteLength(nquads, 'utf8'));
      
      return res.status(200).json({
        nquads,
        stats: {
          triples: triplesCount,
          entities,
          predicates,
          fileSize
        },
        sourceUrl: url
      });
    } catch (error) {
      console.error("Error processing Wikipedia conversion:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "An unknown error occurred" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
