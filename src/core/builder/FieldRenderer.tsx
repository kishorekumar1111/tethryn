import React from 'react';
import { TemplateField } from '../../types/template';
import { ImageIcon, Type, Video, Music, Calendar, Palette, List, TextQuote, Plus, Trash2, FileIcon } from 'lucide-react';
import { FileUploader } from './FileUploader';

interface FieldRendererProps {
  field: TemplateField;
  value: any;
  onChange: (value: any) => void;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({ field, value, onChange }) => {
  const inputClasses = "w-full h-16 px-6 bg-white border border-tethryn-border text-[14px] font-sans outline-none focus:border-tethryn-accent focus:ring-4 focus:ring-tethryn-accent/5 transition-all duration-500 placeholder:text-tethryn-muted/40 text-tethryn-ink rounded-xl shadow-sm";

  const label = (
    <label className="block">
       <div className="flex items-center space-x-3 text-tethryn-ink mb-1">
         {getFieldIcon(field.type)}
         <span className="font-bold text-[12px] uppercase tracking-[0.4em]">{field.label}</span>
       </div>
       {field.description && (
         <span className="text-[11px] text-tethryn-muted/60 font-serif italic mb-2 block">{field.description}</span>
       )}
    </label>
  );

  switch (field.type) {
    case 'image':
      return (
        <div className="space-y-4">
          {label}
          <div className="flex flex-col space-y-4">
            <input
              className={inputClasses}
              type="text"
              placeholder={field.placeholder || "Paste image URL"}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
            />
            <FileUploader 
              onUploadSuccess={(url) => onChange(url)} 
              path="images" 
              label="UPLOAD FROM DEVICE" 
            />
          </div>
          {value && (
            <div className="relative aspect-video w-full rounded-2xl bg-tethryn-bg overflow-hidden border border-tethryn-border group shadow-premium">
               <img src={value} alt="Preview" className="w-full h-full object-cover transition-all duration-700" />
               <button 
                 onClick={() => onChange('')}
                 className="absolute top-4 right-4 p-2.5 bg-white shadow-xl text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
               >
                 <Trash2 size={16} />
               </button>
            </div>
          )}
        </div>
      );
    case 'imageArray':
      const items = Array.isArray(value) ? value : [];
      return (
        <div className="space-y-4">
          {label}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-xl bg-tethryn-bg border border-tethryn-border overflow-hidden group/item shadow-sm">
                <img src={img} className="w-full h-full object-cover transition-all" />
                <button 
                  onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                  className="absolute inset-0 bg-red-500/20 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all"
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transform translate-y-2 group-hover/item:translate-y-0 transition-all">
                    <Trash2 size={18} className="text-red-500" />
                  </div>
                </button>
              </div>
            ))}
            <div className="aspect-square">
              <FileUploader 
                onUploadSuccess={(url) => onChange([...items, url])}
                path="gallery"
                label="ADD"
              />
            </div>
          </div>
        </div>
      );
    case 'textarea':
      return (
        <div className="space-y-3">
          {label}
          <textarea
            className={`${inputClasses} h-40 py-5 resize-none leading-relaxed`}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
    case 'select':
      return (
        <div className="space-y-3">
          {label}
          <select
            className={inputClasses}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          >
            {field.options?.map(opt => <option key={opt} value={opt} className="bg-white text-tethryn-ink">{opt}</option>)}
          </select>
        </div>
      );
    case 'color':
      return (
        <div className="space-y-3">
          {label}
          <div className="flex items-center space-x-6 p-5 bg-white border border-tethryn-border rounded-xl shadow-sm">
            <input
              type="color"
              className="w-10 h-10 bg-transparent border-none cursor-pointer rounded-lg"
              value={value || '#000000'}
              onChange={(e) => onChange(e.target.value)}
            />
            <span className="text-[12px] font-mono text-tethryn-muted tracking-widest">{value || '#000000'}</span>
          </div>
        </div>
      );
    case 'datetime':
        return (
          <div className="space-y-3">
            {label}
            <input
              className={inputClasses}
              type="date"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        );
    case 'audio':
      return (
        <div className="space-y-4">
          {label}
          <div className="flex flex-col space-y-4">
            <input
              className={inputClasses}
              type="text"
              placeholder={field.placeholder || "Audio Stream URL"}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
            />
            <FileUploader 
              onUploadSuccess={(url) => onChange(url)} 
              path="audio" 
              accept="audio/*"
              label="IMPORT AUDIO"
            />
          </div>
          {value && (
            <div className="p-6 bg-tethryn-secondary border border-tethryn-border rounded-xl shadow-sm">
               <audio src={value} controls className="w-full h-10" />
            </div>
          )}
        </div>
      );
    case 'video':
      return (
        <div className="space-y-4">
          {label}
          <div className="flex flex-col space-y-4">
            <input
              className={inputClasses}
              type="text"
              placeholder={field.placeholder || "Video Source URL"}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
            />
            <FileUploader 
              onUploadSuccess={(url) => onChange(url)} 
              path="videos" 
              accept="video/*"
              label="IMPORT VIDEO"
            />
          </div>
          {value && (
            <div className="relative aspect-video w-full bg-tethryn-secondary border border-tethryn-border rounded-xl overflow-hidden shadow-sm">
               <video src={value} controls className="w-full h-full" />
            </div>
          )}
        </div>
      );
    case 'file':
      return (
        <div className="space-y-4">
          {label}
          <div className="flex flex-col space-y-4">
            <input
              className={inputClasses}
              type="text"
              placeholder={field.placeholder || "File URL"}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
            />
            <FileUploader 
              onUploadSuccess={(url) => onChange(url)} 
              path="files" 
              accept="*"
              label="UPLOAD FILE"
            />
          </div>
          {value && (
            <div className="p-5 bg-white border border-tethryn-border rounded-xl flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-3">
                <FileIcon size={16} className="text-tethryn-accent" />
                <span className="text-[12px] font-sans text-tethryn-muted truncate max-w-[200px]">{value}</span>
              </div>
              <a 
                href={value} 
                target="_blank" 
                rel="noreferrer"
                className="text-[10px] font-bold uppercase tracking-widest text-tethryn-accent border border-tethryn-accent/20 px-3 py-1.5 rounded-lg hover:bg-tethryn-accent/10 transition-all"
              >
                View
              </a>
            </div>
          )}
        </div>
      );
    case 'memoryList':
      const memories = Array.isArray(value) ? value : [];
      return (
        <div className="space-y-6">
          {label}
          <div className="space-y-6">
            {memories.map((memory, i) => {
              const isWishframe = memory.text !== undefined || memory.year !== undefined;
              return (
              <div key={i} className="p-8 bg-white border border-tethryn-border rounded-2xl space-y-8 relative group/mem shadow-sm">
                <button 
                  onClick={() => onChange(memories.filter((_, idx) => idx !== i))}
                  className="absolute top-4 right-4 p-2.5 text-tethryn-muted hover:text-red-500 hover:bg-red-50 transition-all rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-tethryn-accent" />
                  <span className="text-[10px] font-bold tracking-[0.2em] text-tethryn-muted uppercase">Memory Fragment {i + 1}</span>
                </div>
                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase tracking-widest text-tethryn-muted font-bold">Visual Selection</span>
                    <div className="flex flex-col space-y-4">
                      <input
                        className={inputClasses}
                        type="text"
                        placeholder="Image URL"
                        value={memory.image || ''}
                        onChange={(e) => {
                          const newMemories = [...memories];
                          newMemories[i] = { ...memory, image: e.target.value };
                          onChange(newMemories);
                        }}
                      />
                      <FileUploader 
                        onUploadSuccess={(url) => {
                          const newMemories = [...memories];
                          newMemories[i] = { ...memory, image: url };
                          onChange(newMemories);
                        }}
                        path="memories"
                        label="CHOOSE FROM DEVICE"
                      />
                    </div>
                  </div>
                  
                  {isWishframe ? (
                    <>
                      <div className="space-y-3">
                        <span className="text-[10px] uppercase tracking-widest text-tethryn-muted font-bold">Title / Text</span>
                        <input
                          className={inputClasses}
                          type="text"
                          placeholder="Main text..."
                          value={memory.text || ''}
                          onChange={(e) => {
                            const newMemories = [...memories];
                            newMemories[i] = { ...memory, text: e.target.value };
                            onChange(newMemories);
                          }}
                        />
                      </div>
                      <div className="space-y-3">
                        <span className="text-[10px] uppercase tracking-widest text-tethryn-muted font-bold">Subtext</span>
                        <input
                          className={inputClasses}
                          type="text"
                          placeholder="Subtext..."
                          value={memory.subtext || ''}
                          onChange={(e) => {
                            const newMemories = [...memories];
                            newMemories[i] = { ...memory, subtext: e.target.value };
                            onChange(newMemories);
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <span className="text-[10px] uppercase tracking-widest text-tethryn-muted font-bold">Tag</span>
                          <input
                            className={inputClasses}
                            type="text"
                            placeholder="e.g. Adventure"
                            value={memory.tag || ''}
                            onChange={(e) => {
                              const newMemories = [...memories];
                              newMemories[i] = { ...memory, tag: e.target.value };
                              onChange(newMemories);
                            }}
                          />
                        </div>
                        <div className="space-y-3">
                          <span className="text-[10px] uppercase tracking-widest text-tethryn-muted font-bold">Year</span>
                          <input
                            className={inputClasses}
                            type="text"
                            placeholder="e.g. 2024"
                            value={memory.year || ''}
                            onChange={(e) => {
                              const newMemories = [...memories];
                              newMemories[i] = { ...memory, year: e.target.value };
                              onChange(newMemories);
                            }}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-3">
                        <span className="text-[10px] uppercase tracking-widest text-tethryn-muted font-bold">Caption</span>
                        <input
                          className={inputClasses}
                          type="text"
                          placeholder="A short note..."
                          value={memory.caption || ''}
                          onChange={(e) => {
                            const newMemories = [...memories];
                            newMemories[i] = { ...memory, caption: e.target.value };
                            onChange(newMemories);
                          }}
                        />
                      </div>
                      <div className="space-y-3">
                        <span className="text-[10px] uppercase tracking-widest text-tethryn-muted font-bold">Date / Context</span>
                        <input
                          className={inputClasses}
                          type="text"
                          placeholder="e.g. Summer 2024"
                          value={memory.date || ''}
                          onChange={(e) => {
                            const newMemories = [...memories];
                            newMemories[i] = { ...memory, date: e.target.value };
                            onChange(newMemories);
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )})}
            <button 
              onClick={() => {
                const newItem = memories.length > 0 && ('text' in memories[0] || 'year' in memories[0]) 
                  ? { image: '', text: '', subtext: '', tag: '', year: '' }
                  : { image: '', caption: '', date: '' };
                onChange([...memories, newItem]);
              }}
              className="w-full py-8 border-2 border-dashed border-tethryn-border hover:border-tethryn-accent hover:bg-tethryn-accent/5 rounded-2xl transition-all text-tethryn-muted hover:text-tethryn-accent flex flex-col items-center justify-center space-y-3 group"
            >
              <div className="p-3 bg-tethryn-secondary rounded-full group-hover:scale-110 transition-transform">
                <Plus size={20} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Add Memory Fragment</span>
            </button>
          </div>
        </div>
      );
    case 'traitList':
      const traits = Array.isArray(value) ? value : [];
      return (
        <div className="space-y-6">
          {label}
          <div className="space-y-6">
            {traits.map((trait, i) => (
              <div key={i} className="p-8 bg-white border border-tethryn-border rounded-2xl space-y-8 relative group/mem shadow-sm">
                <button 
                  onClick={() => onChange(traits.filter((_, idx) => idx !== i))}
                  className="absolute top-4 right-4 p-2.5 text-tethryn-muted hover:text-red-500 hover:bg-red-50 transition-all rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-tethryn-accent" />
                  <span className="text-[10px] font-bold tracking-[0.2em] text-tethryn-muted uppercase">Trait {i + 1}</span>
                </div>
                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase tracking-widest text-tethryn-muted font-bold">Title</span>
                    <input
                      className={inputClasses}
                      type="text"
                      placeholder="e.g. Radiance"
                      value={trait.title || ''}
                      onChange={(e) => {
                        const newTraits = [...traits];
                        newTraits[i] = { ...trait, title: e.target.value };
                        onChange(newTraits);
                      }}
                    />
                  </div>
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase tracking-widest text-tethryn-muted font-bold">Description</span>
                    <textarea
                      className={`${inputClasses} h-24 py-5 resize-none leading-relaxed`}
                      placeholder="A short note..."
                      value={trait.description || ''}
                      onChange={(e) => {
                        const newTraits = [...traits];
                        newTraits[i] = { ...trait, description: e.target.value };
                        onChange(newTraits);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button 
              onClick={() => {
                onChange([...traits, { title: '', description: '' }]);
              }}
              className="w-full py-8 border-2 border-dashed border-tethryn-border hover:border-tethryn-accent hover:bg-tethryn-accent/5 rounded-2xl transition-all text-tethryn-muted hover:text-tethryn-accent flex flex-col items-center justify-center space-y-3 group"
            >
              <div className="p-3 bg-tethryn-secondary rounded-full group-hover:scale-110 transition-transform">
                <Plus size={20} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Add Trait</span>
            </button>
          </div>
        </div>
      );
    case 'boolean':
      return (
        <div className="space-y-3">
          {label}
          <div className="flex items-center space-x-3">
            <button
               type="button"
               onClick={() => onChange(!value)}
               className={`w-12 h-6 rounded-full p-1 transition-colors ${value ? 'bg-tethryn-accent' : 'bg-neutral-200'}`}
            >
               <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${value ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className="text-[12px] font-sans text-tethryn-ink">{value ? 'Enabled' : 'Disabled'}</span>
          </div>
        </div>
      );
    case 'number':
      return (
        <div className="space-y-2">
          {label}
          <input
            className={inputClasses}
            type="number"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value))}
          />
        </div>
      );
    default:
      return (
        <div className="space-y-2">
          {label}
          <input
            className={inputClasses}
            type="text"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
  }
};

function getFieldIcon(type: string) {
  const props = { size: 14, className: "text-tethryn-accent" };
  switch (type) {
    case 'text': return <Type {...props} />;
    case 'textarea': return <TextQuote {...props} />;
    case 'image': return <ImageIcon {...props} />;
    case 'video': return <Video {...props} />;
    case 'audio': return <Music {...props} />;
    case 'datetime': return <Calendar {...props} />;
    case 'color': return <Palette {...props} />;
    case 'select': return <List {...props} />;
    case 'file': return <FileIcon {...props} />;
    default: return <Sparkles {...props} />;
  }
}

function Sparkles(props: any) {
    return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={props.size || 24}
          height={props.size || 24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={props.className}
        >
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          <path d="m5 3 1 1" />
          <path d="m19 19 1 1" />
          <path d="m5 21 1-1" />
          <path d="m19 3 1 1" />
        </svg>
      );
}
