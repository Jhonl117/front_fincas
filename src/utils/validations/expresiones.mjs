
export const validarNombre = (nombre) => {
    const result = /^[A-Za-z\s]+$/;
    return result.test(nombre)
}

export const validarApellido = (apellido) => {
    const result = /^[A-Za-z\s]+$/;
    return result.test(apellido)
}

export const validarUsername = (username) => {
    const resut = /^[a-zA-Z0-9_]{3,16}$/;
    return resut.test(username)
}

export const validarCorreo = (correo) => {
    const result = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return result.test(correo)
}

export const validarTelefono = (telefono) => {
    const result = /^\d{10}$/;
    return result.test(telefono)
}

export const validarPassword = (password) => {
    const result = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return result.test(password)
}





