const registroEmpleado = require('./registroEmpleados');

describe("Validación de Registro de Empleados", () => {
  
  // Simulamos unos datos que ya están guardados en Supabase
  const listaMockSupabase = [
    { nombre_empleado: "Juan", apellido_empleado: "Pérez", email: "juan@correo.com" }
  ];

  it("Prueba 1: No permite guardar con campos vacíos", () => {
    const empleado = {
      nombre_empleado: '',
      apellido_empleado: 'García',
      email: 'garcia@correo.com',
      celular: '88888888',
      pin: '1234',
      tipo_empleado: 'Cajero'
    };

    const resultado = registroEmpleado(empleado, listaMockSupabase);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain("campos requeridos");
  });

  it("Prueba 2: Rechaza correo con @ al inicio", () => {
    const empleado = {
      nombre_empleado: 'Luis',
      apellido_empleado: 'Mendoza',
      email: '@correo.com',
      celular: '88888888',
      pin: '1234',
      tipo_empleado: 'Administrador'
    };

    const resultado = registroEmpleado(empleado, listaMockSupabase);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain("no es válido");
  });

  it("Prueba 3: Rechaza correo con @ al final", () => {
    const empleado = {
      nombre_empleado: 'Luis',
      apellido_empleado: 'Mendoza',
      email: 'luiscorreo.com@',
      celular: '88888888',
      pin: '1234',
      tipo_empleado: 'Administrador'
    };

    const resultado = registroEmpleado(empleado, listaMockSupabase);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain("no es válido");
  });

  it("Prueba 4: Rechaza correo sin @", () => {
    const empleado = {
      nombre_empleado: 'Luis',
      apellido_empleado: 'Mendoza',
      email: 'luiscorreo.com',
      celular: '88888888',
      pin: '1234',
      tipo_empleado: 'Administrador'
    };

    const resultado = registroEmpleado(empleado, listaMockSupabase);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain("no es válido");
  });

  it("Prueba 5: No permite registrar un nombre completo que ya existe", () => {
    // Intentamos registrar a "Juan Pérez", que ya está en nuestra listaMockSupabase
    const empleado = {
      nombre_empleado: 'Juan', 
      apellido_empleado: 'Pérez',
      email: 'juan.nuevo@correo.com',
      celular: '77777777',
      pin: '4321',
      tipo_empleado: 'Vendedor'
    };

    const resultado = registroEmpleado(empleado, listaMockSupabase);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain("ya está registrado");
  });

  it("Prueba 6: Permite registrar un empleado con datos correctos y únicos", () => {
    const empleado = {
      nombre_empleado: 'Carlos',
      apellido_empleado: 'López',
      email: 'carlos@correo.com',
      celular: '55555555',
      pin: '9999',
      tipo_empleado: 'Bodeguero'
    };

    const resultado = registroEmpleado(empleado, listaMockSupabase);
    expect(resultado.valido).toBe(true);
  });

});