


// Importar el paquete de terceros que acabamos de instalar. Fijaos que como se encuentra en la carpeta node_modules NO hace falta especificar ninguna ruta (al igual que pasa con los built-in modules)
const express = require('express');
const logger = require('morgan');
const fs = require('fs');
const path = require('path');

// Es generarme un objeto para gestionar el enrutamiento y otros aspectos de la aplicación
const app = express();
const port = process.env.PORT || 3000;

const lotteryData = JSON.parse(fs.readFileSync('./data/lottery.json', 'utf-8'));
const prizeData = JSON.parse(fs.readFileSync('./data/prizes.json', 'utf-8'));


// Añadimos el middleware de morgan para loguear todas las peticiones que haga un cliente
app.use(logger('dev'));
app.use(express.static("public"));
app.useF(express.json());


// nos gustaría que también gestionaras los datos de tipo JSON (entre ellos los POST que nos lleguen)
app.use(express.urlencoded({ extended: true }));

const getAllWinningNumbers = () => {
    return `${raffle.winningNumbers} ${raffle.supplementaryNumbers}`;
}

app.use(express.json());
  // Middleware para parsear datos de formularios


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
})

app.get('/data/draws.json', (req, res) => {
    res.json(lotteryData);
});

const draw = lotteryData.find(d => d.date === '2023-10-01');

app.get('/data/lottery.json', (req, res) => {
    res.json(draw);
});

app.get('/api/check-date', (req, res) => {
    const lotter = require('./data/lottery.json');

    const { date } = req.query;
    console.log(`file:app.js line:38 date: ${date}`);

    if (!draw) {
        return res.json({ error: 'Sorteo no encontrado' });
    }
    res.json({ 
        message: 'Sorteo encontrado',
        numbers: draw.numbers
    });
});

app.post('/api/post-comprueba', (req, res) => {
    const { numero } = req.body;
    console.log(numero);
    if (!draw) {
        return res.status(404).json({ error: 'Sorteo no encontrado' });
    }
    const result = draw.numbers.includes(numero);
    res.json({ result });
});

const prizes = require("./prizes.json");
  const prize = prizes[matches.length] || 0;

  res.json({
    matchNumbers: matches.length,
    prize: prize
  });

// Levantar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}.`);
});

