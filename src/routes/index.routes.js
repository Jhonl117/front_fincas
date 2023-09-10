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
    res.render('index', {
        dasboard: true
    })
})


// ================================= \\
// Rutas Usuarios

router.get('/listarUsuarios', (req, res) => {
    res.render('usuarios/listarUsuarios', {
        usuarioL: true,
        usuarioR: true
    })
})

router.get('/crearUsuario', (req, res) => {
    res.render('usuarios/formUsuarios', {
        usuarioR: true
    })
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
// Rutas Categorias

router.get('/listarCategorias', (req, res) => {
    res.render('categorias/listarCategorias')
})

router.get('/crearCategorias', (req, res) => {
    res.render('categorias/formCategorias')
})

// ================================= \\
// Rutas Servicios

router.get('/listarServicios', (req, res) => {
    res.render('servicios/listarServicios')
})

router.get('/crearServicios', (req, res) => {
    res.render('servicios/formServicios')
})

// ================================= \\
// Ruta Error

router.get('*', (req, res) => {
    res.render('404')
})

// ================================= \\
// Exportacion

module.exports = router