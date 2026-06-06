const registroProveedor = require('./registroProveedor');

describe("Validación de Registro de Proveedores (Prueba P03)", () => {

  // Flujo correcto: Datos válidos basados en la tabla
  it("Prueba 1: Permite registrar un proveedor con teléfono y correo válidos", () => {
    const proveedor = {
      numero_proveedor: "88889999",
      correo_proveedor: "proveedor@correo.com"
    };

    const resultado = registroProveedor(proveedor);
    expect(resultado.valido).toBe(true);
    expect(resultado.mensaje).toContain("Teléfono guardado y asignado al proveedor correctamente");
  });

  // N = caracteres “$%PW” (no válido)
  it("Prueba 2: Rechaza el teléfono si contiene caracteres como $%PW", () => {
    const proveedor = {
      numero_proveedor: "8888$%PW",
      correo_proveedor: "proveedor@correo.com"
    };

    const resultado = registroProveedor(proveedor);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain("contiene caracteres no permitidos o espacios");
  });

  // N = más de 8 dígitos (no válido)
  it("Prueba 3: Rechaza el teléfono si tiene más de 8 dígitos", () => {
    const proveedor = {
      numero_proveedor: "123456789",
      correo_proveedor: "proveedor@correo.com"
    };

    const resultado = registroProveedor(proveedor);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain("más de 8 dígitos");
  });

  // N = Espacios múltiples “12 55 22 34 88” (no válido)
  it("Prueba 4: Rechaza el teléfono si contiene espacios múltiples como 12 55 22 34 88", () => {
    const proveedor = {
      numero_proveedor: "12 55 22 34 88",
      correo_proveedor: "proveedor@correo.com"
    };

    const resultado = registroProveedor(proveedor);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain("contiene caracteres no permitidos o espacios");
  });

  // C = No tiene “@” (no válido)
  it("Prueba 5: Rechaza el correo electrónico si no tiene @", () => {
    const proveedor = {
      numero_proveedor: "88889999",
      correo_proveedor: "proveedor_sin_arroba.com"
    };

    const resultado = registroProveedor(proveedor);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain("no tiene '@'");
  });

 
  it("Prueba 6: Rechaza el correo electrónico si contiene caracteres como () : ; < >", () => {
    const proveedor = {
      numero_proveedor: "88889999",
      correo_proveedor: "proveedor()@correo;com" // Incluye arroba pero contiene símbolos prohibidos
    };

    const resultado = registroProveedor(proveedor);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain("El correo electrónico contiene caracteres no válidos.");
  });


  it("Prueba 7: Rechaza el correo electrónico si tiene más de una @", () => {
    const proveedor = {
      numero_proveedor: "88889999",
      correo_proveedor: "proveedor@dos@correo.com"
    };

    const resultado = registroProveedor(proveedor);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain("tiene más de una '@'");
  });
});