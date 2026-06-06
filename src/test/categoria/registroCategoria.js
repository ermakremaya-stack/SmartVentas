function registrarCategoria(nuevaCategoria, listaCategoriasExistentes = []) {
  const { nombre_categoria } = nuevaCategoria;

  // 1. Validar campos obligatorios
  if (!nombre_categoria || nombre_categoria.trim() === "") {
    return { valido: false, mensaje: "Completa todos los campos requeridos." };
  }

  const nombreLimpio = nombre_categoria.trim();

  // 2. Validar que el nombre no sea un valor ya existente (Si: N = Valor existente no válido)
  const nombreAComprobar = nombreLimpio.toLowerCase();
  const existeDuplicado = listaCategoriasExistentes.some(cat => 
    cat.nombre_categoria.trim().toLowerCase() === nombreAComprobar
  );

  if (existeDuplicado) {
    return { valido: false, mensaje: "El registro rechaza la categoría: el nombre ya se encuentra en el sistema." };
  }

  // 3. Validar valores numéricos (Si N tiene valores numéricos no válido)
  // Caja blanca: Al usar solo !isNaN, Jest puede evaluar todas sus condiciones de flujo
  if (!isNaN(nombreLimpio)) {
    return { valido: false, mensaje: "El nombre de la categoría no puede contener solo valores numéricos." };
  }

  // 4. Registro exitoso
  return { 
    valido: true, 
    mensaje: "Se registró la nueva categoría exitosamente." 
  };
}

module.exports = registrarCategoria;