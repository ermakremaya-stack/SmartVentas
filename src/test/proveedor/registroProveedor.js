function registroProveedor(proveedor) {
  const { numero_proveedor, correo_proveedor } = proveedor;

  // 1. Validar campos obligatorios
  if (!numero_proveedor || !correo_proveedor) {
    return { valido: false, mensaje: "Completa todos los campos requeridos." };
  }

  // 2. Validar que el teléfono solo contenga números (Rechaza caracteres $%PW y espacios múltiples)
  const soloNumeros = /^[0-9]+$/;
  if (!soloNumeros.test(numero_proveedor)) {
    return { valido: false, mensaje: "El número de teléfono no es válido (contiene caracteres no permitidos o espacios)." };
  }

  // 3. Validar límite de 8 dígitos para el teléfono
  if (numero_proveedor.length > 8) {
    return { valido: false, mensaje: "El número de teléfono no es válido (más de 8 dígitos)." };
  }

  // 4. Validar caracteres prohibidos () : ; < > en el correo
  const caracteresProhibidos = /[():;<>]/;
  if (caracteresProhibidos.test(correo_proveedor)) {
    return { valido: false, mensaje: "El correo electrónico contiene caracteres no válidos." };
  }

  const posicionArroba = correo_proveedor.indexOf('@');
  const cantidadArrobas = correo_proveedor.split('@').length - 1;

  // 5. Validar existencia de un solo arroba (@) en el correo
  if (posicionArroba === -1) {
    return { valido: false, mensaje: "El correo electrónico no es válido (no tiene '@')." };
  }

  if (cantidadArrobas !== 1) {
    return { valido: false, mensaje: "El correo electrónico no es válido (tiene más de una '@')." };
  }

  return { 
    valido: true, 
    mensaje: "Teléfono guardado y asignado al proveedor correctamente. Correo electrónico guardado y asignado al proveedor correctamente." 
  };
}

module.exports = registroProveedor;