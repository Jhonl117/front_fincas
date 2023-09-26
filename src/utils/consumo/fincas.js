
import * as valid from '../validations/expresiones.mjs';
import * as alert from '../validations/alertas.mjs';

const url = 'http://localhost:8289/api/registrofincas';

const listarFincas = async () => {
    const tabla = $('#dataTable').DataTable({

        "bProcessing": true, // Habilita la pantalla de carga
        "serverSide": false, // Puedes cambiar esto según tus necesidades

        "columns": [
            { "data": "index" }, // Índice autoincremental
            { "data": "nombre" },
            { "data": "valor" },
            { "data": "area" },
            { "data": "cultivos" }, // Fecha de registro
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
            const listaFincas = data.usuarios;

            // Agregar un índice autoincremental y fecha de registro a los datos
            listaFincas.forEach((finca, index) => {
                finca.index = index + 1;
                finca.fecha_registro = new Date().toLocaleDateString('es-ES');
                if (finca.estado) {
                    finca.estado =`<i class="fas fa-toggle-on fa-2x text-success" id="cambiar-estado" data-index="${finca._id}" data-estado="${finca.estado}"></i>`;
                } else {
                    finca.estado =`<i class="fas fa-toggle-on fa-rotate-180 fa-2x text-danger" id="cambiar-estado" data-index="${finca._id}" data-estado="${finca.estado}"></i>`;
                }

                usuario.botones_accion = `
                    <div class="text-center d-flex justify-content-around">
                        <a href="#" class="btn btn-primary" id="btnUpdate" data-index="${finca._id}" data-toggle="modal" data-target="#UpdateModal"><i class="fas fa-edit"></i></a>
                        <a href="#" class="btn btn-danger" id="btnDelete" data-index="${finca._id}"><i class="fas fa-trash-alt"></i></a>
                        <a href="#" class="btn btn-warning" id="btnVer" data-index="${finca._id}" data-toggle="modal" data-target="#ShowModal"><i class="fas fa-eye"></i></a>
                    </div>
                `;
            });

            tabla.clear().draw();
            tabla.rows.add(listaFincas).draw();

            // Evento Cambiar de Estado
            tabla.on('click', '#cambiar-estado', function () {              
                const fincaId = this.getAttribute('data-index');
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
                cambiarEstado(fincaId, currentEstado);
            });
            
            // Evento Borrar Datos Usuarios
            tabla.on('click', '#btnDelete', function () {
                const button = this
                const fincaID = button.getAttribute('data-index');
                eliminarFincas(fincaID)
            })

            // Evento Modificar Datos Usuarios
            tabla.on('click', '#btnUpdate', function () {
                const button = this
                const fincaID = button.getAttribute('data-index');
                document.getElementById('formModificar').reset() 
                verModalFincas(fincaID)
            })

            // Evento Ver Datos Usuarios
            tabla.on('click', '#btnVer', function () {
                const button = this
                const fincaID = button.getAttribute('data-index');
                document.getElementById('formModificar').reset()
                verFincas(fincaID)
            })
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}

// Función para cambiar el estado del usuario
function cambiarEstado(fincaId, newEstado) {

    const fincas = {
        _id: fincaId,
        estado:newEstado,
    };

    fetch(url, {
        method: 'PUT',
        mode: 'cors',
        body: JSON.stringify(fincas),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
    })
}    

// 

// -------------------------------------------------
const eliminarFincas = (id) => {

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
                title: '¡Registro de Finca Eliminado Exitosamente!',
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
                Swal.fire('Error', 'Se produjo un error al eliminar el registro de la finca.', 'error');
            });
        }
    });
};

// ================================================================

const verModalFincas = async (finca) => {

    await fetch(url+`/${finca}`, {
        method: 'GET',
        mode: 'cors',
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
    .then((resp) => resp.json())
    .then((data) => {
        const finca = data.fincaID; 
        console.log(finca)
        document.getElementById('txtID').value = finca._id;
        document.getElementById('txtNombre').value = finca.nombres;
        document.getElementById('txtArea').value = finca.apellidos;
        document.getElementById('txtValor').value = finca.Valor;
        document.getElementById('txtCultivos').value = finca.Cultivos;
    })
    .catch((error) => {
        console.log('Error: ', error);
    });
}

// ==============================================================

const registrarFincas = async () => {

    const campos = [
        {   
            id: 'txtNombre',
            label: 'Nombre',
            msg: 'el campo debe contener solo letras o caracteres.',
            validacion: valid.validarNombre 
        },
        { 
            id: 'txtArea',
            label: 'Area',
            msg: 'el campo debe contener solo letras o caracteres.', 
            validacion: valid.validarArea
        },
        { 
            id: 'txtValor', 
            label: 'Valor', 
            msg: 'el campo debe tener solo caracteres numéricos.', 
            validacion: valid.validarValor 
        },
        { 
            id: 'txtCultivos', 
            label: 'Cultivos', 
            msg: 'el campo debe contener solo letras o caracteres.', 
            validacion: valid.validarCultivos
        },

    ];

    if (!alert.validarCampos(campos)) {
        return;
    }
}

// ============================================================

const modificarFincas = async () => {

    const campos = [
        {   
            id: 'txtNombre',
            label: 'Nombre',
            msg: 'el campo debe contener solo letras o caracteres.',
            validacion: valid.validarNombre 
        },
        { 
            id: 'txtArea',
            label: 'Area',
            msg: 'el campo debe contener solo letras o caracteres.', 
            validacion: valid.validarArea
        },
        { 
            id: 'txtValor', 
            label: 'Valor', 
            msg: 'el campo debe tener solo caracteres numéricos.', 
            validacion: valid.validarValor 
        },
        { 
            id: 'txtCultivos', 
            label: 'Cultivos', 
            msg: 'el campo debe contener solo letras o caracteres.', 
            validacion: valid.validarCultivos
        },

    ];

    if (!alert.validarCampos(campos)) {
        return;
    }else{
        
        const fincas = {
            _id: document.getElementById('txtID').value,
            nombre: document.getElementById('txtNombre').value,
            area: document.getElementById('txtArea').value,
            valor: document.getElementById('txtValor').value, 
            cultivos: document.getElementById('txtCultivos').value, 
        };

        fetch(url, {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify(fincas),
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
                        window.location.href = '/listarFincas';
                    }, 2000);
                }
            })
            .catch((error) => {
                
                console.error('Error al registrar finca', error);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: '¡Error al Modificar el Registro de la Finca!',
                    text: 'No se pudo procesar la solicitud, Inténtelo nuevamente.',
                    showConfirmButton: false,
                    timer: 1500
                })
                window.location.reload();
            });
    }

}

const verFinca = async (idFinca) => {

    await fetch(url+`/${idFinca}`, {
        method: 'GET',
        mode: 'cors',
        headers: {'Content-type': "aplication/json; charset=UTF-8"}
    })
    .then((resp) => resp.json())
    .then((data) => {
        const finca = data.fincaID;
        console.log(finca)
  
        /* document.getElementById('txtID').value = usuario._id; */
        document.getElementById('txtVerNombre').textContent = finca.nombre;
        document.getElementById('txtVerArea').textContent = finca.area;
        document.getElementById('txtVerValor').textContent = finca.valor;
        document.getElementById('txtVerCultivos').textContent = finca.cultivos;

    })
    .catch((error) => {
        console.log('Error: ',error)
    })
}



document.addEventListener("DOMContentLoaded", function () {

    const PageUrl = window.location.href;

    // Verificar si la URL contiene "listarfincas   "
    if (PageUrl.includes("/listarFincas")) {
        listarFincas();

        document.getElementById('btnMdReset').
        addEventListener('click', () => {
            document.getElementById('formModificar').reset()
        })

        document.getElementById('btnMdGuardar').
        addEventListener('click', () => {
            modificarFincas()
        })


        document.getElementById('btnGenerar').
        addEventListener('click', (event) => {
            event.preventDefault()
            
            Swal.fire({
                title: '¿Estas Seguro?',
                text: 'Se genera un reporte de las fincas',
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

    if(PageUrl.includes("/registrarFinca")){

        document.getElementById('btnGuardar').
        addEventListener('click', () => {
            registrarFincas();
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
                text: 'No se registrará ninguna Finca',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, Salir',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    setTimeout(() => {
                        window.location.href = '/listarFincas';
                    }, 1800);
                }
            });
        })
    }

        

});






