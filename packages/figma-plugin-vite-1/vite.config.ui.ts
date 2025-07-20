import react from '@vitejs/plugin-react';
import postcssUrl from 'postcss-url';
import { defineConfig, mergeConfig } from 'vite';
import richSvg from 'vite-plugin-react-rich-svg';
import { viteSingleFile } from 'vite-plugin-singlefile';

import { createUIConfig } from '../../vite.config.base';

export default defineConfig(({ mode }) => 
  mergeConfig(
    createUIConfig(process.cwd(), mode),
    {
      plugins: [react(), richSvg(), viteSingleFile()],
      css: {
        postcss: {
          plugins: [postcssUrl({ url: 'inline' })],
        },
      },
    }
  )
);
