
import * as valid from '../validations/expresiones.mjs';
import * as alert from '../validations/alertas.mjs';

const validarAcceso = () => {

    const campos = [
        { id: 'txtUsername', label: 'Username', validacion: valid.validarUsername},
        { id: 'txtCorreo', label: 'Correo', validacion: valid.validarCorreo },
        { id: 'txtPassword', label: 'Contraseña', validacion: valid.validarPassword},
    ];

    const datos = {
        usuarioValido: 'Admin',
        correoValido: 'Admin28@gmail.com',
        passwordvalido: 'Admin123',
        username: document.getElementById('txtUsername').value,
        correo: document.getElementById('txtCorreo').value,
        password: document.getElementById('txtPassword'),
    };

    if (!alert.validarCampos(campos)) {
        return;
    }

    if(datos.username === datos.usuarioValido &&
        datos.correo === datos.correoValido && 
        datos.password === datos.password){

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: '¡Login Exitoso!',
                text: 'Se validaron las credenciales, bienvenido!',
                showConfirmButton: false,
                timer: 1500
            })
            setTimeout(() => {
                window.location.href = '/panelAdministrativo';
            }, 2000);
    }else{
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: '¡Error Login!',
            text: 'las credenciales no son correctas, intentelo nuevamente!',
            showConfirmButton: false,
            timer: 1500
        })
    }

    

}


const validarRegistro = async () => {

    const campos = [
        { id: 'txtUsername', label: 'Username', validacion: valid.validarUsername},
        { id: 'txtNombres', label: 'Nombre', validacion: valid.validarNombre },
        { id: 'txtCorreo', label: 'Correo', validacion: valid.validarCorreo },
        { id: 'txtTelefono', label: 'Telefono', validacion: valid.validarTelefono},
        { id: 'txtPassword', label: 'Contraseña', validacion: valid.validarPassword},
        { id: 'txtPasswordRepeat', label: 'Confirmar Contraseña', validacion: valid.validarPassword },
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
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: '¡Registro Exitoso!',
            text: 'los datos fueron registrados correctamente!',
            showConfirmButton: false,
            timer: 1500
        })
        window.location.reload()
        /* const usuario = {
            nombres: document.getElementById('txtNombres').value,
            username: document.getElementById('txtUsername').value,
            correo: document.getElementById('txtCorreo').value,
            telefono: document.getElementById('txtTelefono').value,
            rol: document.getElementById('selRol').value = 'Usuario',
            password: txtPassword,
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
                        window.location.href = '/';
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
            }); */
    }

}






document.addEventListener("DOMContentLoaded", function () {

    
    const PageUrl = window.location.href;

    /* if (PageUrl.includes("/")) {
        document.getElementById('btnContinuar').
        addEventListener('click', (event) => {
            event.preventDefault();
            validarAcceso();
        })
    } */

    
    if (PageUrl.includes("/register")){
        document.getElementById('btnRcontinuar').
        addEventListener('click', (event) => {
            event.preventDefault()
            validarRegistro()
        })
    }else{

            document.getElementById('btnContinuar').
            addEventListener('click', (event) => {
                event.preventDefault();
                validarAcceso();
            })
    }
    

});