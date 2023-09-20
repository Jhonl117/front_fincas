
import * as valid from '../validations/expresiones.mjs';
import * as alert from '../validations/alertas.mjs';

const url = 'https://backend-valhalla.onrender.com/ruta/usuarios';

const listarUsuarios = async () => {
    const tabla = $('#dataTable').DataTable({

        "bProcessing": true, // Habilita la pantalla de carga
        "serverSide": false, // Puedes cambiar esto según tus necesidades

        "columns": [
            { "data": "index" }, // Índice autoincremental
            { "data": "username" },
            { "data": "correo" },
            { "data": "rol" },
            { "data": "fecha_registro" }, // Fecha de registro
            { "data": "estado" },
            { "data": "botones_accion"}
        ],
    });

    // Hacer la solicitud a la API
    await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
        .then((resp) => resp.json())
        .then(function (data) {
            const listaUsuarios = data.usuarios;

            // Agregar un índice autoincremental y fecha de registro a los datos
            listaUsuarios.forEach((usuario, index) => {
                usuario.index = index + 1;
                usuario.fecha_registro = new Date().toLocaleDateString('es-ES');
                if (usuario.estado) {
                    usuario.estado =`<i class="fas fa-toggle-on fa-2x text-success" id="cambiar-estado" data-index="${usuario._id}" data-estado="${usuario.estado}"></i>`;
                } else {
                    usuario.estado =`<i class="fas fa-toggle-on fa-rotate-180 fa-2x text-danger" id="cambiar-estado" data-index="${usuario._id}" data-estado="${usuario.estado}"></i>`;
                }

                usuario.botones_accion = `
                    <div class="text-center d-flex justify-content-around">
                        <a href="#" class="btn btn-primary" id="btnUpdate" data-index="${usuario._id}" data-toggle="modal" data-target="#UpdateModal"><i class="fas fa-edit"></i></a>
                        <a href="#" class="btn btn-danger" id="btnDelete" data-index="${usuario._id}"><i class="fas fa-trash-alt"></i></a>
                        <a href="#" class="btn btn-warning" id="btnVer" data-index="${usuario._id}" data-toggle="modal" data-target="#ShowModal"><i class="fas fa-eye"></i></a>
                    </div>
                `;
            });

            tabla.clear().draw();
            tabla.rows.add(listaUsuarios).draw();

            // Evento Cambiar de Estado
            tabla.on('click', '#cambiar-estado', function () {              
                const userId = this.getAttribute('data-index');
                let currentEstado = this.getAttribute('data-estado'); // Obtiene el atributo como cadena

                // Compara la cadena con "true"
                if (currentEstado === "true") {
                    this.classList.remove('text-success');
                    this.classList.add('fa-rotate-180', 'text-danger');
                    currentEstado = "false"; // Establece la cadena "false"
                } else {
                    this.classList.remove('fa-rotate-180', 'text-danger');
                    this.classList.add('text-success');
                    currentEstado = "true"; // Establece la cadena "true"
                }
            
                this.setAttribute('data-estado', currentEstado); // Actualiza el atributo data-estado
                cambiarEstado(userId, currentEstado);
            });
            
            // Evento Borrar Datos Usuarios
            tabla.on('click', '#btnDelete', function () {
                const button = this
                const userID = button.getAttribute('data-index');
                eliminarUsuarios(userID)
            })

            // Evento Modificar Datos Usuarios
            tabla.on('click', '#btnUpdate', function () {
                const button = this
                const userID = button.getAttribute('data-index');
                document.getElementById('formModificar').reset() 
                verModalUsuarios(userID)
            })

            // Evento Ver Datos Usuarios
            tabla.on('click', '#btnVer', function () {
                const button = this
                const userID = button.getAttribute('data-index');
                document.getElementById('formModificar').reset()
                verUsuarios(userID)
            })



        })

        .catch(function (error) {
            console.error('Error:', error);
        });
}

// Función para cambiar el estado del usuario
function cambiarEstado(userId, newEstado) {

    const usuarios = {
        _id: userId,
        estado:newEstado,
    };

    fetch(url, {
        method: 'PUT',
        mode: 'cors',
        body: JSON.stringify(usuarios),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
    })
}    

// 

// -------------------------------------------------
const eliminarUsuarios = (id) => {

    Swal.fire({
        title: '¿Está seguro de realizar la eliminación?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            let usuario = {
                _id: id,
            };
            fetch(url, {
                method: 'DELETE',
                mode: 'cors',
                body: JSON.stringify(usuario),
                headers: { 'Content-type': 'application/json; charset=UTF-8' },
            })
            .then((resp) => resp.json())
            .then((json) => {
                Swal.fire({
                position: 'center',
                icon: 'success',
                title: '¡Usuario Eliminado Exitosamente!',
                text: json.msg,
                showConfirmButton: false,
                timer: 1500
            })
            setTimeout(() => {
                    window.location.reload();
                }, 2000);
                
            })
            .catch((error) => {
                console.error('Error:', error);
                Swal.fire('Error', 'Se produjo un error al eliminar el usuario.', 'error');
            });
        }
    });
};

// ================================================================

const verModalUsuarios = async (usuario) => {

    await fetch(`https://backend-valhalla.onrender.com/ruta/usuarios/${usuario}`, {
        method: 'GET',
        mode: 'cors',
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
    .then((resp) => resp.json())
    .then((data) => {
        const usuario = data.usuarioID; 
        console.log(usuario)
        document.getElementById('txtID').value = usuario._id;
        document.getElementById('txtNombres').value = usuario.nombres;
        document.getElementById('txtApellidos').value = usuario.apellidos;
        document.getElementById('txtUsername').value = usuario.username;
        document.getElementById('txtCorreo').value = usuario.correo;
        document.getElementById('selRol').value = usuario.rol;
    })
    .catch((error) => {
        console.log('Error: ', error);
    });
}

// ==============================================================

const crearUsuarios = async () => {

    const campos = [
        { id: 'txtNombres', label: 'Nombre', validacion: valid.validarNombre },
        { id: 'txtApellidos', label: 'Apellido', validacion: valid.validarApellido },
        { id: 'txtCorreo', label: 'Correo', validacion: valid.validarCorreo },
        { id: 'txtUsername', label: 'Username', validacion: valid.validarUsername},
        /* { id: 'txtTelefono', label: 'Telefono', validacion: valid.validarTelefono}, */
        { id: 'selRol', label: 'Rol'},
        { id: 'txtPassword', label: 'Contraseña', validacion: valid.validarPassword},
        { id: 'txtPasswordRepeat', label: 'Confirmar Contraseña', validacion: valid.validarPassword }
    ];

    if (!alert.validarCampos(campos)) {
        return;
    }

    const txtPassword = document.getElementById('txtPassword').value;
    const txtPasswordRepeat = document.getElementById('txtPasswordRepeat').value;

    if (txtPassword !== txtPasswordRepeat) {

        Swal.fire({
            position: 'center',
            icon: 'error',
            title: '¡Error Registro!',
            text: 'Las Contraseñas ingresadas no coinciden',
            showConfirmButton: false,
            timer: 1500
        })
        return;
    }else{
        
        const usuario = {
            nombres: document.getElementById('txtNombres').value,
            apellidos: document.getElementById('txtApellidos').value,
            username: document.getElementById('txtUsername').value,
            correo: document.getElementById('txtCorreo').value,
            /* telefono: document.getElementById('txtTelefono').value, */
            rol: document.getElementById('selRol').value,
            password: txtPassword
        };

        fetch(url, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(usuario),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        })
            .then((resp) => resp.json())
            .then((json) => {
                if (json.msg) {

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: '¡Registro Exitoso!',
                        text: json.msg,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setTimeout(() => {
                        window.location.href = '/listarUsuarios';
                    }, 2000);
                }
            })
            .catch((error) => {
                
                console.error('Error al registrar usuario:', error);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: '¡Error al Registrar Usuario!',
                    text: 'No se pudo procesar la solicitud, Inténtelo nuevamente.',
                    showConfirmButton: false,
                    timer: 1500
                })
                window.location.reload();
            });
    }

}

// ============================================================

const modificarUsuarios = async () => {

    const campos = [
        { id: 'txtNombres', label: 'Nombres', validacion: valid.validarNombre },
        { id: 'txtApellidos', label: 'Apellidos', validacion: valid.validarApellido },
        { id: 'txtUsername', label: 'Telefono', validacion: valid.validarUsername},
        { id: 'txtCorreo', label: 'Tipo Documento', validacion: valid.validarCorreo},
        { id: 'selRol', label: 'Numero Documento'},
    ];

    if (!alert.validarCampos(campos)) {
        return;
    }else{
        
        const usuarios = {
            _id: document.getElementById('txtID').value,
            nombres: document.getElementById('txtNombres').value,
            apellidos: document.getElementById('txtApellidos').value,
            username: document.getElementById('txtUsername').value, 
            correo: document.getElementById('txtCorreo').value, 
            rol: document.getElementById('selRol').value
        };

        fetch(url, {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify(usuarios),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        })
            .then((resp) => resp.json())
            .then((json) => {
                if (json.msg) {

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: '¡Modificación Exitosa!',
                        text: json.msg,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setTimeout(() => {
                        window.location.href = '/listarUsuarios';
                    }, 2000);
                }
            })
            .catch((error) => {
                
                console.error('Error al registrar usuario:', error);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: '¡Error al Modificar Usuario!',
                    text: 'No se pudo procesar la solicitud, Inténtelo nuevamente.',
                    showConfirmButton: false,
                    timer: 1500
                })
                window.location.reload();
            });
    }

}

const verUsuarios = async (idEmpleado) => {

    await fetch(url+`/${idEmpleado}`, {
        method: 'GET',
        mode: 'cors',
        headers: {'Content-type': "aplication/json; charset=UTF-8"}
    })
    .then((resp) => resp.json())
    .then((data) => {
        const empleado = data.empleadoID;
        console.log(empleado)
        const fechaFormateada = empleado.fechaNacimiento.split('T')[0];
        
        /* document.getElementById('txtID').value = usuario._id; */
        document.getElementById('txtNombres').textContent = usuario.nombres;
        document.getElementById('txtApellidos').textContent = usuario.apellidos;
        document.getElementById('txtUsername').textContent = usuario.username;
        document.getElementById('txtCorreo').textContent = usuario.correo;
        document.getElementById('selRol').textContent = usuario.rol;

    })
    .catch((error) => {
        console.log('Error: ',error)
    })
}



document.addEventListener("DOMContentLoaded", function () {

    const PageUrl = window.location.href;

    // Verificar si la URL contiene "listarusuarios"
    if (PageUrl.includes("/listarUsuarios")) {
        listarUsuarios();

        document.getElementById('btnMdReset').
        addEventListener('click', () => {
            document.getElementById('formModificar').reset()
        })

        document.getElementById('btnMdGuardar').
        addEventListener('click', () => {
            modificarUsuarios()
        })


        document.getElementById('btnGenerar').
        addEventListener('click', (event) => {
            event.preventDefault()
            
            Swal.fire({
                title: '¿Estas Seguro?',
                text: 'Se generar un reporte de los usuarios',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, Generar',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: '¡Error Visualizacion!',
                        text: 'No se puede generar reporte, no está habilitado.',
                        showConfirmButton: false,
                        timer: 2000
                    })
                }
            });
        })


    }

    if(PageUrl.includes("/crearUsuario")){

        document.getElementById('btnGuardar').
        addEventListener('click', () => {
            crearUsuarios();
        })

        document.getElementById('btnReset').
        addEventListener('click', (event) => {
            event.preventDefault()
            document.getElementById('formModificar').reset()
        })

        document.getElementById('btnCancelar').
        addEventListener('click', (event) => {
            event.preventDefault()
            
            Swal.fire({
                title: '¿Estas Seguro?',
                text: 'No se registrará ningún Usuario',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, Salir',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    setTimeout(() => {
                        window.location.href = '/listarUsuarios';
                    }, 1800);
                }
            });
        })
    }

        

});






