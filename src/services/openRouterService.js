// OpenRouter API service
// Store your API key using the localStorage.setItem('OPENROUTER_API_KEY', 'your_key_here') method
// You can get your API key from https://openrouter.ai/keys

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Access the API key from localStorage for Utopia compatibility
const getApiKey = () => {
  try {
    // For browser development
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('OPENROUTER_API_KEY');
    }
    
    // Fallback
    return '';
  } catch (e) {
    console.warn('Error accessing environment variables:', e);
    return '';
  }
};

export async function sendMessageToOpenRouter(messages) {
  try {
    // Get API key from localStorage (Utopia-compatible)
    const apiKey = getApiKey();
    
    if (!apiKey) {
      throw new Error('OpenRouter API key is missing. Please set it using: localStorage.setItem("OPENROUTER_API_KEY", "your_api_key_here")');
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