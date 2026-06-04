function registroCliente(cliente) {
  const { nombre, apellido, celular, email, cedula } = cliente;

  // 1. Validar que el nombre esté lleno
  if (!nombre || nombre.trim() === "") {
    return { valido: false, mensaje: "El campo nombre es obligatorio." };
  }

  // 2. Validar que el apellido esté lleno
  if (!apellido || apellido.trim() === "") {
    return { valido: false, mensaje: "El campo apellido es obligatorio." };
  }

  // 3. Validar longitud exacta de la cédula (14 caracteres numéricos)
  // Eliminamos espacios o guiones si el usuario los digita por error
  const cedulaLimpia = cedula ? cedula.replace(/[^0-9]/g, '') : '';
  if (cedulaLimpia.length !== 14) {
    return { valido: false, mensaje: "La cédula debe tener una longitud exacta de 14 números." };
  }

  // 4. Validar formato del correo electrónico (arroba en lugar válido)
  if (!email) {
    return { valido: false, mensaje: "El campo email es obligatorio." };
  }
  const posicionArroba = email.indexOf('@');
  if (posicionArroba <= 0 || posicionArroba === email.length - 1 || email.split('@').length - 1 !== 1) {
    return { valido: false, mensaje: "El correo electrónico no es válido." };
  }

  // Si pasa todas las condiciones de la profesora
  return { valido: true };
}

module.exports = registroCliente;