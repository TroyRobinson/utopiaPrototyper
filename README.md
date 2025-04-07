# Utopia React App Generator

A chat interface that uses OpenRouter API to generate mini React applications based on user input.

## Setup

1. Clone this repository
2. Install dependencies
   ```
   npm install
   ```
3. Add your OpenRouter API key using one of these methods:
   
   a) Create a `.env` file in the root directory:
   ```
   VITE_OPENROUTER_API_KEY=your_api_key_here
   ```
   
   b) Or set it in your browser's localStorage (useful for Utopia editor):
   ```javascript
   localStorage.setItem('OPENROUTER_API_KEY', 'your_api_key_here')
   ```
   
   Get your API key from https://openrouter.ai/keys

4. Start the development server
   ```
   npm start
   ```

## Using in Utopia Editor

If you're opening this project in the Utopia editor (https://utopia.app), you may need to set the OpenRouter API key in localStorage using the browser console. This is because Utopia may not have access to environment variables from the .env file.

1. Open the browser console in Utopia (F12 or right-click -> Inspect)
2. Run: `localStorage.setItem('OPENROUTER_API_KEY', 'your_api_key_here')`
3. Refresh the page

## How to Use

1. Open the app in your browser
2. Enter a prompt in the chat interface describing the React application you want to generate
3. The AI will respond with a fully functional React app that will be rendered within the chat interface
4. You can view the source code by clicking "View Code" below the generated app

## Features

- Real-time chat interface
- Integration with OpenRouter API (GPT-4o by default)
- Live rendering of generated React components
- Code viewing and error handling

## Technology Stack

- React
- Vite
- OpenRouter API 