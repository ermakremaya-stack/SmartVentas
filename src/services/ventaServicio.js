import { supabase } from "../database/supabaseconfig";
import { handleSupabaseError } from "../components/utils/errors";

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
   * @returns {Promise<Array>} Lista de ventas formateadas
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
  
    if (error) {
      // 2. Traducimos el error crudo
      const dbError = handleSupabaseError(error);
      // 3. Imprimimos el mensaje técnico exacto para desarrollo
      console.error(`[ventaServicio][obtenerTodas] ❌:`, dbError.devMessage);
      // 4. Lanzamos el error robusto
      throw dbError;
    }
    return data || [];
  },

  /**
   * Registra una nueva venta en el sistema
   * @param {Venta} nuevaVenta - Objeto con los datos de la venta a registrar
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
        },
      ]);

    if (error) {
      const dbError = handleSupabaseError(error);
      console.error(`[ventaServicio][crear] ❌ Falló el registro:`, dbError.devMessage, { dataInput: nuevaVenta });
      throw dbError;
    }
  },

  /**
   * Actualiza los datos generales de una venta existente
   * @param {Venta} ventaEditar - Objeto con los datos modificados de la venta
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

    if (error) {
      const dbError = handleSupabaseError(error);
      console.error(`[ventaServicio][actualizar] ❌ Error en ID ${ventaEditar.id_venta}:`, dbError.devMessage);
      throw dbError;
    }
  },

  /**
   * Elimina un registro de venta por su identificador primario
   * @param {number} id_venta - Identificador de la venta
   */
  async eliminar(id_venta) {
    const { error } = await supabase
      .from("ventas")
      .delete()
      .eq("id_venta", id_venta);

    if (error) {
      const dbError = handleSupabaseError(error);
      console.error(`[ventaServicio][eliminar] ❌ No se pudo borrar el ID ${id_venta}:`, dbError.devMessage);
      throw dbError;
    }
  },

  /**
   * TEMPORAL: Obtiene la lista de productos para desbloquear el desarrollo de Ventas
   */
  async obtenerProductosParaVenta() {
    const { data, error } = await supabase
      .from("productos")
      .select("producto_id, nombre_producto, precio_venta, stock")
      .order("nombre_producto", { ascending: true });

    if (error) {
      // En este método específico tenías un fallback (datos simulados). 
      // Igual podemos traducir el error para imprimirlo de forma ultra profesional.
      const dbError = handleSupabaseError(error);
      console.warn(`⚠️ [ventaServicio][obtenerProductosParaVenta]: ${dbError.devMessage}. Usando fallback local.`);
      
      return [
        { producto_id: 1, nombre_producto: "Producto Demo A", precio_venta: 15.50, stock: 100 },
        { producto_id: 2, nombre_producto: "Producto Demo B", precio_venta: 45.00, stock: 50 },
        { producto_id: 3, nombre_producto: "Producto Demo C", precio_venta: 120.00, stock: 12 }
      ];
    }
    
    return data || [];
  }
};