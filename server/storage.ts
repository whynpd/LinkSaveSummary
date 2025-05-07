import { users, User, InsertUser, bookmarks, Bookmark, InsertBookmark } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Bookmark operations
  getBookmarks(userId: number): Promise<Bookmark[]>;
  getBookmark(id: number): Promise<Bookmark | undefined>;
  createBookmark(bookmark: InsertBookmark & { userId: number; title: string; summary?: string; favicon?: string }): Promise<Bookmark>;
  deleteBookmark(id: number): Promise<void>;
  
  // Session store
  sessionStore: session.SessionStore;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private bookmarks: Map<number, Bookmark>;
  private userIdCounter: number;
  private bookmarkIdCounter: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.bookmarks = new Map();
    this.userIdCounter = 1;
    this.bookmarkIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { id, ...insertUser, createdAt };
    this.users.set(id, user);
    return user;
  }

  // Bookmark methods
  async getBookmarks(userId: number): Promise<Bookmark[]> {
    return Array.from(this.bookmarks.values()).filter(
      (bookmark) => bookmark.userId === userId
    );
  }

  async getBookmark(id: number): Promise<Bookmark | undefined> {
    return this.bookmarks.get(id);
  }

  async createBookmark(data: InsertBookmark & { userId: number; title: string; summary?: string; favicon?: string }): Promise<Bookmark> {
    const id = this.bookmarkIdCounter++;
    const createdAt = new Date();
    const bookmark: Bookmark = { 
      id, 
      userId: data.userId, 
      url: data.url, 
      title: data.title,
      summary: data.summary || "", 
      favicon: data.favicon || "",
      createdAt 
    };
    this.bookmarks.set(id, bookmark);
    return bookmark;
  }

  async deleteBookmark(id: number): Promise<void> {
    this.bookmarks.delete(id);
  }
}

export const storage = new MemStorage();
