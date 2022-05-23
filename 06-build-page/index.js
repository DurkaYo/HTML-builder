const path = require('path');
const fs = require('fs');

/*
* Тут появятся комментарии, поскольку это задание сложнее предыдущих
*/

const dist = 'project-dist';

const templateFile = path.join(__dirname, 'template.html');
const componentFolder = path.join(__dirname, 'components');
const stylesFolder = path.join(__dirname, 'styles');
const assetsFolder = path.join(__dirname, 'assets');
const distFolder = path.join(__dirname, dist);

/**
 * Копирываие файлов вотри папок в assets
 * @param {string} folder
 */
const copyInnerFile = (folder) => {
  const assetInner = fs.promises.readdir(path.join(assetsFolder, folder));
  assetInner
    .then(files => {
      for (let file of files){
        fs.copyFile(path.join(assetsFolder, folder, file), path.join(path.join(distFolder, 'assets', folder), file), (error) =>{
          if (error) throw error;
        });
      }
    })
    .catch((error) =>  {
      if (error) throw error;
    });
};

/**
 * Чтеие исходной папкки assets
 */
const assetOriginalRead = () => {
  const assets = fs.promises.readdir(assetsFolder);
  assets
    .then((folders) => {
      for (let folder of folders) {
        fs.stat(path.join(assetsFolder, folder), (error, stat) => {
          if (error) {
            throw error;
          } else {
            if (stat.isDirectory()) {
              fs.mkdir(path.join(distFolder, 'assets', folder), (error) => {
                if (error) {
                  throw error;
                } else {
                  copyInnerFile(folder);
                }
              });
            }
          }
        });
      }
    })
    .catch((error) => {
      if (error) throw error;
    });
};

/**
 * Копирываие папки assets
 */
const copyAssets = () => {
  const makeAssets = fs.promises.mkdir(path.join(distFolder, 'assets'));

  makeAssets
    .then(()=>{
      assetOriginalRead();
    })
    .catch((error) => {
      if (error) throw error;
    });
};

/**
 * Компиляция всех стилей в один бандл
 */
const mergeStyles = ()  => {
  const readStylesArray = [];
  const stylesFiles = fs.promises.readdir(stylesFolder);
  fs.writeFile(path.join(distFolder, 'style.css'), '', (error) => {
    if (error) throw error;
  });
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
              for(let style of readStylesArray) {
                fs.appendFile(path.join(distFolder, 'style.css'), style, (error) =>{
                  if (error) throw error;
                });
              }
            })
            .catch((error) => {
              if (error) throw error;
            });
        }
      }
    })
    .catch((error) => {
      if (error) throw error;
    });
};

/**
 * запись готового шаблона
 * @param {string} template
 * @param {string[]} files
 */
const htmlBundle  = (template, files) => {
  let out = template;
  for(let file of files) {
    const ext = path.extname(file).replace(/[\s.,%]/g, '');
    const name = path.basename(file).replace(/\.[^/.]+$/, '');
    if (ext === 'html') {
      fs.readFile(path.join(componentFolder, file), 'utf-8', (error, data) => {
        if (error) throw error;
        out = out.replace(`{{${name}}}`, data);
        fs.writeFile(path.join(distFolder, 'index.html'), out, (error) => {
          if (error) throw error;
        });
      });
    }
  }
};

/**
 * чтение и сбор компонентов
 * @param {string} input
 */
const components = (input) => {
  const comp = fs.promises.readdir(componentFolder);
  comp
    .then((files) => {
      htmlBundle(input, files);
    })
    .catch((error) => {
      if (error) throw error;
    });
};

/**
 * Чтение файла
 */
const readTemplate = () => {
  const tmpl = fs.promises.readFile(templateFile, 'utf-8');
  tmpl
    .then((output) => {
      components(output);
    })
    .catch((error) => {
      if (error) throw error;
    });
};

/**
 * Создание папки с последующими действиями
 */
const createDistFolder = () => {
  const createFolder = fs.promises.mkdir(distFolder);
  createFolder
    .then(() => {
      readTemplate();
      mergeStyles();
      copyAssets();
    })
    .catch((error) => {
      if (error) throw error;
    });
};

/**
 * Создание папки project-dist
 */
fs.stat(distFolder, (error) => {
  if (error && error.code === 'ENOENT') {
    createDistFolder();
  } else {
    const removeFolder = fs.promises.rm(distFolder, {recursive: true, force: true});
    removeFolder
      .then(() => {
        createDistFolder();
      })
      .catch((error) => {
        if (error) throw error;
      });
  }
});
