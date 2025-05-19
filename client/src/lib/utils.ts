import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return bytes + 'B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + 'KB';
  } else {
    return (bytes / (1024 * 1024)).toFixed(1) + 'MB';
  }
}

export function isValidWikipediaUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('wikipedia.org') && urlObj.pathname.startsWith('/wiki/');
  } catch (error) {
    return false;
  }
}

export function countEntitiesAndPredicates(nquads: string): { entities: number, predicates: number } {
  if (!nquads.trim()) {
    return { entities: 0, predicates: 0 };
  }
  
  const entities = new Set<string>();
  const predicates = new Set<string>();
  
  const lines = nquads.split('\n').filter(line => line.trim().length > 0);
  
  for (const line of lines) {
    const parts = line.split(' ');
    if (parts.length >= 3) {
      entities.add(parts[0]);
      entities.add(parts[2]);
      predicates.add(parts[1]);
    }
  }
  
  return {
    entities: entities.size,
    predicates: predicates.size
  };
}
