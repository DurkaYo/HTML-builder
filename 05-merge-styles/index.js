const path = require('path');
const fs = require('fs');

const stylesFolder = path.join(__dirname, 'styles');
const bundleFolder = path.join(__dirname, 'project-dist');
const bundleStyleName = 'bundle.css';

const stylesFiles = fs.promises.readdir(stylesFolder);

const readStylesArray = [];

stylesFiles
    .then((files) => {
        for (let file of files) {
            const ext = path.extname(file);
            if (ext === '.css') {
                const readStyle = fs.promises.readFile(path.join(stylesFolder, file), 'utf-8');
                readStyle
                    .then((styles) => {
                        readStylesArray.push(styles);
                    })
                    .then(() => {
                        // Просто создается пустой файл
                        fs.writeFile(path.join(bundleFolder, bundleStyleName), '', (error) => {
                            if (error) throw error;
                        })
                        for(let style of readStylesArray) {
                            fs.appendFile(path.join(bundleFolder, bundleStyleName), style, (error) =>{
                                if (error) throw error;
                            })
                        }
                    })
                    .catch((error) => {
                        if (error) throw error
                    })
            }
        }
    })
    .catch((error) => {
        if (error) throw error
    })
