function editarProducto(productoEditado, productoOriginal) {
  const {
    producto_id,
    nombre,
    categoria_id,
    existencias,
    precio_compra,
    precio_venta,
    activo
  } = productoEditado;

  // Campos obligatorios
  if (
    producto_id === '' ||
    producto_id === undefined ||
    producto_id === null ||
    !nombre ||
    categoria_id === '' ||
    categoria_id === undefined ||
    categoria_id === null ||
    existencias === '' ||
    existencias === undefined ||
    existencias === null ||
    precio_compra === '' ||
    precio_compra === undefined ||
    precio_compra === null ||
    precio_venta === '' ||
    precio_venta === undefined ||
    precio_venta === null ||
    activo === '' ||
    activo === undefined ||
    activo === null
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
  // Ejemplo válido: 80.00
  // Ejemplo inválido: 80
  const regexDecimal = /^\d+\.\d{2}$/;

  // Validar precio_compra decimal con punto
  if (!regexDecimal.test(String(precio_compra))) {
    return {
      valido: false,
      mensaje: 'El precio de compra debe ser decimal y contener punto decimal.'
    };
  }

  // Validar precio_compra no negativo
  if (Number(precio_compra) < 0) {
    return {
      valido: false,
      mensaje: 'El precio de compra no puede ser negativo.'
    };
  }

  // Validar precio_venta decimal con punto
  if (!regexDecimal.test(String(precio_venta))) {
    return {
      valido: false,
      mensaje: 'El precio de venta debe ser decimal y contener punto decimal.'
    };
  }

  // Validar precio_venta no negativo
  if (Number(precio_venta) < 0) {
    return {
      valido: false,
      mensaje: 'El precio de venta no puede ser negativo.'
    };
  }

  // Validar que precio_venta no sea inferior a precio_compra
  if (Number(precio_venta) < Number(precio_compra)) {
    return {
      valido: false,
      mensaje: 'El precio de venta no puede ser inferior al precio de compra.'
    };
  }

  // Validar existencias como número entero
  if (!Number.isInteger(Number(existencias))) {
    return {
      valido: false,
      mensaje: 'Las existencias deben ser un número entero.'
    };
  }

  // No permitir existencias negativas
  if (Number(existencias) < 0) {
    return {
      valido: false,
      mensaje: 'Las existencias no pueden ser negativas.'
    };
  }

  // No permitir modificar existencias directamente
  if (
    productoOriginal &&
    Number(existencias) !== Number(productoOriginal.existencias)
  ) {
    return {
      valido: false,
      mensaje: 'No se permite modificar las existencias directamente.'
    };
  }

  // Validar campo activo como booleano
  if (typeof activo !== 'boolean') {
    return {
      valido: false,
      mensaje: 'El campo activo debe ser booleano.'
    };
  }

  return {
    valido: true,
    mensaje: 'Producto editado correctamente.'
  };
}

module.exports = editarProducto;