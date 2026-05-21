import { ComponentType } from 'react';

export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'image' 
  | 'imageArray' 
  | 'video' 
  | 'audio' 
  | 'datetime' 
  | 'color' 
  | 'select'
  | 'boolean'
  | 'file'
  | 'memoryList'
  | 'traitList';

export interface TemplateField {
  key: string;
  label: string;
  type: FieldType;
  section?: string;
  placeholder?: string;
  description?: string;
  options?: string[]; // For select type
  defaultValue?: any;
}

export interface TemplateSchema {
  id: string;
  title: string;
  category: string;
  description: string;
  previewImage: string;
  fields: TemplateField[];
}

export interface TemplateModule {
  component: ComponentType<any>;
  schema: TemplateSchema;
  defaults: Record<string, any>;
}
