import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import BookmarkList from "@/components/bookmarks/bookmark-list";
import AddBookmarkForm from "@/components/bookmarks/add-bookmark-form";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <AddBookmarkForm />
        <BookmarkList />
      </main>
      <Footer />
    </div>
  );
}
