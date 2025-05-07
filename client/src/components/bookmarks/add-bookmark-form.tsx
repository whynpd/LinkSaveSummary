import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const addBookmarkSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

type AddBookmarkFormValues = z.infer<typeof addBookmarkSchema>;

export default function AddBookmarkForm() {
  const { toast } = useToast();
  
  const form = useForm<AddBookmarkFormValues>({
    resolver: zodResolver(addBookmarkSchema),
    defaultValues: {
      url: "",
    },
  });

  const addBookmarkMutation = useMutation({
    mutationFn: async (data: AddBookmarkFormValues) => {
      const res = await apiRequest("POST", "/api/bookmarks", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      form.reset();
      toast({
        title: "Bookmark added",
        description: "Your bookmark has been saved and summarized.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add bookmark",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: AddBookmarkFormValues) {
    addBookmarkMutation.mutate(data);
  }

  return (
    <Card className="mb-8 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
      <CardContent className="pt-6">
        <CardTitle className="text-xl font-bold mb-4">Add New Bookmark</CardTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <div className="flex rounded-md overflow-hidden shadow-sm">
                    <FormControl>
                      <Input 
                        placeholder="https://example.com" 
                        {...field} 
                        className="rounded-r-none border-r-0"
                      />
                    </FormControl>
                    <Button 
                      type="submit" 
                      className="rounded-l-none px-4"
                      disabled={addBookmarkMutation.isPending}
                    >
                      {addBookmarkMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <FormDescription>
                    Enter any website URL to save and auto-summarize
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
