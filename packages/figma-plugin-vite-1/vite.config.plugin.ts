import { defineConfig, mergeConfig } from 'vite';
import generateFile from 'vite-plugin-generate-file';
import { viteSingleFile } from 'vite-plugin-singlefile';

import { createPluginConfig } from '../../vite.config.base';
import figmaManifest from './figma.manifest';

export default defineConfig(({ mode }) => 
  mergeConfig(
    createPluginConfig(process.cwd(), mode),
    {
      plugins: [
        viteSingleFile(),
        generateFile({
          type: 'json',
          output: './manifest.json',
          data: figmaManifest,
        }),
      ],
    }
  )
);
