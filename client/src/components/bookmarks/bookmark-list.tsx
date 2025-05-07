import { useQuery } from "@tanstack/react-query";
import { Bookmark } from "@shared/schema";
import BookmarkCard from "./bookmark-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Grid, List } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookmarkList() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const { data: bookmarks, isLoading, error } = useQuery<Bookmark[]>({
    queryKey: ["/api/bookmarks"],
  });

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Your Bookmarks</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4 mr-1" /> List
            </Button>
            <Button variant="outline" size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="h-4 w-4 mr-1" /> Grid
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-2">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="p-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error loading bookmarks: {error.message}</div>;
  }

  if (!bookmarks || bookmarks.length === 0) {
    return (
      <div className="mt-10 text-center max-w-md mx-auto">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">No bookmarks yet</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Start by adding a website URL in the form above to save and auto-summarize it.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Your Bookmarks</h2>
        <div className="flex space-x-2">
          <Button 
            variant={viewMode === "list" ? "secondary" : "outline"} 
            size="sm" 
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4 mr-1" /> List
          </Button>
          <Button 
            variant={viewMode === "grid" ? "secondary" : "outline"} 
            size="sm" 
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4 mr-1" /> Grid
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          {bookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      )}
    </div>
  );
}
