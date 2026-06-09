import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Table } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import NotificationOperation from "../components/NotificationOperation";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ornedamiento/Paginacion";

const Compras = () => {

  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [compras, setCompras] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [comprasFiltradas, setComprasFiltradas] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(8);

  const comprasPaginadas = (comprasFiltradas || []).slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  // ✅ ================= CARGAR COMPRAS =================
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
      setToast({ mostrar: true, mensaje: err.message, tipo: "error" });
    }

    setCargando(false);
  };

  useEffect(() => {
    cargarCompras();
  }, []);

  // ✅ ================= BUSQUEDA =================
  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setComprasFiltradas(compras);
    } else {
      const texto = textoBusqueda.toLowerCase();

      const filtradas = compras.filter(c =>
        String(c.proveedor_id || "").toLowerCase().includes(texto)
      );

      setComprasFiltradas(filtradas);
    }
  }, [textoBusqueda, compras]);

  // ✅ ================= RENDER =================
  return (
    <Container className="mt-3">

      <Row className="mb-3">
        <Col><h3>Compras</h3></Col>
        <Col className="text-end">
          <Button onClick={() => setMostrarFormulario(true)}>
            Nueva Compra
          </Button>
        </Col>
      </Row>

      <CuadroBusquedas
        textoBusqueda={textoBusqueda}
        manejarCambioBusqueda={(e) => setTextoBusqueda(e.target.value)}
        placeholder="Buscar por proveedor ID..."
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
              <th>Proveedor</th>
              <th>Empleado</th>
              <th className="text-end">Total</th>
            </tr>
          </thead>

          <tbody>
            {comprasPaginadas.length > 0 ? (
              comprasPaginadas.map(c => (
                <tr key={c.compra_id}>
                  <td>#{c.compra_id}</td>

                  <td>
                    {c.fecha_compra
                      ? new Date(c.fecha_compra).toLocaleString()
                      : "Sin fecha"}
                  </td>

                  <td>{c.proveedor_id}</td>

                  <td>{c.empleado_id}</td>

                  <td className="text-end fw-bold">
                    C$ {parseFloat(c.total_compra || 0).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
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