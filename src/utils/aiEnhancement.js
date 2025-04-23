import { useState } from 'react';

export const useAiEnhancement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const enhanceTextWithAI = async (text, customPrompt = '') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const basePrompt = "Enhance the following text to make it more professional and impactful for a resume: ";
      const prompt = customPrompt ? customPrompt : basePrompt;
      
      const response = await fetch(import.meta.env.VITE_OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat:free',
          messages: [
            {
              role: 'user',
              content: `${prompt}\n\n${text}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setIsLoading(false);
    setError(null);
  };

  return { enhanceTextWithAI, isLoading, error, resetState };
};