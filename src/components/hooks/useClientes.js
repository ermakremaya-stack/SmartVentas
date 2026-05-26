import { useState, useEffect, useMemo } from "react";
import { clienteServicio } from "../../services/clienteServicio";

const estructuraClienteInicial = {
  nombre1: "",
  nombre2: "",
  apellido1: "",
  apellido2: "",
  cedula: "",
  ciudad: "",
  activo: true, // Por defecto se registra como activo
};

export const useClientes = (notificar) => {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

  const [nuevoCliente, setNuevoCliente] = useState(estructuraClienteInicial);
  const [clienteEditar, setClienteEditar] = useState(estructuraClienteInicial);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);

  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setCargando(true);
      const data = await clienteServicio.obtenerTodos();
      setClientes(data);
    } catch (error) {
      notificar({ mostrar: true, message: `Error al cargar clientes: ${error.message}`, tipo: "error" });
    } finally {
      setCargando(false);
    }
  };

  const manejoCambioInput = (e) => {
    const { name, value, type, checked } = e.target;
    setNuevoCliente((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value, type, checked } = e.target;
    setClienteEditar((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  const manejarCambioBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
    setPaginaActual(1);
  };

  const agregarCliente = async () => {
    try {
      await clienteServicio.crear(nuevoCliente);
      await cargarClientes();
      setMostrarModal(false);
      setNuevoCliente(estructuraClienteInicial);
      notificar({ mostrar: true, message: "Cliente registrado exitosamente.", tipo: "exito" });
    } catch (error) {
      notificar({ mostrar: true, message: `No se pudo registrar el cliente: ${error.message}`, tipo: "error" });
    }
  };

  const actualizarCliente = async () => {
    try {
      await clienteServicio.actualizar(clienteEditar);
      await cargarClientes();
      setMostrarModalEdicion(false);
      notificar({ mostrar: true, message: "Cliente actualizado correctamente.", tipo: "exito" });
    } catch (error) {
      notificar({ mostrar: true, message: `Error al actualizar cliente: ${error.message}`, tipo: "error" });
    }
  };

  const eliminarCliente = async () => {
    if (!clienteAEliminar) return;
    try {
      await clienteServicio.eliminar(clienteAEliminar.cliente_id);
      await cargarClientes();
      setMostrarModalEliminacion(false);
      setClienteAEliminar(null);
      notificar({ mostrar: true, message: "Cliente eliminado del sistema.", tipo: "exito" });
    } catch (error) {
      notificar({ mostrar: true, message: `Error al eliminar cliente: ${error.message}`, tipo: "error" });
    }
  };

  const abrirModalEdicion = (cliente) => {
    setClienteEditar({ ...cliente });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (cliente) => {
    setClienteAEliminar(cliente);
    setMostrarModalEliminacion(true);
  };

  // Motor de búsqueda adaptado a los nuevos campos obligatorios y opcionales
  const clientesFiltrados = useMemo(() => {
    const termino = textoBusqueda.toLowerCase().trim();
    if (!termino) return clientes;
    return clientes.filter((c) => {
      const n1 = c.nombre1?.toLowerCase() || "";
      const n2 = c.nombre2?.toLowerCase() || "";
      const a1 = c.apellido1?.toLowerCase() || "";
      const a2 = c.apellido2?.toLowerCase() || "";
      const ced = c.cedula?.toLowerCase() || "";
      const ciu = c.ciudad?.toLowerCase() || "";

      return n1.includes(termino) || 
             n2.includes(termino) || 
             a1.includes(termino) || 
             a2.includes(termino) || 
             ced.includes(termino) || 
             ciu.includes(termino);
    });
  }, [textoBusqueda, clientes]);

  const clientesPaginados = useMemo(() => {
    const indiceInicio = (paginaActual - 1) * registrosPorPagina;
    const indiceFin = indiceInicio + registrosPorPagina;
    return clientesFiltrados.slice(indiceInicio, indiceFin);
  }, [clientesFiltrados, paginaActual, registrosPorPagina]);

  return {
    clientes,
    clientesFiltrados,
    clientesPaginados,
    cargando,
    textoBusqueda,
    manejarCambioBusqueda,
    mostrarModal,
    setMostrarModal,
    nuevoCliente,
    manejoCambioInput,
    agregarCliente,
    mostrarModalEdicion,
    setMostrarModalEdicion,
    clienteEditar,
    manejoCambioInputEdicion,
    actualizarCliente,
    abrirModalEdicion,
    mostrarModalEliminacion,
    setMostrarModalEliminacion,
    clienteAEliminar,
    eliminarCliente,
    abrirModalEliminacion,
    registrosPorPagina,
    setRegistrosPorPagina,
    paginaActual,
    setPaginaActual,
  };
};