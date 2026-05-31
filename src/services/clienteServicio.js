import { supabase } from "../database/supabaseconfig";
// Importamos el manejador desde la carpeta centralizada (apuntando al index por defecto)
import { handleSupabaseError } from "../utils/errors";

/**
 * @typedef {Object} Cliente
 * @property {number} [cliente_id] - Identificador único autogenerado.
 * @property {string} nombre1 - Primer nombre.
 * @property {string} [nombre2] - Segundo nombre.
 * @property {string} apellido1 - Primer apellido.
 * @property {string} [apellido2] - Segundo apellido.
 * @property {string} cedula - Cédula de identidad.
 * @property {string} ciudad - Ciudad de residencia.
 * @property {boolean} activo - Estado del cliente.
 */

export const clienteServicio = {
  /**
   * Obtiene todos los clientes registrados ordenados de forma descendente por ID
   * @returns {Promise<Array<Cliente>>} Lista de clientes
   */
  async obtenerTodos() {
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("cliente_id", { ascending: false });

    if (error) {
      const dbError = handleSupabaseError(error);
      console.error(`[clienteServicio][obtenerTodos] ❌:`, dbError.devMessage);
      throw dbError;
    }
    return data || [];
  },

  /**
   * Registra un nuevo cliente en el sistema
   * @param {Cliente} nuevoCliente - Datos del cliente a crear
   */
  async crear(nuevoCliente) {
    const { error } = await supabase
      .from("clientes")
      .insert([
        {
          nombre1: nuevoCliente.nombre1.trim(),
          nombre2: nuevoCliente.nombre2 ? nuevoCliente.nombre2.trim() : null,
          apellido1: nuevoCliente.apellido1.trim(),
          apellido2: nuevoCliente.apellido2 ? nuevoCliente.apellido2.trim() : null,
          cedula: nuevoCliente.cedula.trim(),
          ciudad: nuevoCliente.ciudad.trim(),
          activo: nuevoCliente.activo,
        },
      ]);

    if (error) {
      const dbError = handleSupabaseError(error);
      // Usamos el "Object Literal Shorthand" para empaquetar el input fallido con su etiqueta automática
      console.error(`[clienteServicio][crear] ❌ Falló el registro:`, dbError.devMessage, { nuevoCliente });
      throw dbError;
    }
  },

  /**
   * Actualiza los datos de un cliente existente por su ID
   * @param {Cliente} clienteEditar - Datos modificados del cliente incluyendo su ID
   */
  async actualizar(clienteEditar) {
    const { error } = await supabase
      .from("clientes")
      .update({
        nombre1: clienteEditar.nombre1.trim(),
        nombre2: clienteEditar.nombre2 ? clienteEditar.nombre2.trim() : null,
        apellido1: clienteEditar.apellido1.trim(),
        apellido2: clienteEditar.apellido2 ? clienteEditar.apellido2.trim() : null,
        cedula: clienteEditar.cedula.trim(),
        ciudad: clienteEditar.ciudad.trim(),
        activo: clienteEditar.activo,
      })
      .eq("cliente_id", clienteEditar.cliente_id);

    if (error) {
      const dbError = handleSupabaseError(error);
      console.error(`[clienteServicio][actualizar] ❌ Error en ID ${clienteEditar.cliente_id}:`, dbError.devMessage, { clienteEditar });
      throw dbError;
    }
  },

  /**
   * Elimina (o desactiva) un cliente de la base de datos por su identificador único
   * @param {number} cliente_id - ID del cliente a eliminar
   */
  async eliminar(cliente_id) {
    const { error } = await supabase
      .from("clientes")
      .delete()
      .eq("cliente_id", cliente_id);

    if (error) {
      const dbError = handleSupabaseError(error);
      // Guardamos la variable suelta dentro del objeto para que en consola salga "cliente_id: X"
      console.error(`[clienteServicio][eliminar] ❌ No se pudo borrar:`, dbError.devMessage, { cliente_id });
      throw dbError;
    }
  },
};