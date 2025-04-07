// OpenRouter API service
// Store your API key in an .env file in the root directory as VITE_OPENROUTER_API_KEY=your_api_key_here
// You can get your API key from https://openrouter.ai/keys

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function sendMessageToOpenRouter(messages) {
  try {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenRouter API key is missing. Please add your API key to .env file as VITE_OPENROUTER_API_KEY=your_api_key_here');
    }

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin, // Required for OpenRouter API
        'X-Title': 'React App Generator Chat Interface'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o', // Using GPT-4o which is excellent for code generation
        messages,
        max_tokens: 4000,
        temperature: 0.7,
        response_format: { type: "text" } // Ensure we get plain text back
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to communicate with OpenRouter API');
    }

    return await response.json();
  } catch (error) {
    console.error('Error communicating with OpenRouter:', error);
    throw error;
  }
} 