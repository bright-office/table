import autoprefixer from 'autoprefixer';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFile, readFileSync, writeFile } from 'fs';

const prependUseClient = () => {
  return {
    name: 'prepend-use-client',
    renderChunk(code) {
      return {
        code: `'use client'; \n${code}`,
        map: null
      };
    }
  };
};

// TODO: Some how mark all the dependencies as external to make the bundle smaller
// and make sure they get auto installed with all the package managers

// NOTE: due to some reason vite is not adding the import statement for transpiled css file
// that is why this function(plugin) exists. 
// This is not a good way, but it works and it's fine for now.
//  REMAINDER: Refactor
const importDefaultCss = () => {
    return {
        name: "import-default-css",
        closeBundle() {
            const importStatement = 'import "../style.css";\n';
            const fileToAppend = './dist/src/Table.js';

            readFile(resolve(__dirname, fileToAppend), "utf8" ,(err, data) => {
                if(err) {
                    console.error("No css will be imported. Import it yourself");
                    console.log(err)
                    return;
                }

                const lines = data.split("\n");
                const fileDataWithImport = [lines[0], importStatement, ...lines.slice(1)].join("\n");

                writeFile(resolve(__dirname, fileToAppend), fileDataWithImport, "utf8", (err) => {
                    if(err) {
                        console.log("No css will be imported. Import it yourself");
                        return;
                    }
                })
            });
        }
    }
}


/** @type {import('vite').UserConfig} */
export default defineConfig({
  // css and less compilation
  css: {
    preprocessorOptions: {
      less: {
        sourceMap: true,
        math: 'always',
        relativeUrls: true,
        javascriptEnabled: true
      },
    },
    postcss: {
      plugins: [autoprefixer()]
    }
  },
  build: {
    minify:false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@brightsoftware/table',
      formats: ['es']
    },

    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        preserveModules: true,
        entryFileNames: '[name].js',
        dir: 'dist',
        exports: 'named',
      }
    },
  },

  plugins: [prependUseClient(), importDefaultCss()]
});
