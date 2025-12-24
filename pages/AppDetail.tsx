
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../AppContext';
import { Download, ChevronLeft, Calendar, Tag, Star, ShieldCheck, FileText } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { getIconComponent } from '../utils/iconMap';

// Markdown renderer for description and feature content
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
          parts.push(<strong key={`${keyPrefix}-bold-${keyCounter++}`} className="font-bold">{boldContent}</strong>);
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

const AppDetail: React.FC = () => {
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
    <div className="min-h-screen bg-dark pt-20">
      {/* Header Banner */}
      <div className="bg-card border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            {t('allApps')}
          </Link>

          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            <img
              src={app.iconUrl}
              alt={app.name}
              className="w-32 h-32 md:w-48 md:h-48 rounded-3xl shadow-2xl object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                  {app.category[language]}
                </span>

              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{app.name}</h1>
              <div className="text-xl text-gray-400 mb-8 max-w-2xl">
                {renderMarkdown(app.description[language])}
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href={app.downloadLink}
                  className="bg-white text-darker px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  {t('downloadAppStore')}
                </a>

                <Link
                  to={`/app/${app.id}/privacy`}
                  className="bg-white/5 text-white border border-white/10 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/10 transition-colors"
                >
                  <ShieldCheck className="w-5 h-5" />
                  {t('readPrivacyPolicy')}
                </Link>

                <Link
                  to={`/app/${app.id}/terms`}
                  className="bg-white/5 text-white border border-white/10 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/10 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  {t('readTerms')}
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500 mt-6">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  v{app.version}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {app.lastUpdated[language]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Features Grid */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-white mb-12">{t('features')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {app.features.map((feature, idx) => {
              const Icon = getIconComponent(feature.iconName);
              return (
                <div key={idx} className="bg-card p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6 text-primary">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title[language]}</h3>
                  <div className="text-gray-400 leading-relaxed">
                    {renderMarkdown(feature.description[language])}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Screenshots Gallery */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-white mb-12">{t('screenshots')}</h2>
          <div className="overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex gap-6 min-w-max">
              {app.screenshots.map((screen, idx) => (
                <div key={idx} className="relative group w-[280px] sm:w-[320px] aspect-[1/2] rounded-[2.5rem] overflow-hidden border-8 border-gray-800 bg-gray-900 shadow-2xl flex-shrink-0">
                  <img
                    src={screen}
                    alt={`Screenshot ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Phone Reflection Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none rounded-[2rem]"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDetail;
