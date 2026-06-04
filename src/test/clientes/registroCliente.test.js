const registroCliente = require('./registroCliente');

describe("Validación de Registro de Clientes", () => {

  it("Prueba 1: Debe fallar si el nombre está vacío", () => {
    const cliente = {
      nombre: '',
      apellido: 'Mendoza',
      cedula: '12345678901234',
      celular: '88888888',
      email: 'luis@correo.com'
    };

    const resultado = registroCliente(cliente);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain("nombre es obligatorio");
  });

  it("Prueba 2: Debe fallar si el apellido está vacío", () => {
    const cliente = {
      nombre: 'Luis',
      apellido: '   ', // Espacios vacíos
      cedula: '12345678901234',
      celular: '88888888',
      email: 'luis@correo.com'
    };

    const resultado = registroCliente(cliente);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain("apellido es obligatorio");
  });

  it("Prueba 3: Debe rechazar cédula con menos de 14 dígitos", () => {
    const cliente = {
      nombre: 'Luis',
      apellido: 'Mendoza',
      cedula: '1234567890', // Solo 10 dígitos
      celular: '88888888',
      email: 'luis@correo.com'
    };

    const resultado = registroCliente(cliente);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain("longitud exacta de 14 números");
  });

  it("Prueba 4: Debe rechazar cédula con más de 14 dígitos", () => {
    const cliente = {
      nombre: 'Luis',
      apellido: 'Mendoza',
      cedula: '123456789012345678', // 18 dígitos
      celular: '88888888',
      email: 'luis@correo.com'
    };

    const resultado = registroCliente(cliente);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain("longitud exacta de 14 números");
  });

  it("Prueba 5: Debe rechazar un correo sin arroba o mal ubicado", () => {
    const cliente = {
      nombre: 'Luis',
      apellido: 'Mendoza',
      cedula: '12345678901234',
      celular: '88888888',
      email: 'luis_correo.com@'
    };

    const resultado = registroCliente(cliente);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain("no es válido");
  });

  it("Prueba 6: Permite registrar al cliente si todos los datos cumplen los requisitos", () => {
    const cliente = {
      nombre: 'Luis',
      apellido: 'Mendoza',
      cedula: '12345678901234', // 14 dígitos perfectos
      celular: '88888888',
      email: 'luis.mendoza@correo.com'
    };

    const resultado = registroCliente(cliente);
    expect(resultado.valido).toBe(true);
  });

});