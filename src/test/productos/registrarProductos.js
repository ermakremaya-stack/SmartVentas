function registroProducto(producto) {
  const {
    producto_id,
    nombre,
    categoria_id,
    existencias,
    precio_compra,
    precio_venta,
    activo,
    modificarExistenciasDirectamente
  } = producto;

  // Campos obligatorios
  if (
    !nombre ||
    !categoria_id ||
    existencias === '' ||
    precio_compra === '' ||
    precio_venta === '' ||
    activo === ''
  ) {
    return {
      valido: false,
      mensaje: 'Completa todos los campos requeridos.'
    };
  }

  // Validar que el nombre solo tenga letras y espacios
  const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

  if (!regexNombre.test(nombre)) {
    return {
      valido: false,
      mensaje: 'El nombre del producto solo debe contener letras.'
    };
  }

  // Validar precio decimal con punto
  const regexDecimal = /^\d+\.\d{2}$/;

  // Precio de compra: decimal, con punto y no negativo
  if (!regexDecimal.test(String(precio_compra)) || Number(precio_compra) < 0) {
    return {
      valido: false,
      mensaje: 'El precio de compra debe ser decimal positivo y contener punto decimal.'
    };
  }

  // Precio de venta: decimal, con punto y no negativo
  if (!regexDecimal.test(String(precio_venta)) || Number(precio_venta) < 0) {
    return {
      valido: false,
      mensaje: 'El precio de venta debe ser decimal positivo y contener punto decimal.'
    };
  }

  // Precio de venta no debe ser inferior al precio de compra
  if (Number(precio_venta) < Number(precio_compra)) {
    return {
      valido: false,
      mensaje: 'El precio de venta no puede ser inferior al precio de compra.'
    };
  }

  // Existencias deben ser enteras
  if (!Number.isInteger(Number(existencias))) {
    return {
      valido: false,
      mensaje: 'Las existencias deben ser un número entero.'
    };
  }

  // No permitir modificar existencias directamente
  if (modificarExistenciasDirectamente === true) {
    return {
      valido: false,
      mensaje: 'No se permite modificar las existencias directamente.'
    };
  }

  // Activo debe ser booleano
  if (typeof activo !== 'boolean') {
    return {
      valido: false,
      mensaje: 'El campo activo debe ser booleano.'
    };
  }

  return {
    valido: true
  };
}

module.exports = registroProducto;