// Function to fetch summary using Jina AI
export async function fetchJinaSummary(url: string): Promise<string> {
  try {
    // Make sure the URL includes the protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    const encodedUrl = encodeURIComponent(url);
    const apiUrl = `https://api.jina.ai/v1/summarize?url=${encodedUrl}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch summary: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.summary || "No summary available.";
  } catch (error) {
    console.error("Error fetching summary:", error);
    return "Summary could not be generated. This might be due to API limits or the content format.";
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
