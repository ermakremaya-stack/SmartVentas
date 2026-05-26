import { supabase } from "../database/supabaseconfig";

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
  async obtenerTodos() {
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("cliente_id", { ascending: false });

    if (error) throw error;
    return data || [];
  },

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

    if (error) throw error;
  },

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

    if (error) throw error;
  },

  async eliminar(cliente_id) {
    const { error } = await supabase
      .from("clientes")
      .delete()
      .eq("cliente_id", cliente_id);

    if (error) throw error;
  },
};