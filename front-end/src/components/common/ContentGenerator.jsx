import React, { useState } from 'react';
import { Wand2, Loader2, Copy, Check, RefreshCw, Sparkles } from 'lucide-react';
import axios from 'axios';

/**
 * ContentGenerator - AI-powered content generation component
 * 
 * @param {Object} props
 * @param {string} props.contentType - Type of content to generate ('description', 'titles', 'keywords', 'social')
 * @param {Object} props.productData - Product information for generation
 * @param {Function} props.onContentGenerated - Callback when content is generated
 * @param {string} props.existingContent - Existing content to enhance
 */
const ContentGenerator = ({
  contentType = 'description',
  productData = {},
  onContentGenerated,
  existingContent = ''
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const contentTypeConfig = {
    description: {
      title: 'Generate Product Description',
      icon: <Sparkles className="w-5 h-5" />,
      endpoint: '/api/content/generate-description',
      buttonText: 'Generate Description'
    },
    titles: {
      title: 'Generate Title Ideas',
      icon: <Wand2 className="w-5 h-5" />,
      endpoint: '/api/content/generate-titles',
      buttonText: 'Generate Titles'
    },
    keywords: {
      title: 'Generate Keywords & Tags',
      icon: <Sparkles className="w-5 h-5" />,
      endpoint: '/api/content/generate-keywords',
      buttonText: 'Generate Keywords'
    },
    social: {
      title: 'Generate Social Media Post',
      icon: <Sparkles className="w-5 h-5" />,
      endpoint: '/api/content/generate-social-post',
      buttonText: 'Generate Post'
    },
    enhance: {
      title: 'Enhance Description',
      icon: <Wand2 className="w-5 h-5" />,
      endpoint: '/api/content/enhance-description',
      buttonText: 'Enhance'
    }
  };

  const config = contentTypeConfig[contentType] || contentTypeConfig.description;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');
    setGeneratedContent('');

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      let payload = {};
      
      if (contentType === 'enhance' && existingContent) {
        payload = { description: existingContent, improvementType: 'general' };
      } else {
        payload = productData;
      }

      const response = await axios.post(
        `${API_URL}${config.endpoint}`,
        payload,
        { headers }
      );

      if (response.data.success) {
        const content = response.data.data;
        
        let formattedContent = '';
        
        if (contentType === 'titles' && content.titles) {
          formattedContent = content.titles.join('\n');
        } else if (contentType === 'keywords' && content.keywords) {
          formattedContent = content.keywords.join(', ');
        } else if (contentType === 'social' && content.text) {
          formattedContent = `${content.text}\n\n${content.hashtags}`;
        } else if (content.description) {
          // Clean and format the description professionally
          formattedContent = content.description
            .replace(/\*\*/g, '') // Remove markdown bold
            .replace(/\*/g, '') // Remove markdown italic
            .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with max 2
            .replace(/^[\s\n]+/, '') // Remove leading whitespace
            .replace(/[\s\n]+$/, '') // Remove trailing whitespace
            .replace(/\s{2,}/g, ' ') // Replace multiple spaces with single space
            .trim();
        } else if (content.enhanced) {
          formattedContent = content.enhanced
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .replace(/\n{3,}/g, '\n\n')
            .replace(/^[\s\n]+/, '')
            .replace(/[\s\n]+$/, '')
            .replace(/\s{2,}/g, ' ')
            .trim();
        }
        
        setGeneratedContent(formattedContent);
        // DO NOT call onContentGenerated here - only call when "Use This" is clicked
      }
    } catch (err) {
      console.error('Content generation error:', err);
      setError(err.response?.data?.error || 'Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUse = () => {
    if (onContentGenerated && generatedContent) {
      // Pass the cleaned, formatted content as a string
      onContentGenerated(generatedContent);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white">
          {config.icon}
        </div>
        <div>
          <h3 className="font-semibold text-stone-800 text-lg">{config.title}</h3>
          <p className="text-sm text-stone-600">Powered by AI ✨</p>
        </div>
      </div>

      {/* Generate Button */}
      {!generatedContent && (
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>{config.buttonText}</span>
            </>
          )}
        </button>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Generated Content */}
      {generatedContent && (
        <div className="mt-4 space-y-3">
          <div className="bg-white rounded-lg border border-purple-200 p-4">
            <div className="prose prose-sm max-w-none">
              <p className="text-stone-700 whitespace-pre-wrap">{generatedContent}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleCopy}
              className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={handleUse}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Use This</span>
            </button>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Regenerate</span>
            </button>
          </div>
        </div>
      )}

      {/* Usage Tips */}
      {!generatedContent && !isGenerating && (
        <div className="mt-4 text-xs text-stone-500 space-y-1">
          <p>💡 <strong>Tip:</strong> AI generates unique content based on your product details.</p>
          <p>🎨 You can regenerate multiple times for different variations.</p>
        </div>
      )}
    </div>
  );
};

export default ContentGenerator;
