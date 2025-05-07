import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { setupBookmarks } from "./bookmarks";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes (/api/register, /api/login, /api/logout, /api/user)
  setupAuth(app);
  
  // Set up bookmark routes (/api/bookmarks)
  setupBookmarks(app);

  const httpServer = createServer(app);

  return httpServer;
}
