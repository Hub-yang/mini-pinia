/// <reference types="vitest" />

import { ConfigEnv, UserConfigExport, loadEnv } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import svgLoader from 'vite-svg-loader'
import UnoCSS from 'unocss/vite'
import { ElementPlusResolver, VueUseComponentsResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import ElementPlus from 'unplugin-element-plus/vite'

export default (configEnv: ConfigEnv): UserConfigExport => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as ImportMetaEnv
  const { VITE_PUBLIC_PATH, VITE_APP_BASE_API, VITE_APP_REQUEST_API, VITE_APP_TRUE_API } = viteEnv
  return {
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    server: {
      https: false,
      host: true,
      port: 3333,
      open: true,
      cors: true,
      strictPort: false,
      proxy: {
        [VITE_APP_BASE_API]: {
          target: VITE_APP_REQUEST_API,
          ws: true,
          changeOrigin: true,
          rewrite: (pathStr: string) => pathStr.replace(VITE_APP_BASE_API, VITE_APP_TRUE_API)
        }
      }
    },
    build: {
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 2000,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log']
        },
        format: {
          comments: true
        }
      },
      assetsDir: 'static',
      // 静态资源打包到dist下的不同目录
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    plugins: [
      vue(),
      vueJsx(),
      svgLoader(),
      UnoCSS(),
      Components({
        dirs: ['./src/components'],
        dts: './src/types/components.d.ts',
        extensions: ['vue', 'md'],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [ElementPlusResolver(), VueUseComponentsResolver()]
      }),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/ // .md
        ],
        imports: [
          'vue',
          'pinia',
          'vue-router',
          '@vueuse/core',
          // example type import
          {
            from: 'vue-router',
            imports: ['RouteLocationRaw', 'RouteRecordRaw', 'Router'],
            type: true
          }
        ],
        dirs: ['./src/config/**', './src/store/**', './src/utils/**', './src/hooks/**', './src/api/**'],
        dts: './src/types/auto-imports.d.ts',
        resolvers: [ElementPlusResolver()],
        vueTemplate: true,
        eslintrc: {
          enabled: true, // Default `false`
          filepath: './src/types/.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        }
      }),
      ElementPlus({})
    ],
    // css配置
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
              @use "@/styles/variables.scss" as *;
            `,
          javascriptEnabled: true
        }
      },
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                // 去除elementPlus内部charset警告
                if (atRule.name === 'charset') {
                  atRule.remove()
                }
              }
            }
          }
        ]
      }
    },
    test: {
      include: ['test/**/*.test.ts'],
      environment: 'jsdom'
    }
  }
}
