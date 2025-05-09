# LinkSaveSummary


A web application for saving and managing bookmarks with automatic summarization of webpage content.






![image](https://github.com/user-attachments/assets/45d966b5-77bc-4e59-9135-027f62950f05)






## Features

- Save bookmarks with automatic summarization
- Organize and manage your bookmarks
- Clean and direct summaries extracted from webpage content
- Clean and user-friendly interface

![image](https://github.com/user-attachments/assets/02c6bfd5-0915-418c-be49-71620b0e0282)


## Setup & Installation

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Setting up the application

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up the database:
   ```
   npm run db:push
   ```
4. Start the development server:
   ```
   npm run dev:with-summary
   ```

## How it works

1. When you save a bookmark, the system:
   - Fetches the webpage content using Jina AI Reader API in plaintext mode
   - Extracts meaningful content and the title through text processing
   - Uses the first 2 lines of body text as the summary
   - Automatically filters out navigation, menus, and "skip to content" text
   - Saves the bookmark with the summary

2. The bookmark card displays:
   - The website title
   - The extracted direct text summary
   - Link to the original URL

## About the Summarization Approach

The application uses a straightforward approach to summarization:

1. **Content Extraction**:
   - Efficiently extracts clean content from any URL
   - Removes ads, navigation, and other non-content elements
   - Identifies and filters out common UI elements like "skip to content" links
   - Preserves the actual body text of the webpage

2. **Direct Text Summarization**:
   - Takes the first 2 meaningful lines of content
   - No AI models or complex processing required
   - Fast and simple approach that works for most webpages

## License

MIT

# LinkSaveSummary
 
