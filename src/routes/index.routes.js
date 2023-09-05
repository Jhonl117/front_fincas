// ================================= \\
// Requerir Dependencia

const {Router} = require('express');
const router = Router()


// ================================= \\
// Ruta index

router.get('/', (req, res) => {
    res.render('index')
})


// ================================= \\
// Ruta usuario

router.get('/usuarios', (req, res) => {
    res.render('usuarios/usuarios')
})

router.get('/crearUsuario', (req, res) => {
    res.render('usuarios/formUsuarios')
})


// ================================= \\
// Ruta Empleado

router.get('/empleados', (req, res) => {
    res.render('empleados')
})

// ================================= \\
// Ruta Error

router.get('*', (req, res) => {
    res.render('404')
})

// ================================= \\
// Exportacion

module.exports = router