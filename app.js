// Importar el paquete de terceros que acabamos de instalar. Fijaos que como se encuentra en la carpeta node_modules NO hace falta especificar ninguna ruta (al igual que pasa con los built-in modules)
const express = require('express');
const Morgan = require('morgan');
const fs = require('fs');
const path = require('path');


// Es generarme un objeto para gestionar el enrutamiento y otros aspectos de la aplicación
const app = express();
const port = process.env.PORT || 5502;




// Añadimos el middleware de morgan para loguear todas las peticiones que haga un cliente
app.use(Morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));


// nos gustaría que también gestionaras los datos de tipo JSON (entre ellos los POST que nos lleguen)
const lotteryData = JSON.parse(fs.readFileSync('./data/lottery.json', 'utf-8'));
const prizeData = JSON.parse(fs.readFileSync('./data/prizes.json', 'utf-8'));



// Definir las rutas y sus manejadores

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});


app.get('/api/check-date', (req, res) => {
    const { date } = req.query;

    const lotteryData = require('./data/lottery.json');
    

    if (!date) {
        return res.status(400).json({ message: 'This field is required' });
    }

    const draw = lotteryData.find(d => {
        const drawDate = d.draw_date.split('T')[0];
        return drawDate === date;
    });

    if (draw) {
        const winningNumbers = `${draw.winning_numbers} ${draw.supplemental_numbers}`;
        res.json({
            message: 'Draw found',
            winningNumbers: allWinningNumbers,
        });
    }

    else {
        res.json({ message: 'No draw found for the given date' });
    }

});


app.get('/api/get-computed-results', (req, res) => {
    const { date, playNumbers } = req.query;

    if (!date || !playNumbers) {
        return res.status(400).json({ 
            message: 'Date is required',
            matchNumbers: 0,
            prize: 0
        });
    }

    const draw = lotteryData.find(d => {
        const drawDate = d.draw_date.split('T')[0];
        return drawDate === date;
    });

    if (!draw) {
        return res.json({
            message: 'Draw not found for the given date',
            matchNumbers: 0,
            prize:0

        });
    }

    const userNumbers = playNumbers.split(' ')
                                    .map(num => num.trim());

    
    if(userNumbers.length !==7 ) {
        return res.status(400).json
        message: "7 numbers are required"
    }

    const winningNumbers = `${draw.winning_numbers} ${draw.supplemental_numbers}`.split(' ');
    let matchCount = 0;
    userNumbers.forEach(num => {
        if (winningNumbers.includes(num)) {
            matchCount++;
        }
    });
   

    const prizeInfo = prizeData.find(p => p.match_numbers === matchCount);
    const prize = prizeInfo ? prizeInfo.prize : 0;

    res.json({
        matchNumbers: matchCount,
        prize: prize,
        message: `You matched ${matchCount} numbers!`,
        winningNumbers: winningNumbers.join(' '),
        playedNumbers: playedNumbers,
    });
});

// Levantar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}.`);
    });