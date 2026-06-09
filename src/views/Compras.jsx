import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import NotificationOperation from "../components/NotificationOperation";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ornedamiento/Paginacion";
import TablaCompras from "../components/compras/TablaCompras";
import TarjetaCompra from "../components/compras/TarjetaCompra";
import FormularioCompra from "../components/compras/FormularioCompra";

const Compras = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [compras, setCompras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [compraAEditar, setCompraAEditar] = useState(null);

  const [proveedores, setProveedores] = useState([]);
  const [empleados, setEmpleados] = useState([]);

  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [numeroFacturaProveedor, setNumeroFacturaProveedor] = useState("");
  const [totalCompra, setTotalCompra] = useState(0);
  const [fechaCompra, setFechaCompra] = useState("");

  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [comprasFiltradas, setComprasFiltradas] = useState([]);
  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(8);
  const [paginaActual, establecerPaginaActual] = useState(1);

  const comprasPaginadas = comprasFiltradas.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  const obtenerIdProveedor = (proveedor) => proveedor?.proveedor_id ?? proveedor?.id_proveedor;
  const obtenerIdEmpleado = (empleado) => empleado?.empleado_id ?? empleado?.id_empleado;

  const obtenerNombreProveedor = (proveedor) => {
    if (!proveedor) return "Sin proveedor";

    return (
      proveedor.nombre_proveedor ||
      proveedor.razon_social ||
      proveedor.nombre ||
      proveedor.empresa ||
      "Proveedor"
    );
  };

  const obtenerNombreEmpleado = (empleado) => {
    if (!empleado) return "Sin empleado";

    return `${empleado.nombre_empleado || empleado.nombre || ""} ${
      empleado.apellido_empleado || empleado.apellido || ""
    }`.trim() || "Empleado";
  };

  const nicaNow = () =>
    new Date()
      .toLocaleString("sv-SE", { timeZone: "America/Managua" })
      .replace(" ", "T")
      .slice(0, 16);

  const formatearFechaInput = (fecha) => {
    if (!fecha) return nicaNow();
    return fecha.replace(" ", "T").slice(0, 16);
  };

  const cargarDatosAuxiliares = async () => {
    try {
      const [p, e] = await Promise.all([
        supabase.from("proveedores").select("*"),
        supabase.from("empleados").select("*")
      ]);

      setProveedores(p.data || []);
      setEmpleados(e.data || []);
    } catch (err) {
      console.error("Error cargando auxiliares:", err);
      setToast({
        mostrar: true,
        mensaje: "Error al cargar proveedores o empleados",
        tipo: "error"
      });
    }
  };

  const cargarCompras = async () => {
    try {
      setCargando(true);

      const { data, error } = await supabase
        .from("compras")
        .select(`
          *,
          proveedores (*),
          empleados (*)
        `)
        .eq("activo", true)
        .order("fecha_compra", { ascending: false });

      if (error) {
        console.error("Error al cargar compras:", error);
        setToast({
          mostrar: true,
          mensaje: "Error al cargar compras",
          tipo: "error"
        });
        return;
      }

      setCompras(data || []);
    } catch (err) {
      console.error(err);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al cargar compras",
        tipo: "error"
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCompras();
    cargarDatosAuxiliares();
  }, []);

  useEffect(() => {
    if (compraAEditar) {
      const proveedor = proveedores.find(
        (p) => obtenerIdProveedor(p) === compraAEditar.proveedor_id
      );

      const empleado = empleados.find(
        (e) => obtenerIdEmpleado(e) === compraAEditar.empleado_id
      );

      setProveedorSeleccionado(proveedor || null);
      setEmpleadoSeleccionado(empleado || null);
      setNumeroFacturaProveedor(compraAEditar.numero_factura_proveedor || "");
      setTotalCompra(Number(compraAEditar.total_compra) || 0);
      setFechaCompra(formatearFechaInput(compraAEditar.fecha_compra));
    }
  }, [compraAEditar, proveedores, empleados]);

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setComprasFiltradas(compras);
    } else {
      const textoLower = textoBusqueda.toLowerCase();

      const filtradas = compras.filter((compra) => {
        const proveedor = obtenerNombreProveedor(compra.proveedores).toLowerCase();
        const empleado = obtenerNombreEmpleado(compra.empleados).toLowerCase();
        const factura = compra.numero_factura_proveedor?.toLowerCase() || "";

        return (
          proveedor.includes(textoLower) ||
          empleado.includes(textoLower) ||
          factura.includes(textoLower)
        );
      });

      setComprasFiltradas(filtradas);
    }

    establecerPaginaActual(1);
  }, [textoBusqueda, compras]);

  const resetFormulario = () => {
    setProveedorSeleccionado(null);
    setEmpleadoSeleccionado(null);
    setNumeroFacturaProveedor("");
    setTotalCompra(0);
    setFechaCompra(nicaNow());
    setCompraAEditar(null);
  };

  const abrirNuevaCompra = () => {
    resetFormulario();
    setMostrarFormulario(true);
  };

  const abrirEdicion = (compra) => {
    setCompraAEditar(compra);
    setMostrarFormulario(true);
  };

  const guardarCompra = async () => {
    if (
      !proveedorSeleccionado ||
      !empleadoSeleccionado ||
      !numeroFacturaProveedor.trim() ||
      Number(totalCompra) <= 0
    ) {
      setToast({
        mostrar: true,
        mensaje: "Faltan datos obligatorios",
        tipo: "advertencia"
      });
      return;
    }

    try {
      const datosCompra = {
        proveedor_id: obtenerIdProveedor(proveedorSeleccionado),
        empleado_id: obtenerIdEmpleado(empleadoSeleccionado),
        fecha_compra: fechaCompra || nicaNow(),
        total_compra: Number(totalCompra),
        numero_factura_proveedor: numeroFacturaProveedor.trim(),
        activo: true
      };

      if (compraAEditar) {
        const { error } = await supabase
          .from("compras")
          .update(datosCompra)
          .eq("compra_id", compraAEditar.compra_id);

        if (error) throw error;

        setToast({
          mostrar: true,
          mensaje: "Compra actualizada exitosamente",
          tipo: "exito"
        });
      } else {
        const { error } = await supabase.from("compras").insert([datosCompra]);

        if (error) throw error;

        setToast({
          mostrar: true,
          mensaje: "Compra registrada exitosamente",
          tipo: "exito"
        });
      }

      resetFormulario();
      setMostrarFormulario(false);
      await cargarCompras();
    } catch (err) {
      console.error(err);
      setToast({
        mostrar: true,
        mensaje: "Error al guardar la compra",
        tipo: "error"
      });
    }
  };

  const eliminarCompra = async (compra) => {
    const confirmar = window.confirm(
      `¿Desea eliminar la compra con factura ${compra.numero_factura_proveedor}?`
    );

    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from("compras")
        .update({ activo: false })
        .eq("compra_id", compra.compra_id);

      if (error) throw error;

      setToast({
        mostrar: true,
        mensaje: "Compra eliminada exitosamente",
        tipo: "exito"
      });

      await cargarCompras();
    } catch (err) {
      console.error(err);
      setToast({
        mostrar: true,
        mensaje: "Error al eliminar la compra",
        tipo: "error"
      });
    }
  };

  const manejarBusqueda = (e) => setTextoBusqueda(e.target.value);

  return (
    <Container className="mt-3">
      <Row className="align-items-center mb-3">
        <Col xs={8} lg={8}>
          <h3 className="mb-0">
            <i className="bi bi-bag-check me-2"></i> Compras
          </h3>
        </Col>

        <Col xs={4} lg={4} className="text-end">
          <Button onClick={abrirNuevaCompra} size="md">
            <i className="bi bi-plus-lg"></i>
            <span className="d-none d-sm-inline ms-2">Nueva Compra</span>
          </Button>
        </Col>
      </Row>

      <hr />

      <Row className="mb-4">
        <Col md={6} lg={5}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarBusqueda}
            placeholder="Buscar por proveedor, empleado o factura..."
          />
        </Col>
      </Row>

      {cargando ? (
        <Row className="text-center my-5">
          <Spinner animation="border" variant="success" size="lg" />
          <p className="mt-3 text-muted">Cargando compras...</p>
        </Row>
      ) : (
        <Row>
          <Col xs={12} className="d-lg-none">
            <TarjetaCompra
              compras={comprasPaginadas}
              abrirEdicion={abrirEdicion}
              eliminarCompra={eliminarCompra}
            />
          </Col>

          <Col lg={12} className="d-none d-lg-block">
            <TablaCompras
              compras={comprasPaginadas}
              abrirEdicion={abrirEdicion}
              eliminarCompra={eliminarCompra}
            />
          </Col>
        </Row>
      )}

      {comprasFiltradas.length > 0 && (
        <Paginacion
          registrosPorPagina={registrosPorPagina}
          totalRegistros={comprasFiltradas.length}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          establecerRegistrosPorPagina={establecerRegistrosPorPagina}
        />
      )}

      <FormularioCompra
        mostrar={mostrarFormulario}
        setMostrar={setMostrarFormulario}
        proveedores={proveedores}
        empleados={empleados}
        proveedorSeleccionado={proveedorSeleccionado}
        setProveedorSeleccionado={setProveedorSeleccionado}
        empleadoSeleccionado={empleadoSeleccionado}
        setEmpleadoSeleccionado={setEmpleadoSeleccionado}
        numeroFacturaProveedor={numeroFacturaProveedor}
        setNumeroFacturaProveedor={setNumeroFacturaProveedor}
        totalCompra={totalCompra}
        setTotalCompra={setTotalCompra}
        fechaCompra={fechaCompra}
        setFechaCompra={setFechaCompra}
        guardarCompra={guardarCompra}
        compraAEditar={compraAEditar}
      />

      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />
    </Container>
  );
};

export default Compras;