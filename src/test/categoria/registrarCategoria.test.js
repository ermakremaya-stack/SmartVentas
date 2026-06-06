const registrarCategoria = require('./registroCategoria');

describe("Validación de Registro de Categorías (Prueba P01 - Caja Blanca)", () => {

  const listaMockCategorias = [
    { id_categoria: 1, nombre_categoria: "Calzado" }
  ];

  // Evalúa: Condición válida (Flujo normal de la tabla)
  it("Prueba 1: Permite registrar una nueva categoría si los datos son válidos", () => {
    const nuevaCategoria = { nombre_categoria: "Camisas" };
    const resultado = registrarCategoria(nuevaCategoria, listaMockCategorias);
    
    expect(resultado.valido).toBe(true);
    expect(resultado.mensaje).toContain("Se registró la nueva categoría exitosamente");
  });

  // Evalúa: Condición de Duplicado = true
  it("Prueba 2: Rechaza el registro si el nombre de la categoría ya existe (Valor existente no válido)", () => {
    const nuevaCategoria = { nombre_categoria: "Calzado" };
    const resultado = registrarCategoria(nuevaCategoria, listaMockCategorias);
    
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain("el nombre ya se encuentra en el sistema");
  });

  // Evalúa: Condición de es numérico = true
  it("Prueba 3: Rechaza el registro si el nombre contiene solo valores numéricos", () => {
    const nuevaCategoria = { nombre_categoria: "12345" };
    const resultado = registrarCategoria(nuevaCategoria, listaMockCategorias);
    
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain("no puede contener solo valores numéricos");
  });

  // Evalúa: Condición de campo obligatorio = true (Para cerrar todas las bifurcaciones lógicas)
  it("Prueba 4: Rechaza el registro si el campo se envía vacío", () => {
    const nuevaCategoria = { nombre_categoria: "" };
    const resultado = registrarCategoria(nuevaCategoria, listaMockCategorias);
    
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain("Completa todos los campos requeridos");
  });
});