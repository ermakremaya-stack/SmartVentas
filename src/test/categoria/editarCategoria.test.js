const editarCategoria = require('./editarCategoria');

describe("Validación de Edición de Categorías (Prueba P02)", () => {
  
  // Nuestra base de datos simulada tiene dos categorías guardadas
  const listaMockCategorias = [
    { id_categoria: 1, nombre_categoria: "Ropa Masculina" },
    { id_categoria: 2, nombre_categoria: "Calzado" }
  ];

  it("Prueba 1: Permite actualizar datos si el nombre sigue siendo el mismo de la propia categoría", () => {
    // Ropa Masculina (ID: 1) mantiene su mismo nombre al editarse
    const categoriaModificada = {
      id_categoria: 1,
      nombre_categoria: "Ropa Masculina"
    };

    const resultado = editarCategoria(categoriaModificada, listaMockCategorias);
    
    // DEBE SER VERDADERO porque no se está duplicando con otra categoría, es ella misma
    expect(resultado.valido).toBe(true);
    expect(resultado.mensaje).toContain("El sistema muestra datos actualizados con éxito");
  });

  it("Prueba 2: Rechaza la edición si el nuevo nombre ya se encuentra en el sistema (Valores duplicados)", () => {
    // Calzado (ID: 2) intenta cambiarse el nombre a "Ropa Masculina" (que ya le pertenece al ID 1)
    const categoriaModificada = {
      id_categoria: 2,
      nombre_categoria: "Ropa Masculina" // Nombre duplicado
    };

    const resultado = editarCategoria(categoriaModificada, listaMockCategorias);

    // DEBE SER FALSO porque el sistema debe rechazar la edición si el nombre ya existe en otra categoría
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain("la categoría con este nombre ya se encuentra en el sistema");
  });

  it("Prueba 3: Rechaza la edición si el nombre contiene solo valores numéricos (no válido)", () => {
    // Intentan guardar el nombre de una categoría usando únicamente números
    const categoriaModificada = {
      id_categoria: 1,
      nombre_categoria: "123456" // N = valores numéricos
    };

    const resultado = editarCategoria(categoriaModificada, listaMockCategorias);

    // DEBE SER FALSO porque infringe la regla de negocio de tu tabla
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain("no puede contener solo valores numéricos");
  });
});