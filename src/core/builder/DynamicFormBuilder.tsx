import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TemplateSchema } from '../../types/template';
import { FieldRenderer } from './FieldRenderer';
import { Sparkles } from 'lucide-react';

interface DynamicFormBuilderProps {
  schema: TemplateSchema;
  formData: Record<string, any>;
  onUpdate: (key: string, value: any) => void;
  onAIRefine?: (key: string) => void;
  isRefining?: boolean;
}

export const DynamicFormBuilder: React.FC<DynamicFormBuilderProps> = ({ 
  schema, 
  formData, 
  onUpdate, 
  onAIRefine,
  isRefining 
}) => {
  const fieldsBySection = schema.fields.reduce((acc, field) => {
    const section = field.section || 'General';
    if (!acc[section]) acc[section] = [];
    acc[section].push(field);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-12 pb-32">
      <AnimatePresence mode="wait">
        <motion.div
           key={schema.id}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.4 }}
           className="space-y-16"
        >
           {(Object.entries(fieldsBySection) as [string, any[]][]).map(([section, fields]) => (
             <div key={section} className="space-y-8">
               <div className="flex items-center space-x-6">
                 <h3 className="text-[12px] font-bold uppercase tracking-[0.6em] text-tethryn-accent">{section}</h3>
                 <div className="flex-1 h-px bg-tethryn-border/40" />
               </div>
               
               <div className="space-y-10">
                 {fields.map((field) => (
                   <div key={field.key} className="relative group">
                      <FieldRenderer 
                        field={field} 
                        value={formData[field.key]} 
                        onChange={(val) => onUpdate(field.key, val)} 
                      />
                      
                      {/* AI Support for specific fields */}
                      {onAIRefine && (
                        field.type === 'textarea' || 
                        field.key.includes('Text') || 
                        field.key.includes('Line') || 
                        field.key.includes('Message') ||
                        field.key.includes('Statement')
                      ) && (
                        <button
                          onClick={() => onAIRefine(field.key)}
                          disabled={isRefining}
                          className="absolute top-0 right-0 flex items-center space-x-2 px-4 py-2 bg-tethryn-accent text-[10px] font-bold uppercase tracking-widest text-white rounded-full hover:bg-tethryn-accent-hover transition-all shadow-xl shadow-tethryn-accent/10 border border-white/20"
                        >
                          <Sparkles size={11} className={isRefining ? 'animate-pulse' : ''} />
                          <span>AI POLISH</span>
                        </button>
                      )}
                   </div>
                 ))}
               </div>
             </div>
           ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
