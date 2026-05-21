import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { RefreshCw, Home } from 'lucide-react';
import { tethrynService } from '../services/tethrynService';
import { TemplateRenderer } from '../core/renderer/TemplateRenderer';
import { TethrynExperience } from '../types/tethryn';
import { getTemplateById } from '../templates/registry';

export default function ViewPage() {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const location = useLocation();
  const [data, setData] = useState<TethrynExperience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnwrapped, setIsUnwrapped] = useState(false);

  useEffect(() => {
    async function loadExperience() {
      const searchParams = new URLSearchParams(location.search);
      const templateParam = searchParams.get('template');

      if (id === 'preview' && templateParam) {
        const template = getTemplateById(templateParam);
        if (template) {
          setData({
            templateId: templateParam,
            content: template.defaults,
            title: template.schema.title,
            recipientName: 'The Beloved',
            senderName: 'The Storyteller',
            isPublished: true,
            views: 0,
            authorId: 'system',
            slug: 'preview',
            createdAt: new Date(),
            updatedAt: new Date()
          } as any);
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      try {
        let result: TethrynExperience | null = null;
        
        if (slug) {
          result = await tethrynService.getBySlug(slug);
        } else if (id && id !== 'preview') {
          result = await tethrynService.getById(id);
        }

        if (result) {
          if (!result.isPublished) {
            setError('Story is not public');
          } else {
            const template = getTemplateById(result.templateId);
            const mergedContent = template 
              ? { ...template.defaults, ...result.content }
              : result.content;

            setData({
              ...result,
              content: mergedContent
            });
            
            if (result.id) tethrynService.incrementViews(result.id);
          }
        } else {
          setError('Story not found');
        }
      } catch (err) {
        setError('Failed to load story');
      } finally {
        setLoading(false);
      }
    }
    loadExperience();
  }, [id, slug]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-tethryn-bg">
        <RefreshCw className="animate-spin text-tethryn-accent/30 mb-8" size={32} />
        <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-tethryn-muted">Loading Story...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-tethryn-bg px-8 text-center relative overflow-hidden">
        <div className="atmosphere" />
        <div className="noise" />
        <div className="relative z-10">
          <h2 className="text-6xl font-serif text-tethryn-ink mb-10 italic">{error}</h2>
          <p className="text-tethryn-muted text-[11px] max-w-sm mx-auto mb-16 uppercase tracking-[0.3em] leading-loose">
            The digital experience you are looking for is currently unavailable.
          </p>
          <Link to="/" className="btn-premium-secondary inline-flex items-center space-x-4 px-12">
            <Home size={16} />
            <span className="tracking-[0.2em]">RETURN HOME</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-hidden">
        <TemplateRenderer 
          templateId={data.templateId}
          content={data.content}
          isUnwrapped={isUnwrapped}
          onUnwrap={() => setIsUnwrapped(true)}
          experienceData={data}
        />
        
        {/* Subtle Watermark for non-whitelabel (Optional) */}
        <div className="fixed bottom-6 right-6 z-[60] pointer-events-none opacity-20 hover:opacity-100 transition-opacity">
           <span className="text-[8px] font-black uppercase tracking-[0.5em]">TETHRYN</span>
        </div>
    </div>
  );
}
