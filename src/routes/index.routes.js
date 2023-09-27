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
    res.render('acceso/register', {
        login: false
    })
})

router.get('/panelAdministrativo', (req, res) => {
    res.render('index', {
        global: true,
        dasboard: true
    })
})


// ================================= \\
// Rutas Fincas



router.get('/listarFincas', (req, res) => {
    res.render('fincas/listarFincas', {
        global: true,
        tabla: true,
        clienteR: true
    })
})

router.get('/registrarFincas', (req, res) => {
    res.render('fincas/formFincas', {
        global: true,
        tabla: true,
        clienteR: true
    })
})

// ================================= \\
// Rutas Clientes

router.get('/listarClientes', (req, res) => {
    res.render('clientes/listarClientes', {
        global: true,
        tabla: true,
        clienteR: true
    })
})



// ================================= \\
// Rutas Empleado

router.get('/listarEmpleados', (req, res) => {
    res.render('empleados/listarEmpleados', {
        global: true,
        tabla: true,
        empleadoR: true
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
