# Reddit Reviews Generator

## Overview
The Reddit Reviews Generator is a TypeScript React application that allows users to input a product title and retrieve related comments from Reddit. The application processes these comments to determine their sentiment and displays them in a user-friendly format.

## Features
- Input field for product title with a three-word limit.
- Fetches 30 to 50 random comments from Reddit based on the product title.
- Analyzes the sentiment of each comment (positive, negative, or neutral).
- Displays comments alongside the product title.
- Option to copy the array of comments to the clipboard.

## Project Structure
```
reddit-reviews-generator
├── src
│   ├── components
│   │   ├── CommentCard.tsx       # Displays individual Reddit comments
│   │   ├── CommentsList.tsx      # Renders a list of CommentCard components
│   │   ├── ProductTitleInput.tsx # Input for product title
│   │   └── CopyButton.tsx        # Button to copy comments to clipboard
│   ├── hooks
│   │   ├── useRedditComments.ts   # Custom hook for fetching Reddit comments
│   │   └── useSentimentAnalysis.ts # Custom hook for sentiment analysis
│   ├── services
│   │   ├── redditApi.ts           # Functions for Reddit API interactions
│   │   └── sentimentApi.ts        # Functions for sentiment analysis API
│   ├── types
│   │   ├── comment.ts             # Defines the structure of comment objects
│   │   └── reddit.ts              # Types for Reddit API responses
│   ├── utils
│   │   ├── validation.ts          # Utility functions for input validation
│   │   └── formatting.ts          # Utility functions for data formatting
│   ├── pages
│   │   └── RedditReviewsPage.tsx  # Main page integrating components
│   └── App.tsx                    # Entry point of the application
├── package.json                    # npm configuration file
├── tsconfig.json                   # TypeScript configuration file
└── README.md                       # Project documentation
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd reddit-reviews-generator
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage
1. Start the development server:
   ```
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000` to access the application.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.