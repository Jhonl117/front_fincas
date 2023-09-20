// ================================= \\
// Paquetes o Dependencias

const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

// ================================= \\
//Inicializar Express

const app = express();

// ================================= \\
// Configuracion Express

app.set('port', process.env.PORT || 8181);
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));


app.set('view engine', '.hbs');


// ================================= \\
// Estaticos

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'utils')));


// ================================= \\
// Rutas Paginas

app.use(require('./routes/index.routes'))


// ================================= \\
// Exportacion 

module.exports = app