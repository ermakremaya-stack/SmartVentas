/**
 * @fileoverview Punto de entrada único (Módulo Barril) del directorio actual.
 * Centraliza y re-exporta los servicios, hooks y componentes para simplificar
 * las rutas de importación en toda la aplicación utilizando alias.
 */

/** * Servicio para la gestión de operaciones CRUD de la tabla Clientes.
 * @exports clienteServicio 
 */
export { clienteServicio } from './clienteServicio.js'

/** * Servicio para la gestión de transacciones y registros de Ventas.
 * @exports ventaServicio 
 */
export { ventaServicio } from './ventaServicio.js'