import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './studio/schemas';

export default defineConfig({
  name: 'my-portfolio',
  title: 'My Portfolio',
  projectId: 'zrdvidgx',
  dataset: 'production',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
