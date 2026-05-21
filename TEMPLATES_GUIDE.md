# Integrating Your Code as a Tethryn Template

To turn your external web code into a scalable, editable template within Tethryn:

## 1. Folder Structure
Create a new directory: `src/templates/your-id/`
Files needed:
- `schema.ts`: Defines the editable fields.
- `component.tsx`: The actual React component that renders the code.
- `preview.png`: (Optional) Representative image for the gallery.

## 2. Define the Schema (`schema.ts`)
Map your code's variables to Tethryn fields.
```typescript
import { TemplateSchema } from '../../types/template';

export const schema: TemplateSchema = {
  id: 'your-template-id',
  title: 'My Custom Template',
  category: 'Cinematic', // Romantic, Cinematic, Minimal
  description: 'Your external code integrated.',
  previewImage: 'URL_TO_PREVIEW',
  fields: [
    { key: 'heroTitle', label: 'Main Headline', type: 'text', defaultValue: 'Hello' },
    { key: 'storyContent', label: 'The Narrative', type: 'textarea' },
    { key: 'primaryColor', label: 'Accent Color', type: 'color', defaultValue: '#ff0000' }
  ]
};
```

## 3. Build the Component (`component.tsx`)
Wrap your HTML in a React component. Access user data via `data.content`.

```tsx
import { motion } from 'motion/react';
import { TethrynExperience } from '../../types/tethryn';

interface Props {
  data: Partial<TethrynExperience>;
  isUnwrapped: boolean;
  onUnwrap: () => void;
}

export const MyTemplate = ({ data, isUnwrapped, onUnwrap }: Props) => {
  const { content } = data;
  
  if (!isUnwrapped) {
    return <button onClick={onUnwrap}>Unlock Experience</button>;
  }

  return (
    <div style={{ color: content?.primaryColor }}>
       <h1>{content?.heroTitle}</h1>
       <p>{content?.storyContent}</p>
    </div>
  );
};
```

## 4. Register
In `src/templates/registry.ts`, import your template and add it to the `templateRegistry` object.

```typescript
import { MyTemplate } from './your-id/component';
import { schema as mySchema } from './your-id/schema';

// ... inside templateRegistry ...
'your-template-id': {
  component: MyTemplate as any,
  schema: mySchema,
  defaults: Object.fromEntries(mySchema.fields.map(f => [f.key, f.defaultValue || '']))
}
```

## 5. Deployment
Once registered, the template will automatically appear in the **Gallery** and the **Studio (Builder)**.
