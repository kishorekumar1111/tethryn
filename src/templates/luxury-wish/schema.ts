import { TemplateSchema } from '../../types/template';

export const schema: TemplateSchema = {
  id: 'luxury-wish',
  title: 'Roses',
  category: 'Romance',
  description: 'A deeply romantic interactive experience. A beautiful lover present filled with cherished memories and your heartfelt words.',
  previewImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2940&auto=format&fit=crop',
  fields: [
    {
      key: 'recipientName',
      label: 'Recipient Name',
      type: 'text',
      section: 'Identity',
    },
    {
      key: 'nickname',
      label: 'Pet Name / Nickname',
      type: 'text',
      section: 'Identity',
      description: 'A cute or special name you call them.'
    },
    {
      key: 'introText',
      label: 'Intro Text',
      type: 'text',
      section: 'Identity',
    },
    {
      key: 'heroSubtitle',
      label: 'Hero Subtitle',
      type: 'text',
      section: 'Identity',
      description: 'A short romantic sentence right under their name.'
    },
    {
      key: 'relationshipAnniversary',
      label: 'Special Date',
      type: 'text',
      section: 'Identity',
      description: 'E.g., Your anniversary date.'
    },
    {
      key: 'memories',
      label: 'Cherished Memories',
      type: 'memoryList',
      section: 'Narrative',
      description: 'Our top romantic moments represented by images and captions.'
    },
    {
      key: 'traits',
      label: 'Things I Love About You',
      type: 'traitList',
      section: 'Narrative',
    },
    {
      key: 'backgroundAudio',
      label: 'Background Audio URL',
      type: 'text',
      section: 'Settings',
      description: 'An MP3 URL for romantic background music.'
    },
    {
      key: 'petalsEnabled',
      label: 'Enable Falling Petals',
      type: 'boolean',
      section: 'Settings',
      description: 'Show floating rose petals across the screen.'
    },
    {
      key: 'letterTitle',
      label: 'Letter Title',
      type: 'text',
      section: 'Narrative',
    },
    {
      key: 'letterContent',
      label: 'Main Love Letter',
      type: 'textarea',
      section: 'Narrative',
    },
    {
      key: 'finalMessage',
      label: 'Final Message',
      type: 'text',
      section: 'Finale',
    },
    {
      key: 'signature',
      label: 'Your Signature',
      type: 'text',
      section: 'Finale',
    }
  ]
};
