import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Table } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import NotificationOperation from "../components/NotificationOperation";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ornedamiento/Paginacion";
import FormularioCompra from "../components/compras/FormularioCompra";

const Compras = () => {

  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [compras, setCompras] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [compraAEditar, setCompraAEditar] = useState(null);

  const [proveedores, setProveedores] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [productos, setProductos] = useState([]);

  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [fechaCompra, setFechaCompra] = useState("");
  const [numeroFacturaProveedor, setNumeroFacturaProveedor] = useState("");
  const [totalCompra, setTotalCompra] = useState(0);

  const [detalles, setDetalles] = useState([]);

  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [comprasFiltradas, setComprasFiltradas] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(8);

  const comprasPaginadas = (comprasFiltradas || []).slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  // ================= OBTENER IDS SEGUROS =================
  const obtenerIdProveedor = (proveedor) => {
    return proveedor?.proveedor_id ?? proveedor?.id_proveedor;
  };

  const obtenerIdEmpleado = (empleado) => {
    return empleado?.empleado_id ?? empleado?.id_empleado;
  };

  // ================= OBTENER NOMBRES SEGUROS =================
  const obtenerNombreProveedor = (proveedorId) => {
    const proveedor = proveedores.find(
      p => Number(obtenerIdProveedor(p)) === Number(proveedorId)
    );

    if (!proveedor) return String(proveedorId || "Sin proveedor");

    return String(
      proveedor.nombre_proveedor ||
      proveedor.nombre ||
      proveedor.nombre_empresa ||
      proveedor.razon_social ||
      proveedor.empresa ||
      proveedor.nombre_contacto ||
      proveedor.contacto ||
      `Proveedor ${proveedorId}`
    );
  };

  const obtenerNombreEmpleado = (empleadoId) => {
    const empleado = empleados.find(
      e => Number(obtenerIdEmpleado(e)) === Number(empleadoId)
    );

    if (!empleado) return String(empleadoId || "Sin empleado");

    return String(
      `${empleado.nombre_empleado || empleado.nombre || empleado.nombre1 || ""} ${
        empleado.apellido_empleado || empleado.apellido || empleado.apellido1 || ""
      }`.trim() ||
      `Empleado ${empleadoId}`
    );
  };

  // ================= CARGAR COMPRAS =================
  const cargarCompras = async () => {
    setCargando(true);

    try {
      const { data, error } = await supabase
        .from("compras")
        .select("*")
        .order("fecha_compra", { ascending: false });

      if (error) throw error;

      setCompras(data || []);
      setComprasFiltradas(data || []);

    } catch (err) {
      console.error("ERROR REAL:", err.message);

      setToast({
        mostrar: true,
        mensaje: err.message,
        tipo: "error"
      });
    }

    setCargando(false);
  };

  // ================= CARGAR DATOS AUXILIARES =================
  const cargarDatosAuxiliares = async () => {
    try {
      const [prov, emp, prod] = await Promise.all([
        supabase.from("proveedores").select("*"),
        supabase.from("empleados").select("*"),
        supabase.from("productos").select("*")
      ]);

      setProveedores(prov.data || []);
      setEmpleados(emp.data || []);
      setProductos(prod.data || []);

      console.log("PROVEEDORES:", prov.data);
      console.log("EMPLEADOS:", emp.data);
      console.log("PRODUCTOS:", prod.data);

    } catch (err) {
      console.error("Error cargando datos auxiliares:", err.message);

      setToast({
        mostrar: true,
        mensaje: "Error cargando proveedores, empleados o productos",
        tipo: "error"
      });
    }
  };

  useEffect(() => {
    cargarCompras();
    cargarDatosAuxiliares();
  }, []);

  // ================= CALCULAR TOTAL =================
  useEffect(() => {
    const total = detalles.reduce(
      (sum, d) => sum + Number(d.cantidad || 0) * Number(d.precio || 0),
      0
    );

    setTotalCompra(total);
  }, [detalles]);

  // ================= BUSQUEDA =================
  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setComprasFiltradas(compras);
    } else {
      const texto = textoBusqueda.toLowerCase();

      const filtradas = compras.filter(c => {
        const proveedorNombre = String(obtenerNombreProveedor(c.proveedor_id)).toLowerCase();
        const empleadoNombre = String(obtenerNombreEmpleado(c.empleado_id)).toLowerCase();

        return (
          String(c.proveedor_id || "").toLowerCase().includes(texto) ||
          String(c.empleado_id || "").toLowerCase().includes(texto) ||
          String(c.numero_factura_proveedor || "").toLowerCase().includes(texto) ||
          proveedorNombre.includes(texto) ||
          empleadoNombre.includes(texto)
        );
      });

      setComprasFiltradas(filtradas);
    }
  }, [textoBusqueda, compras, proveedores, empleados]);

  // ================= RESET FORMULARIO =================
  const resetFormulario = () => {
    setProveedorSeleccionado(null);
    setEmpleadoSeleccionado(null);
    setFechaCompra("");
    setNumeroFacturaProveedor("");
    setTotalCompra(0);
    setDetalles([]);
    setCompraAEditar(null);
  };

  // ================= ABRIR NUEVA COMPRA =================
  const abrirNuevaCompra = () => {
    resetFormulario();

    const fechaActual = new Date()
      .toLocaleString("sv", { timeZone: "America/Managua" })
      .replace(" ", "T")
      .slice(0, 16);

    setFechaCompra(fechaActual);
    setMostrarFormulario(true);
  };

  // ================= GUARDAR COMPRA =================
  const guardarCompra = async () => {
    if (!proveedorSeleccionado || !empleadoSeleccionado) {
      setToast({
        mostrar: true,
        mensaje: "Debe seleccionar proveedor y empleado",
        tipo: "advertencia"
      });
      return;
    }

    if (!numeroFacturaProveedor.trim()) {
      setToast({
        mostrar: true,
        mensaje: "Debe ingresar el número de factura",
        tipo: "advertencia"
      });
      return;
    }

    if (detalles.length === 0) {
      setToast({
        mostrar: true,
        mensaje: "Debe agregar al menos un producto a la compra",
        tipo: "advertencia"
      });
      return;
    }

    try {
      const { data: compraInsertada, error: errorCompra } = await supabase
        .from("compras")
        .insert([{
          proveedor_id: obtenerIdProveedor(proveedorSeleccionado),
          empleado_id: obtenerIdEmpleado(empleadoSeleccionado),
          fecha_compra: fechaCompra || new Date().toISOString(),
          total_compra: totalCompra,
          numero_factura_proveedor: numeroFacturaProveedor,
          activo: true
        }])
        .select()
        .single();

      if (errorCompra) throw errorCompra;

      const detallesInsert = detalles.map(d => ({
        compra_id: compraInsertada.compra_id,
        producto_id: d.producto_id,
        cantidad_comprada: Number(d.cantidad),
        precio_unitario_compra: Number(d.precio),
        subtotal_compra: Number(d.cantidad) * Number(d.precio)
      }));

      const { error: errorDetalles } = await supabase
        .from("detalle_compras")
        .insert(detallesInsert);

      if (errorDetalles) throw errorDetalles;

      setToast({
        mostrar: true,
        mensaje: "Compra registrada correctamente",
        tipo: "exito"
      });

      setMostrarFormulario(false);
      resetFormulario();
      await cargarCompras();

    } catch (err) {
      console.error("Error registrando compra:", err.message);

      setToast({
        mostrar: true,
        mensaje: err.message || "Error al registrar compra",
        tipo: "error"
      });
    }
  };

  // ================= ELIMINAR COMPRA =================
  const eliminarCompra = async (compraId) => {
    const confirmar = window.confirm("¿Está seguro que desea eliminar esta compra?");

    if (!confirmar) return;

    try {
      const { error: errorDetalles } = await supabase
        .from("detalle_compras")
        .delete()
        .eq("compra_id", compraId);

      if (errorDetalles) throw errorDetalles;

      const { error: errorCompra } = await supabase
        .from("compras")
        .delete()
        .eq("compra_id", compraId);

      if (errorCompra) throw errorCompra;

      setToast({
        mostrar: true,
        mensaje: "Compra eliminada correctamente",
        tipo: "exito"
      });

      await cargarCompras();

    } catch (err) {
      console.error("Error eliminando compra:", err.message);

      setToast({
        mostrar: true,
        mensaje: err.message || "Error al eliminar la compra",
        tipo: "error"
      });
    }
  };

  return (
    <Container className="mt-3">

      <Row className="mb-3">
        <Col>
          <h3>Compras</h3>
        </Col>

        <Col className="text-end">
          <Button onClick={abrirNuevaCompra}>
            Nueva Compra
          </Button>
        </Col>
      </Row>

      <CuadroBusquedas
        textoBusqueda={textoBusqueda}
        manejarCambioBusqueda={(e) => setTextoBusqueda(e.target.value)}
        placeholder="Buscar por proveedor, empleado o factura..."
      />

      {cargando ? (
        <Row className="text-center my-5">
          <Spinner animation="border" />
          <p className="mt-2 text-muted">Cargando compras...</p>
        </Row>
      ) : (
        <Table striped bordered hover responsive className="mt-3">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Factura</th>
              <th>Proveedor</th>
              <th>Empleado</th>
              <th className="text-end">Total</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {comprasPaginadas.length > 0 ? (
              comprasPaginadas.map(c => (
                <tr key={c.compra_id}>
                  <td>{c.compra_id}</td>

                  <td>
                    {c.fecha_compra
                      ? new Date(c.fecha_compra).toLocaleString()
                      : "Sin fecha"}
                  </td>

                  <td>{c.numero_factura_proveedor || "Sin factura"}</td>

                  <td>{obtenerNombreProveedor(c.proveedor_id)}</td>

                  <td>{obtenerNombreEmpleado(c.empleado_id)}</td>

                  <td className="text-end fw-bold">
                    C$ {parseFloat(c.total_compra || 0).toFixed(2)}
                  </td>

                  <td className="text-center">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => eliminarCompra(c.compra_id)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  No hay compras registradas
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <Paginacion
        registrosPorPagina={registrosPorPagina}
        totalRegistros={comprasFiltradas.length}
        paginaActual={paginaActual}
        establecerPaginaActual={setPaginaActual}
        establecerRegistrosPorPagina={setRegistrosPorPagina}
      />

      <FormularioCompra
        mostrar={mostrarFormulario}
        setMostrar={setMostrarFormulario}

        proveedores={proveedores}
        empleados={empleados}
        productos={productos}

        proveedorSeleccionado={proveedorSeleccionado}
        setProveedorSeleccionado={setProveedorSeleccionado}

        empleadoSeleccionado={empleadoSeleccionado}
        setEmpleadoSeleccionado={setEmpleadoSeleccionado}

        fechaCompra={fechaCompra}
        setFechaCompra={setFechaCompra}

        totalCompra={totalCompra}
        setTotalCompra={setTotalCompra}

        numeroFacturaProveedor={numeroFacturaProveedor}
        setNumeroFacturaProveedor={setNumeroFacturaProveedor}

        detalles={detalles}
        setDetalles={setDetalles}

        guardarCompra={guardarCompra}
        compraAEditar={compraAEditar}
      />

      <NotificationOperation
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />

    </Container>
  );
};

export default Compras;