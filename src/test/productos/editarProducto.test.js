const editarProducto = require('./editarProducto');

describe('Validación para editar producto de supermercado', () => {

  const productoOriginal = {
    producto_id: 1,
    nombre: 'Arroz',
    categoria_id: 1,
    existencias: 50,
    precio_compra: '18.00',
    precio_venta: '22.00',
    activo: true
  };

  const productoValido = {
    producto_id: 1,
    nombre: 'Leche',
    categoria_id: 2,
    existencias: 50,
    precio_compra: '25.00',
    precio_venta: '30.00',
    activo: true
  };

  test('No permite editar con campos obligatorios vacíos', () => {
    const productoEditado = {
      producto_id: '',
      nombre: '',
      categoria_id: '',
      existencias: '',
      precio_compra: '',
      precio_venta: '',
      activo: ''
    };

    const resultado = editarProducto(productoEditado, productoOriginal);

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('campos requeridos');
  });

  test('No permite nombre con números o caracteres especiales', () => {
    const resultado = editarProducto(
      { ...productoOriginal, nombre: 'Arroz123' },
      productoOriginal
    );

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('solo debe contener letras');
  });

  test('No permite precio_compra sin punto decimal', () => {
    const resultado = editarProducto(
      { ...productoOriginal, precio_compra: '18' },
      productoOriginal
    );

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('precio de compra');
  });

  test('No permite precio_compra negativo', () => {
    const resultado = editarProducto(
      { ...productoOriginal, precio_compra: '-18.00' },
      productoOriginal
    );

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('precio de compra');
  });

  test('No permite precio_venta sin punto decimal', () => {
    const resultado = editarProducto(
      { ...productoOriginal, precio_venta: '22' },
      productoOriginal
    );

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('precio de venta');
  });

  test('No permite precio_venta negativo', () => {
    const resultado = editarProducto(
      { ...productoOriginal, precio_venta: '-22.00' },
      productoOriginal
    );

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('precio de venta');
  });

  test('No permite precio_venta menor que precio_compra', () => {
    const resultado = editarProducto(
      { ...productoOriginal, precio_compra: '25.00', precio_venta: '22.00' },
      productoOriginal
    );

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('inferior al precio de compra');
  });

  test('Las existencias deben ser número entero', () => {
    const resultado = editarProducto(
      { ...productoOriginal, existencias: 50.5 },
      productoOriginal
    );

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('existencias');
  });

  test('No permite existencias negativas', () => {
    const resultado = editarProducto(
      { ...productoOriginal, existencias: -10 },
      productoOriginal
    );

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('existencias');
  });

  test('No permite modificar existencias directamente', () => {
    const resultado = editarProducto(
      { ...productoOriginal, existencias: 100 },
      productoOriginal
    );

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('existencias directamente');
  });

  test('El campo activo debe ser booleano', () => {
    const resultado = editarProducto(
      { ...productoOriginal, activo: 'si' },
      productoOriginal
    );

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('activo');
  });

  test('Producto de supermercado editado correctamente', () => {
    const resultado = editarProducto(productoValido, productoOriginal);

    expect(resultado.valido).toBe(true);
    expect(resultado.mensaje).toContain('correctamente');
  });

});