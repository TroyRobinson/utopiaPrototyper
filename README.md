# Utopia React App Generator

A chat interface that uses OpenRouter API to generate mini React applications based on user input.

## Setup

1. Clone this repository
2. Install dependencies
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with your OpenRouter API key:
   ```
   VITE_OPENROUTER_API_KEY=your_api_key_here
   ```
   Get your API key from https://openrouter.ai/keys

4. Start the development server
   ```
   npm start
   ```

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