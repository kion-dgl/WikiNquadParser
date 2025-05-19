import fetch from "node-fetch";

/**
 * Converts Wikipedia content to N-Quads format using Open Router API
 * @param content The Wikipedia content to convert
 * @param sourceUrl The original Wikipedia URL
 * @returns The content converted to N-Quads format
 */
export async function convertToNquads(content: string, sourceUrl: string): Promise<string | null> {
  try {
    const OPEN_ROUTER_API_KEY = process.env.OPEN_ROUTER_API_KEY;
    
    if (!OPEN_ROUTER_API_KEY) {
      throw new Error("OPEN_ROUTER_API_KEY environment variable is missing");
    }
    
    // Extract the article title from the URL for context
    let articleTitle = "";
    try {
      const urlPath = new URL(sourceUrl).pathname;
      articleTitle = urlPath.split("/").pop() || "";
      articleTitle = articleTitle.replace(/_/g, " ");
    } catch (error) {
      console.error("Error extracting article title:", error);
    }
    
    // Prepare the system prompt
    const systemPrompt = `You are a converter from Wikipedia text to N-Quads format. 
N-Quads is a line-based, plain text format for encoding RDF graphs. Each line consists of a subject, predicate, object, and optional graph label, separated by spaces and terminated with a period.
- Use appropriate URIs for subjects and predicates 
- Generate valid, well-formed N-Quads that follow the W3C standard
- For Wikipedia entities, use URIs like <http://dbpedia.org/resource/ENTITY_NAME>
- For predicates, use standard vocabularies like RDF, RDFS, Dublin Core, FOAF, etc.
- Make sure all URIs are properly enclosed in angle brackets
- Add appropriate language tags to literals where needed (e.g., "@en" for English)
- Format dates and numbers according to proper XSD datatypes
- Do not create any triples that aren't directly derived from the content
- Make sure all lines are valid N-Quads ending with a period`;
    
    // Prepare the user prompt
    const userPrompt = `Convert the following Wikipedia content about "${articleTitle}" to N-Quads format, focusing on extracting the key facts and relationships:\n\n${content}`;
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPEN_ROUTER_API_KEY}`,
        "HTTP-Referer": "https://wikiquads.example", // Replace with your actual domain
        "X-Title": "WikiQuads"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-opus:beta",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.1, // Low temperature for more deterministic outputs
        max_tokens: 4000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Open Router API error: ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0 || !data.choices[0].message) {
      throw new Error("Invalid response from Open Router API");
    }
    
    const nquads = data.choices[0].message.content;
    
    // Try to clean up the response to extract just the nquads
    // This handles cases where the model adds extra markdown formatting
    let cleanedNquads = nquads;
    
    // If wrapped in code blocks, extract just the nquad content
    if (nquads.includes("```")) {
      const codeBlockMatch = nquads.match(/```(?:nquads|n-quads|rdf)?\n([\s\S]*?)\n```/i);
      if (codeBlockMatch && codeBlockMatch[1]) {
        cleanedNquads = codeBlockMatch[1];
      }
    }
    
    return cleanedNquads.trim();
  } catch (error) {
    console.error("Error converting to N-Quads:", error);
    return null;
  }
}
