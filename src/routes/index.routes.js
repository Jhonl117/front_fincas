// ================================= \\
// Requerir Dependencia

const {Router} = require('express');
const router = Router()


// ================================= \\
// Rutas index

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/', (req, res) => {
    res.render('index')
})


// ================================= \\
// Rutas Usuarios

router.get('/listarUsuarios', (req, res) => {
    res.render('usuarios/listarUsuarios')
})

router.get('/crearUsuario', (req, res) => {
    res.render('usuarios/formUsuarios')
})


// ================================= \\
// Rutas Clientes

router.get('/listarClientes', (req, res) => {
    res.render('clientes/listarClientes')
})



// ================================= \\
// Rutas Empleado

router.get('/listarEmpleados', (req, res) => {
    res.render('empleados/listarEmpleados')
})


// ================================= \\
// Ruta Error

router.get('*', (req, res) => {
    res.render('404')
})

// ================================= \\
// Exportacion

module.exports = router