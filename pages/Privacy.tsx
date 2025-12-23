
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../AppContext';
import { ShieldCheck, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

// Simple markdown renderer for policy content
const renderMarkdown = (text: string): React.ReactNode => {
  if (!text) return null;
  
  // Split by lines and process each line
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  
  const processInlineMarkdown = (line: string, keyPrefix: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let keyCounter = 0;
    let remaining = line;
    
    while (remaining.length > 0) {
      // Find the earliest markdown pattern
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);
      
      let nextMatch: { index: number; length: number; type: 'bold' | 'italic'; content: string } | null = null;
      
      if (boldMatch && boldMatch.index !== undefined) {
        nextMatch = {
          index: boldMatch.index,
          length: boldMatch[0].length,
          type: 'bold',
          content: boldMatch[1]
        };
      }
      
      if (italicMatch && italicMatch.index !== undefined) {
        if (!nextMatch || italicMatch.index < nextMatch.index) {
          nextMatch = {
            index: italicMatch.index,
            length: italicMatch[0].length,
            type: 'italic',
            content: italicMatch[1]
          };
        }
      }
      
      if (nextMatch) {
        // Add text before the match
        if (nextMatch.index > 0) {
          parts.push(<span key={`${keyPrefix}-text-${keyCounter++}`}>{remaining.slice(0, nextMatch.index)}</span>);
        }
        
        // Add the formatted text
        if (nextMatch.type === 'bold') {
          const boldContent = processInlineMarkdown(nextMatch.content, `${keyPrefix}-bold-${keyCounter}`);
          parts.push(<strong key={`${keyPrefix}-bold-${keyCounter++}`} className="font-bold text-white">{boldContent}</strong>);
        } else {
          parts.push(<em key={`${keyPrefix}-italic-${keyCounter++}`} className="italic">{nextMatch.content}</em>);
        }
        
        // Continue with remaining text
        remaining = remaining.slice(nextMatch.index + nextMatch.length);
      } else {
        // No more matches, add remaining text (including emojis)
        if (remaining.length > 0) {
          parts.push(<span key={`${keyPrefix}-text-${keyCounter++}`} style={{ whiteSpace: 'pre-wrap' }}>{remaining}</span>);
        }
        break;
      }
    }
    
    return parts.length > 0 ? parts : [<span key={`${keyPrefix}-empty`} style={{ whiteSpace: 'pre-wrap' }}>{line}</span>];
  };
  
  // Group consecutive non-empty lines into paragraphs, and preserve empty lines
  let currentParagraph: string[] = [];
  
  lines.forEach((line, idx) => {
    if (line.trim() === '') {
      // Empty line: if we have a paragraph, render it first
      if (currentParagraph.length > 0) {
        const paragraphText = currentParagraph.join('\n');
        const processed = processInlineMarkdown(paragraphText, `para-${elements.length}`);
        elements.push(
          <p key={`para-${elements.length}`} className="mb-3" style={{ whiteSpace: 'pre-wrap' }}>
            {processed}
          </p>
        );
        currentParagraph = [];
      }
      // Add empty line as spacing
      elements.push(<div key={`empty-${idx}`} className="h-3" />);
    } else {
      // Non-empty line: add to current paragraph
      currentParagraph.push(line);
    }
  });
  
  // Don't forget the last paragraph
  if (currentParagraph.length > 0) {
    const paragraphText = currentParagraph.join('\n');
    const processed = processInlineMarkdown(paragraphText, `para-${elements.length}`);
    elements.push(
      <p key={`para-${elements.length}`} className="mb-3 last:mb-0" style={{ whiteSpace: 'pre-wrap' }}>
        {processed}
      </p>
    );
  }
  
  return <div style={{ whiteSpace: 'pre-wrap' }}>{elements}</div>;
};

const Privacy: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getApp } = useApp();
    const app = id ? getApp(id) : undefined;
    const { language, t } = useLanguage();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!app) {
        return (
          <div className="min-h-screen bg-dark flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl text-white font-bold mb-4">{t('appNotFound')}</h2>
              <Link to="/" className="text-primary hover:underline">{t('returnHome')}</Link>
            </div>
          </div>
        );
      }

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to={`/app/${app.id}`} className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            {t('details')}
        </Link>

        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-secondary/10 rounded-2xl mb-6">
            <ShieldCheck className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{app.name} {t('privacyTitle')}</h1>
          <p className="text-gray-400">{t('lastUpdated')}: {app.lastUpdated[language]}</p>
        </div>

        <div className="bg-card rounded-3xl p-8 md:p-12 border border-white/5 shadow-xl">
          <div className="prose prose-invert max-w-none">
            
            <div className="space-y-12">
              {app.privacyPolicy.map((section, idx) => (
                <div key={idx} className="border-b border-white/5 pb-8 last:border-0 last:pb-0">
                  <h2 className="text-2xl font-bold text-white mb-4">{section.title[language]}</h2>
                  <div className="text-gray-400 leading-relaxed">
                    {renderMarkdown(section.content[language])}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
