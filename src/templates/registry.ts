/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TemplateModule } from '../types/template';
import { schema as memoryBloomSchema } from './memory-bloom/schema';
import { defaults as memoryBloomDefaults } from './memory-bloom/defaults';
import { schema as wishframeSchema } from './wishframe/schema';
import { defaults as wishframeDefaults } from './wishframe/defaults';
import { schema as luxuryWishSchema } from './luxury-wish/schema';
import { defaults as luxuryWishDefaults } from './luxury-wish/defaults';

/**
 * Tethryn Template Registry
 * Add your new template here.
 */
export const templateRegistry: Record<string, TemplateModule> = {
  'memory-bloom': {
    component: React.lazy(() => import('./memory-bloom/component.tsx')),
    schema: memoryBloomSchema,
    defaults: memoryBloomDefaults
  },
  'wishframe': {
    component: React.lazy(() => import('./wishframe/component.tsx')),
    schema: wishframeSchema,
    defaults: wishframeDefaults
  },
  'luxury-wish': {
    component: React.lazy(() => import('./luxury-wish/component.tsx')),
    schema: luxuryWishSchema,
    defaults: luxuryWishDefaults
  }
};

export const getAllTemplates = () => Object.values(templateRegistry);
export const getTemplateById = (id: string) => templateRegistry[id];
