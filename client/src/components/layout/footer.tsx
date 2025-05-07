export default function Footer() {
  return (
    <footer className="py-4 px-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} LinkSaver. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            Terms
          </a>
          <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            Privacy
          </a>
          <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            Help
          </a>
        </div>
      </div>
    </footer>
  );
}
