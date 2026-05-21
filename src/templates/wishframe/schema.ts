import { TemplateSchema } from '../../types/template';

export const schema: TemplateSchema = {
  id: 'wishframe',
  title: 'Buddy',
  category: 'Cinematic',
  description: 'A cinematic interactive gift focusing on true friendship and cherished memories. Perfect for your closest buddy.',
  previewImage: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500&q=80',
  fields: [
    {
      key: 'name',
      label: 'Recipient Name',
      type: 'text',
      description: 'The person this experience is for.',
      section: 'Identity'
    },
    {
      key: 'occasion',
      label: 'Occasion',
      type: 'text',
      description: 'e.g., "a birthday surprise", "our anniversary"',
      section: 'Identity'
    },
    {
      key: 'friendshipYears',
      label: 'Years of Relationship',
      type: 'text',
      description: 'How many years you have known each other.',
      section: 'Identity'
    },
    {
      key: 'stat1Value',
      label: 'Stat 1 Value (Days)',
      type: 'text',
      description: 'e.g., "1095" (Leave empty to auto-calculate)',
      section: 'Identity'
    },
    {
      key: 'stat1Label',
      label: 'Stat 1 Label (Days)',
      type: 'text',
      description: 'e.g., "Days of friendship"',
      section: 'Identity'
    },
    {
      key: 'stat2Value',
      label: 'Stat 2 Value (Years)',
      type: 'text',
      description: 'e.g., "3" (Leave empty to use Years of Relationship)',
      section: 'Identity'
    },
    {
      key: 'stat2Label',
      label: 'Stat 2 Label (Years)',
      type: 'text',
      description: 'e.g., "Years together"',
      section: 'Identity'
    },
    {
      key: 'stat3Value',
      label: 'Stat 3 Value (Memories)',
      type: 'text',
      description: 'e.g., "47", "Infinity", "∞"',
      section: 'Identity'
    },
    {
      key: 'stat3Label',
      label: 'Stat 3 Label (Memories)',
      type: 'text',
      description: 'e.g., "Memories made"',
      section: 'Identity'
    },
    {
      key: 'stat4Value',
      label: 'Stat 4 Value',
      type: 'text',
      description: 'e.g., "100"',
      section: 'Identity'
    },
    {
      key: 'stat4Label',
      label: 'Stat 4 Label',
      type: 'text',
      description: 'e.g., "Real, always"',
      section: 'Identity'
    },
    {
      key: 'preloaderSubtext',
      label: 'Opening Subtext',
      type: 'text',
      description: 'Text shown during initial load',
      section: 'Narrative'
    },
    {
      key: 'memoriesTitle',
      label: 'Memories Section Title',
      type: 'textarea',
      description: 'e.g., "The chapters that \\n made us"',
      section: 'Narrative'
    },
    {
      key: 'memories',
      label: 'Shared Memories',
      type: 'memoryList',
      description: 'The story chapters of your relationship.',
      section: 'Narrative'
    },
    {
      key: 'galleryTitle',
      label: 'Gallery Section Title',
      type: 'textarea',
      description: 'e.g., "Moments that \\n live forever"',
      section: 'Narrative'
    },
    {
      key: 'gallery',
      label: 'Photo Gallery',
      type: 'memoryList',
      description: 'A dedicated gallery of your best photos.',
      section: 'Narrative'
    },
    {
      key: 'videoTitle',
      label: 'Video Section Title',
      type: 'textarea',
      description: 'e.g., "Some things are better \\n seen than said"',
      section: 'Narrative'
    },
    {
      key: 'videoId',
      label: 'YouTube Video ID or URL',
      type: 'text',
      description: 'The ID (after ?v=) or the full YouTube link.',
      section: 'Atmosphere'
    },
    {
      key: 'buildupText',
      label: 'Emotional Buildup Text',
      type: 'textarea',
      description: 'e.g., "Every late night, \\n every inside joke..."',
      section: 'Narrative'
    },
    {
      key: 'cakeTitle',
      label: 'Cake Section Title',
      type: 'text',
      description: 'e.g., "Make a wish"',
      section: 'Narrative'
    },
    {
      key: 'letterContent',
      label: 'Secret Letter Content',
      type: 'textarea',
      description: 'The heartfelt letter hidden in the envelope.',
      section: 'Narrative'
    },
    {
      key: 'finalMessage',
      label: 'Final Reveal Message',
      type: 'textarea',
      description: 'The closing emotional statement.',
      section: 'Narrative'
    }
  ]
};
