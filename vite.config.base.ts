import path from 'node:path';
import { defineConfig } from 'vite';

export const createBaseConfig = (packageDir: string) => defineConfig({
  resolve: {
    alias: {
      '@common': path.resolve(packageDir, 'src/common'),
      '@ui': path.resolve(packageDir, 'src/ui'),
      '@plugin': path.resolve(packageDir, 'src/plugin'),
    },
  },
  build: {
    emptyOutDir: false,
    outDir: path.resolve(packageDir, 'dist'),
  },
});

export const createUIConfig = (packageDir: string, mode: string) => {
  const baseConfig = createBaseConfig(packageDir);
  
  return defineConfig({
    ...baseConfig,
    root: path.resolve(packageDir, 'src/ui'),
    build: {
      ...baseConfig.build,
      minify: mode === 'production',
      cssMinify: mode === 'production',
      sourcemap: mode !== 'production' ? 'inline' : false,
      rollupOptions: {
        input: path.resolve(packageDir, 'src/ui/index.html'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  });
};

export const createPluginConfig = (packageDir: string, mode: string) => {
  const baseConfig = createBaseConfig(packageDir);
  
  return defineConfig({
    ...baseConfig,
    build: {
      ...baseConfig.build,
      minify: mode === 'production',
      sourcemap: mode !== 'production' ? 'inline' : false,
      target: 'es2017',
      rollupOptions: {
        input: path.resolve(packageDir, 'src/plugin/plugin.ts'),
        output: {
          entryFileNames: 'plugin.js',
        },
      },
    },
  });
};