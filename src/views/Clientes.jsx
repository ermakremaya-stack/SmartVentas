import React, { useState } from "react";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { useClientes } from "../components/hooks/useClientes";

import ModalRegistroCliente from "../components/clientes/ModalRegistroCliente";
import ModalEdicionCliente from "../components/clientes/ModalEdicionCliente";
import ModalEliminacionCliente from "../components/clientes/ModalEliminacionCliente";
import NotificacionOperacion from "../components/NotificationOperation";
import TablaClientes from "../components/clientes/TablaClientes";
import TarjetaCliente from "../components/clientes/TarjetaCliente";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ornedamiento/Paginacion";

const generarPDFCliente = (cliente) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Reporte Detallado de Cliente", 14, 20);
  doc.line(14, 25, 195, 25);
  doc.setFontSize(11);

  const nombreCompleto = `${cliente.nombre1} ${cliente.nombre2 || ""} ${cliente.apellido1} ${cliente.apellido2 || ""}`.replace(/\s+/g, ' ');

  autoTable(doc, {
    startY: 35,
    head: [["Campo de Datos", "Información del Registro"]],
    body: [
      ["ID Sistema", cliente.cliente_id],
      ["Nombre Completo", nombreCompleto],
      ["Cédula", cliente.cedula],
      ["Ciudad", cliente.ciudad],
      ["Estado de Cuenta", cliente.activo ? "Activo" : "Inactivo"],
    ],
    theme: "striped",
    headStyles: { fillColor: [44, 62, 80] },
  });

  doc.save(`cliente_ficha_${cliente.cliente_id}.pdf`);
};

const Clientes = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  const {
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
  } = useClientes(setToast);

  return (
    <Container className="mt-3">
      <Row className="align-items-center mb-3">
        <Col xs={9} sm={7} md={7} lg={7} className="d-flex align-items-center">
          <h3 className="mb-0">
            <i className="bi bi-people-fill me-2 text-primary"></i> Directorio de Clientes
          </h3>
        </Col>
        <Col xs={3} sm={5} md={5} lg={5} className="text-end">
          <Button onClick={() => setMostrarModal(true)} variant="primary" size="md">
            <i className="bi bi-person-plus-fill"></i>
            <span className="d-none d-sm-inline ms-2">Nuevo Cliente</span>
          </Button>
        </Col>
      </Row>

      <hr />

      <Row className="mb-4">
        <Col md={6} lg={5}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
            placeholder="Buscar por nombre, cédula o ciudad..."
          />
        </Col>
      </Row>

      {!cargando && textoBusqueda.trim() && clientesFiltrados.length === 0 && (
        <Row className="mb-4">
          <Col>
            <Alert variant="warning" className="text-center shadow-sm">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              No se localizaron registros que coincidan con la búsqueda: "<strong>{textoBusqueda}</strong>".
            </Alert>
          </Col>
        </Row>
      )}

      <ModalRegistroCliente
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoCliente={nuevoCliente}
        manejoCambioInput={manejoCambioInput}
        agregarCliente={agregarCliente}
      />

      <ModalEdicionCliente
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        clienteEditar={clienteEditar}
        manejoCambioInputEdicion={manejoCambioInputEdicion}
        actualizarCliente={actualizarCliente}
      />

      <ModalEliminacionCliente
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarCliente={eliminarCliente}
        cliente={clienteAEliminar}
      />

      {!cargando && clientes.length === 0 && (
        <Row className="text-center my-5">
          <Col>
            <i className="bi bi-folder-x display-4 text-muted"></i>
            <p className="text-muted fs-5 mt-2">No se encuentran clientes almacenados en la base de datos.</p>
          </Col>
        </Row>
      )}

      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />

      {!cargando && clientesFiltrados.length > 0 && (
        <>
          <Row>
            <Col xs={12} className="d-lg-none">
              <TarjetaCliente
                clientes={clientesPaginados}
                abrirModalEdicion={abrirModalEdicion}
                abrirModalEliminacion={abrirModalEliminacion}
                generarPDFCliente={generarPDFCliente}
              />
            </Col>

            <Col lg={12} className="d-none d-lg-block">
              <TablaClientes
                clientes={clientesPaginados}
                abrirModalEdicion={abrirModalEdicion}
                abrirModalEliminacion={abrirModalEliminacion}
                generarPDFCliente={generarPDFCliente}
              />
            </Col>
          </Row>

          <Paginacion
            registrosPorPagina={registrosPorPagina}
            totalRegistros={clientesFiltrados.length}
            paginaActual={paginaActual}
            establcerPaginaActual={setPaginaActual}
            establecerRegistrosPorPagina={setRegistrosPorPagina}
          />
        </>
      )}
    </Container>
  );
};

export default Clientes;