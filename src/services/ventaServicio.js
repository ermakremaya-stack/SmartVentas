import { supabase } from "../database/supabaseconfig";

/**
 * @typedef {Object} DetalleVenta
 * @property {number} [id_detalle] - ID único del detalle autogenerado.
 * @property {number} id_venta - ID de la venta asociada.
 * @property {number} producto_id - ID del producto vendido.
 * @property {number} cantidad - Cantidad vendida.
 * @property {number} precio_unitario - Precio al momento de la venta.
 * @property {number} subtotal - Subtotal (cantidad * precio_unitario).
 */

/**
 * @typedef {Object} Venta
 * @property {number} [id_venta] - Identificador único autogenerado.
 * @property {number} cliente_id - ID del cliente asociado.
 * @property {number} id_empleado - ID del empleado que realiza la venta.
 * @property {string} fecha_venta - Fecha y hora de la transacción.
 * @property {string} metodo_pago - Método de pago utilizado ('efectivo', etc).
 * @property {number} total - Monto total de la venta.
 */

export const ventaServicio = {
  /**
   * Obtiene todas las ventas incluyendo las columnas específicas del cliente relacionado
   */
  async obtenerTodas() {
    const { data, error } = await supabase
  .from("ventas")
  .select(`
    id_venta,
    cliente_id,
    id_empleado,
    fecha_venta,
    metodo_pago,
    total,
    clientes (
      nombre1,
      apellido1,
      cedula
    )
  `)
  .order("id_venta", { ascending: false });
  
    if (error) throw error;
    return data || [];
  },

  /**
   * Registra una nueva venta en el sistema
   */
  async crear(nuevaVenta) {
    const { error } = await supabase
      .from("ventas")
      .insert([
        {
          cliente_id: nuevaVenta.cliente_id,
          id_empleado: nuevaVenta.id_empleado,
          metodo_pago: nuevaVenta.metodo_pago ? nuevaVenta.metodo_pago.trim() : "efectivo",
          total: Number(nuevaVenta.total),
          // fecha_venta se maneja por DEFAULT CURRENT_TIMESTAMP en Postgres
        },
      ]);

    if (error) throw error;
  },

  /**
   * Actualiza los datos generales de una venta existente
   */
  async actualizar(ventaEditar) {
    const { error } = await supabase
      .from("ventas")
      .update({
        cliente_id: ventaEditar.cliente_id,
        id_empleado: ventaEditar.id_empleado,
        metodo_pago: ventaEditar.metodo_pago ? ventaEditar.metodo_pago.trim() : "efectivo",
        total: Number(ventaEditar.total),
      })
      .eq("id_venta", ventaEditar.id_venta);

    if (error) throw error;
  },

  /**
   * Elimina un registro de venta por su identificador primario
   */
  async eliminar(id_venta) {
    const { error } = await supabase
      .from("ventas")
      .delete()
      .eq("id_venta", id_venta);

    if (error) throw error;
  },


/**
   * TEMPORAL: Obtiene la lista de productos para desbloquear el desarrollo de Ventas
   */
  async obtenerProductosParaVenta() {
    const { data, error } = await supabase
      .from("productos")
      .select("producto_id, nombre_producto, precio_venta, stock") // Ajusta los nombres a tu DB
      .order("nombre_producto", { ascending: true });

    if (error) {
      console.warn("⚠️ No se pudo conectar a la tabla productos de Supabase. Usando datos simulados.");
      // SI LA TABLA NO EXISTE EN SUPABASE AÚN, DEVOLVEMOS DATOS DE PRUEBA LOCALES:
      return [
        { producto_id: 1, nombre_producto: "Producto Demo A", precio_venta: 15.50, stock: 100 },
        { producto_id: 2, nombre_producto: "Producto Demo B", precio_venta: 45.00, stock: 50 },
        { producto_id: 3, nombre_producto: "Producto Demo C", precio_venta: 120.00, stock: 12 }
      ];
    }
    
    return data || [];
  }
}