function editarCategoria(categoriaEditada, listaCategoriasExistentes = []) {
  const { id_categoria, nombre_categoria } = categoriaEditada;

  // 1. Validar campos obligatorios
  if (!id_categoria || !nombre_categoria) {
    return { valido: false, mensaje: "Completa todos los campos requeridos." };
  }

  const nombreLimpio = nombre_categoria.trim();

  // 2. Validar que el nombre no consista únicamente de valores numéricos
  // Convertimos a número; si no es NaN y es un número finito, significa que solo contiene dígitos.
  if (!isNaN(nombreLimpio) && nombreLimpio !== "") {
    return { valido: false, mensaje: "El nombre de la categoría no puede contener solo valores numéricos." };
  }

  // 3. Validar duplicados de nombre de categoría EXCLUYENDO a la categoría actual
  const nombreCategoriaAEditar = nombreLimpio.toLowerCase();
  
  const existeDuplicado = listaCategoriasExistentes.some(cat => {
    const nombreExistente = cat.nombre_categoria.trim().toLowerCase();
    // Si tienen el mismo nombre, pero DIFERENTE ID, significa que otra categoría ya lo está usando.
    return nombreCategoriaAEditar === nombreExistente && cat.id_categoria !== id_categoria;
  });

  if (existeDuplicado) {
    return { valido: false, mensaje: "El sistema rechaza la edición: la categoría con este nombre ya se encuentra en el sistema." };
  }

  return { 
    valido: true, 
    mensaje: "El sistema muestra datos actualizados con éxito y los cambios se visualizan." 
  };
}

module.exports = editarCategoria;