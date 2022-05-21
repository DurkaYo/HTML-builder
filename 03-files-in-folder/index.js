const path = require('path');
const fs = require('fs');

const nameFolder = 'secret-folder'

const folderPath = path.join(__dirname, nameFolder);

files = fs.promises.readdir(folderPath)

files
    .then((filenames) => {
        for(let file of filenames) {
            const ext = path.extname(file).replace(/[\s.,%]/g, '');
            const name = path.basename(file).replace(/\.[^/.]+$/, '');
            const filePath = path.join(__dirname, nameFolder, file);

            let size = 0;

            fs.stat(filePath, (error, stats) => {
                if (!stats.isDirectory()) {
                    size = (stats.size / 1024).toFixed(2);

                    console.log(
                        `${name} | ${ext} | ${size}kb`
                    )
                }
            })
        }
    })
    .catch((error) => {
        console.log(error);
    })
