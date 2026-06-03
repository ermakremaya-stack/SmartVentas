function registroEmpleado(empleado, listaEmpleadosExistentes = []) {
  const { nombre_empleado, apellido_empleado, email, celular, pin, tipo_empleado } = empleado;

  // 1. Validar campos obligatorios (Basado en las columnas de tu tabla)
  if (!nombre_empleado || !apellido_empleado || !email || !celular || !pin || !tipo_empleado) {
    return { valido: false, mensaje: "Completa todos los campos requeridos." };
  }

  // 2. Validar formato del correo (Debe tener un @ en medio, no al inicio ni al final)
  const posicionArroba = email.indexOf('@');
  if (posicionArroba <= 0 || posicionArroba === email.length - 1 || email.split('@').length - 1 !== 1) {
    return { valido: false, mensaje: "El correo electrónico no es válido." };
  }

  // 3. Validar que el nombre completo no coincida con uno ya registrado
  const nombreCompletoNuevo = `${nombre_empleado.trim().toLowerCase()} ${apellido_empleado.trim().toLowerCase()}`;
  
  const existeDuplicado = listaEmpleadosExistentes.some(emp => {
    const nombreCompletoExistente = `${emp.nombre_empleado.trim().toLowerCase()} ${emp.apellido_empleado.trim().toLowerCase()}`;
    return nombreCompletoNuevo === nombreCompletoExistente;
  });

  if (existeDuplicado) {
    return { valido: false, mensaje: "El empleado con este nombre completo ya está registrado." };
  }

  // Si pasa todas las validaciones
  return { valido: true };
}

module.exports = registroEmpleado;