const readline = require('readline');
const process = require('process');
const fs = require('fs');
const path = require('path');

const nameFile = 'text.txt'

const writePath = path.join(__dirname, nameFile);

const input = process.stdin;
const output = process.stdout;

const rl = readline.createInterface({input, output});

console.log('Приветствую!\nДля выхода нажмите "ctrl-c" или введите в строке "exit"');

process.on('exit', (code) => {
    console.log('\nВыходим, до свидания.');
})


rl.question('Тут что-то можно написать:\n', (answer) => {
    fs.writeFile(writePath, answer, (error) => {
        if(error) throw error;
    })
});

rl.on('line', (input) => {
    const write = `\n${input}`

    if (input === 'exit') {
        rl.close();
    } else {
        fs.appendFile(writePath, write, (error) => {
            if(error) throw error;
        })
    }
});

rl.on('close', () => {
    console.log(`\nВсе написанное записано в файл ${nameFile}`);
    rl.close();
})
