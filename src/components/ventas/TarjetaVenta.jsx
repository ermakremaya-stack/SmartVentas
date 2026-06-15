import React from "react";
import { Row, Col, Spinner, Button } from "react-bootstrap";
import { useSeleccionTarjeta } from "@/utils/tarjetas";
import { TarjetaBase } from "@/utils/tarjetas";

export const TarjetaVenta = ({
  ventas,
  abrirModalEdicion,
  generarPDFVenta,
}) => {
  const { idActivo, alternarActivo, cerrar } = useSeleccionTarjeta();

  if (!ventas || ventas.length === 0) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const obtenerConfiguracionEstado = (estado) => {
    const est = estado?.toLowerCase();
    switch (est) {
      case "completada":
      case "cerrada":
        return { badgeBg: "success", textClass: "text-success", iconBase: "bi-cart-check" };
      case "pendiente":
      case "abierta":
        return { badgeBg: "warning", textClass: "text-warning", iconBase: "bi-cart" };
      case "anulada":
        return { badgeBg: "danger", textClass: "text-danger", iconBase: "bi-cart-x" };
      default:
        return { badgeBg: "secondary", textClass: "text-secondary", iconBase: "bi-cart" };
    }
  };

  const formatearMoneda = (monto) => {
    return new Intl.NumberFormat("es-NI", {
      style: "currency",
      currency: "NIO",
    }).format(monto);
  };

  const formatearFecha = (fechaString) => {
    if (!fechaString) return "---";
    return new Date(fechaString).toLocaleDateString("es-NI", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="mb-3" style={{ position: "relative" }}>
      {ventas.map((venta) => {
        const c = venta.clientes;
        const nombreCliente = c
          ? c.nombre_cliente
            ? `${c.nombre_cliente} ${c.apellido_cliente || ""}`.trim()
            : `${c.nombre1 || ""} ${c.apellido1 || ""}`.trim()
          : "Cliente no especificado";

        const config = obtenerConfiguracionEstado(venta.estado);
        const esTarjetaActiva = idActivo === venta.id_venta;

        return (
          /* Forzamos position-relative en la tarjeta para romper el flujo de los botones */
          <div key={venta.id_venta} className="position-relative mb-2">
            <TarjetaBase
              esActivo={esTarjetaActiva}
              alHacerClick={() => alternarActivo(venta.id_venta)}
              ariaLabel={`Venta número ${venta.id_venta} por ${nombreCliente}`}
              acciones={
                /* FORZADO ULTRA: Posicionamiento absoluto manual centrado sobre la tarjeta */
                <div
                  className="d-flex gap-2 bg-white p-2 rounded shadow-sm border align-items-center"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 100,
                    display: esTarjetaActiva ? "flex" : "none",
                    pointerEvents: "auto"
                  }}
                  onClick={(e) => e.stopPropagation()} // Evita que se cierre la tarjeta al tocar el fondo del menú
                >
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirModalEdicion(venta);
                      cerrar();
                    }}
                  >
                    <i className="bi bi-pencil me-1"></i> Editar
                  </Button>

                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      generarPDFVenta(venta);
                      cerrar();
                    }}
                  >
                    <i className="bi bi-file-earmark-pdf me-1"></i> Recibo
                  </Button>
                </div>
              }
            >
              {/* Diseño Interno Limpio de Datos */}
              <div className="w-100 py-1" style={{ opacity: esTarjetaActiva ? 0.3 : 1, transition: "opacity 0.2s" }}>

                {/* Bloque superior derecho rígido */}
                <div
                  className="position-absolute top-0 end-0 d-flex align-items-center gap-2 mt-2 me-2"
                  style={{ zIndex: 1 }}
                >
                  <span className="fw-bold text-dark small">
                    {formatearMoneda(venta.total)}
                  </span>
                  <span className={`badge bg-${config.badgeBg}`}>
                    {(venta.estado || "Abierta").toLowerCase()}
                  </span>
                </div>

                <Row className="align-items-center gx-2">
                  <Col xs={2} className="text-center">
                    <div className={`rounded-circle p-2 d-inline-block bg-light ${config.textClass}`}>
                      <i className={`bi ${config.iconBase} fs-3`}></i>
                    </div>
                  </Col>

                  <Col xs={10} className="text-start pe-5">
                    <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '70%' }}>
                      {nombreCliente}
                    </div>

                    <div className="small text-muted text-truncate mt-1">
                      <i className="bi bi-hash me-1"></i> Transacción: #{venta.id_venta}
                    </div>
                    <div className="small text-secondary text-truncate">
                      <i className="bi bi-calendar-event me-1"></i> Fecha: {formatearFecha(venta.fecha_venta)}
                    </div>
                    {venta.observaciones && (
                      <div className="small text-muted text-truncate font-italic">
                        <i className="bi bi-chat-left-text me-1"></i> {venta.observaciones}
                      </div>
                    )}
                  </Col>
                </Row>
              </div>
            </TarjetaBase>
          </div>
        );
      })}
    </div>
  );
};