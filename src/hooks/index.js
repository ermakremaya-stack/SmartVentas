/**
 * @fileoverview Punto de entrada único (Módulo Barril) del directorio actual.
 * Centraliza y re-exporta los servicios, hooks y componentes para simplificar
 * las rutas de importación en toda la aplicación utilizando alias.
 */

/** * Hook personalizado para manejar el estado, consultas y mutaciones de clientes.
 * @exports useClientes 
 */
export { useClientes } from './useClientes.js'

/** * Hook personalizado para gestionar el flujo de caja, carrito o estado de ventas.
 * @exports useVentas 
 */
export { useVentas } from './useVentas.js'
export * from './usePDFGenerator.js';