import fetch from "node-fetch";
import { JSDOM } from "jsdom";

/**
 * Fetches content from a Wikipedia page
 * @param url The Wikipedia URL to fetch
 * @param fullContent Whether to fetch the full article or just the introduction
 * @returns The extracted content as plain text
 */
export async function fetchWikipediaContent(url: string, fullContent: boolean = false): Promise<string | null> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Wikipedia page: ${response.statusText}`);
    }
    
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Get the page title
    const title = document.querySelector(".mw-page-title-main")?.textContent || "";
    
    // Get the content container
    const contentElement = document.querySelector("#mw-content-text");
    
    if (!contentElement) {
      throw new Error("Could not find content element");
    }
    
    let content = "";
    
    // If we want the full content, get all paragraphs from the content area
    if (fullContent) {
      // Get all paragraphs from the main content, excluding tables and navigation boxes
      const paragraphs = contentElement.querySelectorAll(".mw-parser-output > p");
      content = Array.from(paragraphs)
        .map(p => p.textContent?.trim())
        .filter(text => text && text.length > 0)
        .join("\n\n");
    } else {
      // Otherwise, just get the introduction (first few paragraphs before the first heading)
      const paragraphs = contentElement.querySelectorAll(".mw-parser-output > p");
      let introText = "";
      
      for (let i = 0; i < paragraphs.length; i++) {
        const p = paragraphs[i];
        const text = p.textContent?.trim();
        
        if (text && text.length > 0) {
          introText += text + "\n\n";
          
          // If the next element is a heading (h2/h3), stop here - we've reached the end of the intro
          const nextElement = p.nextElementSibling;
          if (nextElement && (nextElement.tagName === "H2" || nextElement.tagName === "H3")) {
            break;
          }
        }
      }
      
      content = introText;
    }
    
    // If no content was extracted, throw an error
    if (!content) {
      throw new Error("No content was extracted from the Wikipedia page");
    }
    
    // Combine title and content
    return `${title}\n\n${content}`.trim();
  } catch (error) {
    console.error("Error fetching Wikipedia content:", error);
    return null;
  }
}
