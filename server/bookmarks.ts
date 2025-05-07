import { Express, Request, Response } from "express";
import { storage } from "./storage";
import { z } from "zod";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

// Helper function to check if user is authenticated
function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

// Helper function to fetch summary from Jina AI
async function fetchSummary(url: string): Promise<string> {
  try {
    // Make sure the URL includes the protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    // Use a different approach for Jina AI
    const encodedUrl = encodeURIComponent(url);
    
    // Try the proper format for Jina AI - remove http:// prefix in the encoded URL
    const apiUrl = `https://api.jina.ai/v1/summarize?url=${encodedUrl}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch summary: ${response.statusText}`);
    }
    
    const result = await response.json() as { summary?: string };
    return result.summary || "No summary available.";
  } catch (error) {
    console.error("Error fetching summary:", error);
    // Return a placeholder summary
    return "Summary could not be generated. This might be due to API limits or the content format.";
  }
}

// Helper function to fetch webpage metadata
async function fetchWebpageMeta(url: string): Promise<{ title: string; favicon: string }> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Extract title
    let title = document.title || "Unknown Title";
    
    // Try to extract favicon
    let favicon = "";
    
    // Check for favicon link
    const faviconLink = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
    if (faviconLink && faviconLink.getAttribute("href")) {
      let faviconPath = faviconLink.getAttribute("href") || "";
      
      // Handle relative URLs
      if (faviconPath.startsWith("/")) {
        const urlObj = new URL(url);
        favicon = `${urlObj.protocol}//${urlObj.hostname}${faviconPath}`;
      } else if (!faviconPath.startsWith("http")) {
        const urlObj = new URL(url);
        favicon = `${urlObj.protocol}//${urlObj.hostname}/${faviconPath}`;
      } else {
        favicon = faviconPath;
      }
    } else {
      // Fallback to default favicon location
      const urlObj = new URL(url);
      favicon = `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
    }
    
    return { title, favicon };
  } catch (error) {
    console.error("Error fetching webpage metadata:", error);
    return { 
      title: new URL(url).hostname, 
      favicon: "" 
    };
  }
}

export function setupBookmarks(app: Express) {
  // Create bookmark schema
  const createBookmarkSchema = z.object({
    url: z.string().url("Invalid URL"),
  });

  // GET /api/bookmarks - Get all bookmarks for the current user
  app.get("/api/bookmarks", isAuthenticated, async (req, res) => {
    try {
      // req.user is guaranteed to exist because of isAuthenticated middleware
      const bookmarks = await storage.getBookmarks(req.user!.id);
      res.json(bookmarks);
    } catch (error) {
      console.error("Error getting bookmarks:", error);
      res.status(500).json({ message: "Failed to get bookmarks" });
    }
  });

  // POST /api/bookmarks - Create a new bookmark
  app.post("/api/bookmarks", isAuthenticated, async (req, res) => {
    try {
      const validatedData = createBookmarkSchema.parse(req.body);
      
      // Fetch webpage metadata and summary in parallel
      const [meta, summary] = await Promise.all([
        fetchWebpageMeta(validatedData.url),
        fetchSummary(validatedData.url)
      ]);
      
      // req.user is guaranteed to exist because of isAuthenticated middleware
      const bookmark = await storage.createBookmark({
        userId: req.user!.id,
        url: validatedData.url,
        title: meta.title,
        favicon: meta.favicon,
        summary
      });
      
      res.status(201).json(bookmark);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Error creating bookmark:", error);
      res.status(500).json({ message: "Failed to create bookmark" });
    }
  });

  // GET /api/bookmarks/:id - Get a specific bookmark
  app.get("/api/bookmarks/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid bookmark ID" });
      }
      
      const bookmark = await storage.getBookmark(id);
      if (!bookmark) {
        return res.status(404).json({ message: "Bookmark not found" });
      }
      
      // Only allow accessing user's own bookmarks
      // req.user is guaranteed to exist because of isAuthenticated middleware
      if (bookmark.userId !== req.user!.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(bookmark);
    } catch (error) {
      console.error("Error getting bookmark:", error);
      res.status(500).json({ message: "Failed to get bookmark" });
    }
  });

  // DELETE /api/bookmarks/:id - Delete a bookmark
  app.delete("/api/bookmarks/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid bookmark ID" });
      }
      
      const bookmark = await storage.getBookmark(id);
      if (!bookmark) {
        return res.status(404).json({ message: "Bookmark not found" });
      }
      
      // Only allow deleting user's own bookmarks
      // req.user is guaranteed to exist because of isAuthenticated middleware
      if (bookmark.userId !== req.user!.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.deleteBookmark(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      res.status(500).json({ message: "Failed to delete bookmark" });
    }
  });
}
