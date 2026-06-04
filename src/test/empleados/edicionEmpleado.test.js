const edicionEmpleado = require('./edicionEmpleado');

describe("Validación de Edición de Empleados", () => {
  
  // Nuestra base de datos simulada tiene dos empleados guardados
  const listaMockSupabase = [
    { id_empleado: 1, nombre_empleado: "Juan", apellido_empleado: "Pérez", email: "juan@correo.com" },
    { id_empleado: 2, nombre_empleado: "María", apellido_empleado: "López", email: "maria@correo.com" }
  ];

  it("Prueba 1: Permite actualizar datos si el nombre sigue siendo el mismo del propio usuario", () => {
    // Juan (ID: 1) cambia su teléfono y email, pero deja su mismo nombre
    const empleadoModificado = {
      id_empleado: 1, 
      nombre_empleado: "Juan", 
      apellido_empleado: "Pérez",
      email: "juan.nuevo@correo.com", // Cambió correo
      celular: '88889999',            // Cambió celular
      pin: '1234',
      tipo_empleado: 'Cajero'
    };

    const resultado = edicionEmpleado(empleadoModificado, listaMockSupabase);
    // DEBE SER VERDADERO porque no se está duplicando con "otra" persona, es él mismo
    expect(resultado.valido).toBe(true);
  });

  it("Prueba 2: Rechaza la edición si intenta usar el nombre de OTRO empleado", () => {
    // María (ID: 2) intenta cambiarse el nombre a "Juan Pérez"
    const empleadoModificado = {
      id_empleado: 2, 
      nombre_empleado: "Juan", // Nombre de la persona del ID 1
      apellido_empleado: "Pérez",
      email: "maria@correo.com",
      celular: '77777777',
      pin: '4321',
      tipo_empleado: 'Vendedor'
    };

    const resultado = edicionEmpleado(empleadoModificado, listaMockSupabase);
    // DEBE SER FALSO porque "Juan Pérez" ya le pertenece al ID 1
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain("ya está registrado");
  });

  it("Prueba 3: Mantiene las validaciones de correo (arroba inválida)", () => {
    const empleadoModificado = {
      id_empleado: 1,
      nombre_empleado: "Juan",
      apellido_empleado: "Pérez",
      email: "juan_sin_arroba.com",
      celular: '88889999',
      pin: '1234',
      tipo_empleado: 'Cajero'
    };

    const resultado = edicionEmpleado(empleadoModificado, listaMockSupabase);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain("no es válido");
  });
});