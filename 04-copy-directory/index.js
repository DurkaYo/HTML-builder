const path = require('path');
const fs = require('fs');

const folderName = 'files';
const newFolderName = 'files-copy';

const folderPath = path.join(__dirname, folderName);
const newFolderPath = path.join(__dirname, newFolderName);

const originalFolder = fs.promises.readdir(folderPath);

originalFolder
    .then((files) => {
        fs.stat(newFolderPath, (error) => {
            if (error && error.code === 'ENOENT') {
                const createFolder = fs.promises.mkdir(newFolderPath);
                createFolder
                    .then(() => {
                        for (let file of files) {
                            fs.copyFile(path.join(folderPath, file), path.join(newFolderPath, file), (error) =>{
                                if (error) throw error;
                            })
                        }
                    })
                    .catch((error) => {
                        if (error) throw error;
                    })
            } else {
                const removeFolder = fs.promises.rm(newFolderPath, {recursive: true, force: true});
                removeFolder
                    .then(() => {
                        const createFolder = fs.promises.mkdir(newFolderPath);
                        createFolder
                            .then(() => {
                                for (let file of files) {
                                    fs.copyFile(path.join(folderPath, file), path.join(newFolderPath, file), (error) =>{
                                        if (error) throw error;
                                    })
                                }
                            })
                            .catch((error) => {
                                if (error) throw error;
                            })
                    })
                    .catch((error) => {
                        if (error) throw error;
                    })
            }
        })
    })
    .catch((error) => {
        if (error) throw error;
    });
