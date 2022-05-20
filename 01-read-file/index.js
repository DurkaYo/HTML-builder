const folderName = '01-read-file';
const nameFile = 'text.txt'

const fs = require('fs');
const path = require('path');

const absolutePath = path.resolve(folderName, nameFile);

const rsFile = fs.createReadStream(absolutePath, 'utf-8');

rsFile.on('readable', () => {
    const data = rsFile.read();
    if (data !== null) {
        console.log(data);
    }
});

rsFile.on('end', () => {
    console.log('Файл закочился')
})

rsFile.on('error', (error) => {
    if (error.code ===  'ENOENT') {
        console.log('Файл не найден')
    } else {
        console.log('Ошибка!')
        console.log(error);
    }
})
