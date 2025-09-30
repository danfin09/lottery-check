// Importar el paquete de terceros que acabamos de instalar. Fijaos que como se encuentra en la carpeta node_modules NO hace falta especificar ninguna ruta (al igual que pasa con los built-in modules)
const express = require('express');
const logger = require('morgan');
const fs = require('fs');
const path = require('path');

// Es generarme un objeto para gestionar el enrutamiento y otros aspectos de la aplicación
const app = express();
const port = process.env.PORT || 5502;

const lotteryData = JSON.parse(fs.readFileSync('./data/lottery.json', 'utf-8'));
const prizeData = JSON.parse(fs.readFileSync('./data/prizes.json', 'utf-8'));


// Añadimos el middleware de morgan para loguear todas las peticiones que haga un cliente
app.use(logger('dev'));


app.use(express.static(path.join(__dirname, 'public')));


// nos gustaría que también gestionaras los datos de tipo JSON (entre ellos los POST que nos lleguen)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/api/check-date', (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ error: 'This filed is required' });
    }

const draw = lotteryData.find(d => d.date === date);

if (!draw) {
    return res.json({
        mensaje: 'Draw not found'
    });
}

res.json({
    mensaje: 'Draw found',
    winningNumbers: draw.winningNumbers.join(" ")
    });

});


app.get('/api/get-computed-result', (req, res) => {
    const { date, playNumbers } = req.query;

    if (!date || !playNumbers) {
        return res.status(400).json({ error: 'Date is required' });
    }

    const draw = lotteryData.find(d => d.date === date);

    if (!draw) {
        return res.json({
            mensaje: 'Draw not found for the given date'
        });
    }

    const userNumbers = playNumbers.split(' ')
                                    .map(num => parseInt(num));

    const winningNumbers = draw.winningNumbers;
    if(userNumbers.length !==7 ) {
        return res.status(400).json
        message: "7 numbers are required"
    }

    const matchedNumbers = userNumbers.filter(num => winningNumbers.includes(num));
    const matchCount = matchedNumbers.length;

   const prize = prizeData[matchCount] || 0;

   res.json({
       matchedNumbers: matchCount,
       prize: prize
   });
});

// Levantar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}.`);
});