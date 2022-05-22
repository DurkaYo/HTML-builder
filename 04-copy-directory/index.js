const path = require('path');
const fs = require('fs');

const folderName = 'files';
const newFolderName = 'files-copy';

const folderPath = path.join(__dirname, folderName);
const newFolderPath = path.join(__dirname, newFolderName);

const originalFolder = fs.promises.readdir(folderPath);

/**
 * Создание папки и копирывание туда файлов
 * @param {string[]} files - массв имен файлов
 */
const createAndCopy = (files) => {
  const createFolder = fs.promises.mkdir(newFolderPath);
  createFolder
    .then(() => {
      for (let file of files) {
        fs.copyFile(path.join(folderPath, file), path.join(newFolderPath, file), (error) =>{
          if (error) throw error;
        });
      }
    })
    .catch((error) => {
      if (error) throw error;
    });
};

originalFolder
  .then((files) => {
    fs.stat(newFolderPath, (error) => {
      if (error && error.code === 'ENOENT') {
        createAndCopy(files);
      } else {
        const removeFolder = fs.promises.rm(newFolderPath, {recursive: true, force: true});
        removeFolder
          .then(() => {
            createAndCopy(files);
          })
          .catch((error) => {
            if (error) throw error;
          });
      }
    });
  })
  .catch((error) => {
    if (error) throw error;
  });
