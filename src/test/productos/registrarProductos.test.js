const registrarProductos = require('./registrarProductos');

console.log('Prueba 1: El producto no se registra con campos vacíos');

describe('Validación de producto', () => {

  it('No permite guardar con campos obligatorios vacíos', () => {
    const producto = {
      nombre: '',
      categoria_id: '',
      existencias: '',
      precio_compra: '',
      precio_venta: '',
      activo: ''
    };

    const resultado = registrarProductos(producto);

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('campos requeridos');
  });

  console.log('Prueba 2: El nombre del producto solo debe contener letras');

  it('Debe rechazar nombre con números o caracteres especiales', () => {
    const producto = {
      nombre: 'Martillo123',
      categoria_id: 1,
      existencias: 10,
      precio_compra: '80.00',
      precio_venta: '100.00',
      activo: true
    };

    const resultado = registrarProductos(producto);

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('solo debe contener letras');
  });

  console.log('Prueba 3: El precio de compra debe ser decimal con punto');

  it('No permite precio_compra sin punto decimal', () => {
    const producto = {
      nombre: 'Martillo',
      categoria_id: 1,
      existencias: 10,
      precio_compra: '80',
      precio_venta: '100.00',
      activo: true
    };

    const resultado = registrarProductos(producto);

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('precio de compra');
  });

  console.log('Prueba 4: El precio de compra no puede ser negativo');

  it('Debe rechazar precio_compra negativo', () => {
    const producto = {
      nombre: 'Martillo',
      categoria_id: 1,
      existencias: 10,
      precio_compra: '-80.00',
      precio_venta: '100.00',
      activo: true
    };

    const resultado = registrarProductos(producto);

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('precio de compra');
  });

  console.log('Prueba 5: El precio de venta debe ser decimal con punto');

  it('No permite precio_venta sin punto decimal', () => {
    const producto = {
      nombre: 'Martillo',
      categoria_id: 1,
      existencias: 10,
      precio_compra: '80.00',
      precio_venta: '100',
      activo: true
    };

    const resultado = registrarProductos(producto);

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('precio de venta');
  });

  console.log('Prueba 6: El precio de venta no puede ser negativo');

  it('Debe rechazar precio_venta negativo', () => {
    const producto = {
      nombre: 'Martillo',
      categoria_id: 1,
      existencias: 10,
      precio_compra: '80.00',
      precio_venta: '-100.00',
      activo: true
    };

    const resultado = registrarProductos(producto);

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('precio de venta');
  });

  console.log('Prueba 7: El precio de venta no puede ser inferior al precio de compra');

  it('Debe rechazar precio_venta menor que precio_compra', () => {
    const producto = {
      nombre: 'Martillo',
      categoria_id: 1,
      existencias: 10,
      precio_compra: '120.00',
      precio_venta: '100.00',
      activo: true
    };

    const resultado = registrarProductos(producto);

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('inferior al precio de compra');
  });

  console.log('Prueba 8: Las existencias deben ser número entero');

  it('Debe rechazar existencias con decimales', () => {
    const producto = {
      nombre: 'Martillo',
      categoria_id: 1,
      existencias: 5.5,
      precio_compra: '80.00',
      precio_venta: '100.00',
      activo: true
    };

    const resultado = registrarProductos(producto);

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('existencias');
  });

  console.log('Prueba 9: El campo activo debe ser booleano');

  it('Debe rechazar activo si no es booleano', () => {
    const producto = {
      nombre: 'Martillo',
      categoria_id: 1,
      existencias: 10,
      precio_compra: '80.00',
      precio_venta: '100.00',
      activo: 'si'
    };

    const resultado = registrarProductos(producto);

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('activo');
  });

  console.log('Prueba 10: Producto registrado correctamente');

  it('Agregar producto correctamente', () => {
    const producto = {
      nombre: 'Martillo',
      categoria_id: 1,
      existencias: 10,
      precio_compra: '80.00',
      precio_venta: '100.00',
      activo: true
    };

    const resultado = registrarProductos(producto);

    expect(resultado.valido).toBe(true);
  });

});