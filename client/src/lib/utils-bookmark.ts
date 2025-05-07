// Function to fetch summary using Jina AI
export async function fetchJinaSummary(url: string): Promise<string> {
  try {
    const encodedUrl = encodeURIComponent(url);
    const response = await fetch(`https://r.jina.ai/http://${encodedUrl}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch summary: ${response.statusText}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error("Error fetching summary:", error);
    return "Summary temporarily unavailable.";
  }
}

// Function to extract favicon from a URL
export function getFaviconUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
  } catch (error) {
    console.error("Error getting favicon URL:", error);
    return "";
  }
}

// Function to format a date for UI display
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
