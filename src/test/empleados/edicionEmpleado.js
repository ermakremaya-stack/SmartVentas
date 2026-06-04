function edicionEmpleado(empleadoEditado, listaEmpleadosExistentes = []) {
  const { id_empleado, nombre_empleado, apellido_empleado, email, celular, pin, tipo_empleado } = empleadoEditado;

  // 1. Validar campos obligatorios e ID existente
  if (!id_empleado || !nombre_empleado || !apellido_empleado || !email || !celular || !pin || !tipo_empleado) {
    return { valido: false, mensaje: "Completa todos los campos requeridos." };
  }

  // 2. Validar formato del correo (mismo que registro)
  const posicionArroba = email.indexOf('@');
  if (posicionArroba <= 0 || posicionArroba === email.length - 1 || email.split('@').length - 1 !== 1) {
    return { valido: false, mensaje: "El correo electrónico no es válido." };
  }

  // 3. Validar duplicados de nombre completo EXCLUYENDO al empleado actual
  const nombreCompletoEditado = `${nombre_empleado.trim().toLowerCase()} ${apellido_empleado.trim().toLowerCase()}`;
  
  const existeDuplicado = listaEmpleadosExistentes.some(emp => {
    const nombreCompletoExistente = `${emp.nombre_empleado.trim().toLowerCase()} ${emp.apellido_empleado.trim().toLowerCase()}`;
    // Si tienen el mismo nombre completo, pero DIFERENTE ID, significa que pertenece a otra persona. ¡Eso es un error!
    return nombreCompletoEditado === nombreCompletoExistente && emp.id_empleado !== id_empleado;
  });

  if (existeDuplicado) {
    return { valido: false, mensaje: "El empleado con este nombre completo ya está registrado." };
  }

  return { valido: true };
}

module.exports = edicionEmpleado;