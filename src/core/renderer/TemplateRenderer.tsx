import React, { Suspense } from 'react';
import { getTemplateById } from '../../templates/registry';
import { TethrynExperience } from '../../types/tethryn';
import { RefreshCw } from 'lucide-react';

interface TemplateRendererProps {
  templateId: string;
  content: Record<string, any>;
  isUnwrapped?: boolean;
  onUnwrap?: () => void;
  // Passing full data object for templates that need metadata (author, views etc)
  experienceData?: Partial<TethrynExperience>;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ 
  templateId, 
  content, 
  isUnwrapped = false, 
  onUnwrap = () => {},
  experienceData 
}) => {
  const template = getTemplateById(templateId);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  if (!template) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-900 text-white p-12 text-center">
        <div>
          <h2 className="text-2xl font-serif mb-4">Template Lost in Archive</h2>
          <p className="text-neutral-500 text-sm italic">The coordinates for this experience ({templateId}) are invalid.</p>
        </div>
      </div>
    );
  }

  const Component = template.component;

  // We merge content into a mocked experience data structure for the template components
  const mergedData = {
    ...experienceData,
    templateId,
    content,
    // Provide top-level access for fields used in templates, prioritizing experience data
    recipientName: experienceData?.recipientName || content?.recipientName,
    title: experienceData?.title || content?.title,
    senderName: experienceData?.senderName || content?.senderName
  };

  return (
    <div ref={scrollRef} className="w-full h-full overflow-y-auto custom-scrollbar overflow-x-hidden relative">
      <Suspense fallback={
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-tethryn-bg">
          <RefreshCw className="animate-spin text-tethryn-accent mb-4" size={24} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-tethryn-muted opacity-40">Loading Template...</span>
        </div>
      }>
        <Component data={mergedData as any} isUnwrapped={isUnwrapped} onUnwrap={onUnwrap} scrollContainer={scrollRef} />
      </Suspense>
    </div>
  );
};
