// ================================= \\
// Requerir Dependencia

const {Router} = require('express');
const router = Router()


// ================================= \\
// Rutas index

router.get('/', (req, res) => {
    res.render('acceso/login', {
        login: false
    })
})

router.get('/register', (req, res) => {
    res.render('acceso/register')
})

router.get('/panelAdministrativo', (req, res) => {
    res.render('index', {
        global: true,
        dasboard: true
    })
})


// ================================= \\
// Rutas Usuarios

router.get('/listarUsuarios', (req, res) => {
    res.render('usuarios/listarUsuarios', {
        global: true,
        usuarioL: true,
        usuarioR: true
    })
})

router.get('/crearUsuario', (req, res) => {
    res.render('usuarios/formUsuarios', {
        global: true,
        usuarioR: true
    })
})


// ================================= \\
// Rutas Clientes

router.get('/listarClientes', (req, res) => {
    res.render('clientes/listarClientes', {
        global: true,
        usuarioL: true,
        clienteR: true
    })
})



// ================================= \\
// Rutas Empleado

router.get('/listarEmpleados', (req, res) => {
    res.render('empleados/listarEmpleados', {
        global: true,
        usuarioL: true,
        empleadoR: true
    })
})


// ================================= \\
// Rutas Categorias

router.get('/listarCategorias', (req, res) => {
    res.render('categorias/listarCategorias', {
        global: true,
    })
})

router.get('/crearCategorias', (req, res) => {
    res.render('categorias/formCategorias', {
        global: true,
    })
})

// ================================= \\
// Rutas Servicios

router.get('/listarServicios', (req, res) => {
    res.render('servicios/listarServicios', {
        global: true,
    })
})

router.get('/crearServicios', (req, res) => {
    res.render('servicios/formServicios', {
        global: true,
    })
})

// ================================= \\
// Ruta Error

router.get('*', (req, res) => {
    res.render('404')
})

// ================================= \\
// Exportacion

module.exports = router