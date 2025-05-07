import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Bookmark } from "@shared/schema";
import { formatDate } from "@/lib/utils-bookmark";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Trash2 } from "lucide-react";

interface BookmarkCardProps {
  bookmark: Bookmark;
}

export default function BookmarkCard({ bookmark }: BookmarkCardProps) {
  const { toast } = useToast();
  
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/bookmarks/${bookmark.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      toast({
        title: "Bookmark deleted",
        description: "The bookmark has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete bookmark",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
      <CardHeader className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          {bookmark.favicon ? (
            <img 
              src={bookmark.favicon} 
              alt={`${bookmark.title} favicon`} 
              className="w-6 h-6 rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }} 
            />
          ) : (
            <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900 rounded flex items-center justify-center">
              <span className="text-primary-700 dark:text-primary-300 text-xs">
                {bookmark.title.charAt(0)}
              </span>
            </div>
          )}
          <h3 className="font-medium truncate text-sm">{bookmark.title}</h3>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
              <Trash2 size={16} />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Bookmark</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this bookmark? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-red-600 hover:bg-red-700"
                onClick={() => deleteMutation.mutate()}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4">
          {bookmark.summary}
        </p>
      </CardContent>
      <CardFooter className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
        <span>Saved: {formatDate(bookmark.createdAt)}</span>
        <a 
          href={bookmark.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          Visit <ExternalLink className="ml-1" size={12} />
        </a>
      </CardFooter>
    </Card>
  );
}
