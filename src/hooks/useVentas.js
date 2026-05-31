// src/hooks/useVentas.js
import { useState, useEffect } from "react";
import { supabase } from "../database/supabaseconfig";
import { ventaServicio } from "@/services";

export const useVentas = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Datos auxiliares para poblar los selectores del formulario
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [productos, setProductos] = useState([]);

  // Cargar Clientes, Empleados y Productos en paralelo
  const cargarDatosAuxiliares = async () => {
    try {
      const [c, e] = await Promise.all([
        supabase.from("clientes").select("*").order("nombre1", { ascending: true }),
        supabase.from("empleados").select("*").order("nombre_empleado", { ascending: true }) 
      ]);

      setClientes(c.data || []);
      setEmpleados(e.data || []);

      // Contingencia: Invocamos tu método seguro para los productos
      const productosData = await ventaServicio.obtenerProductosParaVenta();
      setProductos(productosData);
    } catch (err) {
      console.error("❌ Error cargando datos auxiliares en el Hook:", err);
    }
  };

  // Cargar historial de ventas con la sub-tabla de detalles incluida
  const cargarVentas = async () => {
    try {
      setCargando(true);
      const data = await ventaServicio.obtenerTodas();
      setVentas(data);
    } catch (err) {
      console.error("❌ Error al cargar ventas desde el Hook:", err);
      setToast({ mostrar: true, mensaje: "Error al cargar las ventas de la base de datos", tipo: "error" });
    } finally {
      setCargando(false);
    }
  };

  // Guardar o Actualizar Venta (Lógica transaccional unificada)
  const procesarGuardarVenta = async (ventaAEditar, datosVenta, detalles) => {
    try {
      if (ventaAEditar) {
        // === MODO: ACTUALIZAR VENTA EXISTENTE ===
        const { error: errorVenta } = await supabase
          .from("ventas")
          .update({
            cliente_id: Number(datosVenta.cliente_id),
            id_empleado: Number(datosVenta.id_empleado),
            metodo_pago: datosVenta.metodo_pago,
            total: Number(datosVenta.total)
          })
          .eq("id_venta", ventaAEditar.id_venta);

        if (errorVenta) throw errorVenta;

        // 1. Limpiar el detalle histórico para evitar duplicidad de llaves primarias
        const { error: errorBorrado } = await supabase
          .from("detalles_ventas")
          .delete()
          .eq("id_venta", ventaAEditar.id_venta);
          
        if (errorBorrado) throw errorBorrado;

        // 2. Mapear e insertar el nuevo estado del carrito de compras
        const detallesInsert = detalles.map(d => ({
          id_venta: ventaAEditar.id_venta,
          producto_id: Number(d.producto_id),
          cantidad: Number(d.cantidad),
          precio_unitario: Number(d.precio),
          subtotal: Number(d.cantidad * d.precio)
        }));

        const { error: errorDetalles } = await supabase.from("detalles_ventas").insert(detallesInsert);
        if (errorDetalles) throw errorDetalles;

        setToast({ mostrar: true, mensaje: "Venta modificada exitosamente", tipo: "exito" });
      } else {
        // === MODO: REGISTRAR NUEVA VENTA ===
        const nicaNow = () => new Date().toLocaleString("sv", { timeZone: "America/Managua" }).replace(" ", "T");

        const { data: ventaData, error: errorNuevaVenta } = await supabase
          .from("ventas")
          .insert([{
            cliente_id: Number(datosVenta.cliente_id),
            id_empleado: Number(datosVenta.id_empleado),
            fecha_venta: nicaNow(),
            metodo_pago: datosVenta.metodo_pago,
            total: Number(datosVenta.total)
          }])
          .select()
          .single();

        if (errorNuevaVenta) throw errorNuevaVenta;

        const detallesInsert = detalles.map(d => ({
          id_venta: ventaData.id_venta, 
          producto_id: Number(d.producto_id),
          cantidad: Number(d.cantidad),
          precio_unitario: Number(d.precio),
          subtotal: Number(d.cantidad * d.precio)
        }));

        const { error: errorNuevosDetalles } = await supabase.from("detalles_ventas").insert(detallesInsert);
        if (errorNuevosDetalles) throw errorNuevosDetalles;

        setToast({ mostrar: true, mensaje: "Factura procesada con éxito", tipo: "exito" });
      }

      await cargarVentas(); // Recarga reactiva de la grilla principal
      return true;
    } catch (err) {
      console.error("❌ Falló la operación en Supabase:", err);
      setToast({ mostrar: true, mensaje: "Error crítico al guardar la operación", tipo: "error" });
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