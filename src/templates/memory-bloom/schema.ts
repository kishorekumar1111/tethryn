import { TemplateSchema } from '../../types/template';

export const schema: TemplateSchema = {
  id: 'memory-bloom',
  title: 'Memory Bloom',
  category: 'Romantic',
  description: 'A premium flagship animated template for high-end digital surprises.',
  previewImage: 'https://images.unsplash.com/photo-1490750967868-883c0760346c',
  fields: [
    {
      key: 'audioUrl',
      label: 'Background Audio',
      type: 'audio',
      description: 'The soundscape for your memory journey.',
      section: 'Atmosphere'
    },
    {
      key: 'introText',
      label: 'Intro Statement',
      type: 'text',
      description: 'The first line they see.',
      section: 'Atmosphere'
    },
    {
      key: 'accentColor',
      label: 'Aesthetic Accent',
      type: 'color',
      section: 'Atmosphere'
    },
    {
      key: 'memories',
      label: 'Memory Fragments',
      type: 'memoryList',
      description: 'The journey through your shared history.',
      section: 'Narrative'
    },
    {
      key: 'bloomTitle',
      label: 'Bloom Call-to-Action',
      type: 'text',
      description: 'Instruction for the user to interact.',
      section: 'Interactibles'
    },
    {
      key: 'bloomImage',
      label: 'Centerpiece Image',
      type: 'image',
      description: 'The image revealed at the heart of the bloom.',
      section: 'Interactibles'
    },
    {
      key: 'letterRecipient',
      label: 'Recipient Name',
      type: 'text',
      section: 'Letter'
    },
    {
      key: 'letterContent',
      label: 'Letter Content',
      type: 'textarea',
      section: 'Letter'
    },
    {
      key: 'bgVideoUrl',
      label: 'Atmospheric Video',
      type: 'video',
      description: 'A background visual layer.',
      section: 'Atmosphere'
    },
    {
      key: 'giftAttachment',
      label: 'Digital Gift Attachment',
      type: 'file',
      description: 'A downloadable memory for the recipient.',
      section: 'Finale'
    },
    {
      key: 'letterSender',
      label: 'Sender Name',
      type: 'text',
      section: 'Letter'
    },
    {
      key: 'revealText',
      label: 'Final Reveal Message',
      type: 'text',
      section: 'Finale'
    }
  ]
};
