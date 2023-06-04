const path = require('path');
const fs = require('fs').promises;
const UglifyJS = require('uglify-js');

const SRC_DIRECTORY_PATH = './src';
const OUTPUT_DIRECTORY_PATH = './min';

const minifyFile = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const result = UglifyJS.minify(data, {
          mangle: true,
          toplevel: true,
          compress: {
            sequences: true,
            dead_code: true,
            conditionals: true,
            booleans: true,
            unused: true,
            if_return: true,
            join_vars: true,
            drop_console: true
          },
          output: {
            beautify: false
          },
        });
        if (result.error) throw new Error(`Failed to minify file: ${filePath}`);
        
        const fileName = path.basename(filePath);
        const newFilePath = path.join(OUTPUT_DIRECTORY_PATH, fileName.replace('.js', '.min.js'));
        await fs.writeFile(newFilePath, result.code);
        console.log(`File successfully minified: ${newFilePath}`);
    } catch (err) {
        console.error(err);
    }
}

const minifyDirectory = async (dirPath) => {
    try {
        const files = await fs.readdir(dirPath);
        const jsFiles = files.filter(file => path.extname(file) === '.js');

        try {
            await fs.access(OUTPUT_DIRECTORY_PATH);
        } catch (err) {
            await fs.mkdir(OUTPUT_DIRECTORY_PATH);
        }

        jsFiles.forEach(file => minifyFile(path.join(dirPath, file)));
    } catch (err) {
        console.error(err);
    }
}

minifyDirectory(SRC_DIRECTORY_PATH);