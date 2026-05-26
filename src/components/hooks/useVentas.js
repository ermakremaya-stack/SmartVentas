// src/hooks/useVentas.js
import { useState, useEffect } from "react";
import { supabase } from "../../database/supabaseconfig";
import { ventaServicio } from "../../services/ventaServicio"; // Conectamos tu servicio unificado

export const useVentas = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Datos auxiliares
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [productos, setProductos] = useState([]);

  // Cargar Clientes, Empleados y Productos para los Selects
  const cargarDatosAuxiliares = async () => {
    try {
      // 1. Usamos Promise.all para ejecutar en paralelo de forma eficiente
      // 2. Corregimos los .order() usando las columnas reales de tu DB
      const [c, e] = await Promise.all([
        supabase.from("clientes").select("*").order("nombre1", { ascending: true }),
        supabase.from("empleados").select("*").order("nombre_empleado", { ascending: true }) 
      ]);

      setClientes(c.data || []);
      setEmpleados(e.data || []);

      // 3. Contingencia: Invocamos tu método seguro para no depender de tu compañero
      const productosData = await ventaServicio.obtenerProductosParaVenta();
      setProductos(productosData);

    } catch (err) {
      console.error("Error cargando datos auxiliares:", err);
    }
  };

  // Cargar historial de ventas consumiendo directamente tu servicio
  const cargarVentas = async () => {
    try {
      setCargando(true);
      // Usamos el servicio que ya tiene las columnas mapeadas correctamente
      const data = await ventaServicio.obtenerTodas();
      setVentas(data);
    } catch (err) {
      console.error("Error al cargar ventas:", err);
      setToast({ mostrar: true, mensaje: "Error al cargar las ventas", tipo: "error" });
    } finally {
      setCargando(false);
    }
  };

  // Guardar o Actualizar Venta (Lógica transaccional manual corregida)
  const procesarGuardarVenta = async (ventaAEditar, datosVenta, detalles) => {
    try {
      if (ventaAEditar) {
        // === ACTUALIZAR VENTA ===
        // Usamos id_venta (el ID real de la base de datos)
        const { error: errorVenta } = await supabase
          .from("ventas")
          .update({
            cliente_id: datosVenta.cliente_id,
            id_empleado: datosVenta.id_empleado,
            metodo_pago: datosVenta.metodo_pago,
            total: datosVenta.total
          })
          .eq("id_venta", ventaAEditar.id_venta);

        if (errorVenta) throw errorVenta;

        // Limpiar detalles anteriores de cascada e insertar nuevos
        await supabase.from("detalles_ventas").delete().eq("id_venta", ventaAEditar.id_venta);

        const detallesInsert = detalles.map(d => ({
          id_venta: ventaAEditar.id_venta,
          producto_id: d.producto_id,
          cantidad: d.cantidad,
          precio_unitario: d.precio,
          subtotal: d.cantidad * d.precio
        }));

        const { error: errorDetalles } = await supabase.from("detalles_ventas").insert(detallesInsert);
        if (errorDetalles) throw errorDetalles;

        setToast({ mostrar: true, mensaje: "Venta actualizada exitosamente", tipo: "exito" });
      } else {
        // === NUEVA VENTA ===
        // Sincronizado a Zona horaria Managua
        const nicaNow = () => new Date().toLocaleString("sv", { timeZone: "America/Managua" }).replace(" ", "T");

        const { data: ventaData, error: errorNuevaVenta } = await supabase
          .from("ventas")
          .insert([{
            cliente_id: datosVenta.cliente_id,
            id_empleado: datosVenta.id_empleado,
            fecha_venta: nicaNow(),
            metodo_pago: datosVenta.metodo_pago,
            total: datosVenta.total
          }])
          .select()
          .single();

        if (errorNuevaVenta) throw errorNuevaVenta;

        const detallesInsert = detalles.map(d => ({
          id_venta: ventaData.id_venta, // Usamos el id_venta autogenerado retornado por Supabase
          producto_id: d.producto_id,
          cantidad: d.cantidad,
          precio_unitario: d.precio,
          subtotal: d.cantidad * d.precio
        }));

        const { error: errorNuevosDetalles } = await supabase.from("detalles_ventas").insert(detallesInsert);
        if (errorNuevosDetalles) throw errorNuevosDetalles;

        setToast({ mostrar: true, mensaje: "Venta registrada exitosamente", tipo: "exito" });
      }

      await cargarVentas(); // Recargar lista con el servicio limpio
      return true;
    } catch (err) {
      console.error(err);
      setToast({ mostrar: true, mensaje: "Error al guardar la operación", tipo: "error" });
      return false;
    }
  };

  useEffect(() => {
    cargarVentas();
    cargarDatosAuxiliares();
  }, []);

  return {
    ventas,
    cargando,
    clientes,
    empleados,
    productos,
    toast,
    setToast,
    procesarGuardarVenta
  };
};