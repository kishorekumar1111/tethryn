export type TemplateCategory = 'Romantic' | 'Birthday' | 'Friendship' | 'Trendy' | 'Premium';

export type FieldType = 'text' | 'textarea' | 'image' | 'video' | 'audio' | 'datetime' | 'color' | 'select' | 'textArray' | 'imageArray';

export interface TemplateField {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  options?: string[]; // For select type
  defaultValue?: any;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  previewUrl: string;
  thumbnail: string;
  isExternal?: boolean;
  fields: TemplateField[];
}

export interface TethrynData {
  id?: string;
  templateId: string;
  slug: string; // shareable slug
  recipientName: string;
  senderName?: string;
  title: string;
  
  // The core content driven by the template schema
  content: Record<string, any>;
  
  isPublished: boolean;
  views: number;
  authorId?: string;
  createdAt?: any;
  updatedAt?: any;
  
  // Future proofing
  settings?: {
    customDomain?: string;
    isSearchable?: boolean;
    password?: string;
  };
}

// For backward compatibility while refactoring
export type TethraData = TethrynData;
