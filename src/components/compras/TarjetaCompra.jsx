import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaCompra = ({
  compras,
  abrirEdicion,
}) => {
  const [cargando, setCargando] = useState(true);
  const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

  useEffect(() => {
    setCargando(!(compras && compras.length > 0));
  }, [compras]);

  const manejarTeclaEscape = useCallback((evento) => {
    if (evento.key === "Escape") setIdTarjetaActiva(null);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", manejarTeclaEscape);
    return () => window.removeEventListener("keydown", manejarTeclaEscape);
  }, [manejarTeclaEscape]);

  const alternarTarjetaActiva = (id) => {
    setIdTarjetaActiva((anterior) => (anterior === id ? null : id));
  };

  return (
    <>
      {cargando ? (
        <div className="text-center my-5">
          <h5>Cargando compras...</h5>
          <Spinner animation="border" variant="success" role="status" />
        </div>
      ) : (
        <div>
          {compras.map((compra) => {
            const tarjetaActiva = idTarjetaActiva === compra.compra_id;

            return (
              <Card
                key={compra.compra_id}
                className="mb-3 border-0 rounded-3 shadow-sm w-100 tarjeta-compra-contenedor"
                onClick={() => alternarTarjetaActiva(compra.compra_id)}
                tabIndex={0}
                onKeyDown={(evento) => {
                  if (evento.key === "Enter" || evento.key === " ") {
                    evento.preventDefault();
                    alternarTarjetaActiva(compra.compra_id);
                  }
                }}
                aria-label={`Compra ${compra.compra_id}`}
              >
                <Card.Body
                  className={`p-2 tarjeta-compra-cuerpo ${
                    tarjetaActiva
                      ? "tarjeta-compra-cuerpo-activo"
                      : "tarjeta-compra-cuerpo-inactivo"
                  }`}
                >
                  <Row className="align-items-center gx-3">
                    <Col xs={2} className="px-2">
                      <div className="bg-light d-flex align-items-center justify-content-center rounded tarjeta-compra-placeholder-imagen">
                        <i className="bi bi-bag-check text-muted fs-3"></i>
                      </div>
                    </Col>

                    <Col xs={6} className="text-start">
                      <div className="fw-semibold text-truncate">
                        Factura: {compra.numero_factura_proveedor}
                      </div>

                      <div className="small text-muted text-truncate">
                        {compra.proveedores?.nombre_proveedor}
                      </div>

                      <div className="small text-muted text-truncate">
                        {compra.fecha_compra
                          ? new Date(compra.fecha_compra).toLocaleString("es-NI")
                          : "Sin fecha"}
                      </div>
                    </Col>

                    <Col xs={4} className="text-end">
                      <div className="fw-bold text-success">
                        C$ {parseFloat(compra.total_compra || 0).toFixed(2)}
                      </div>

                      <div className="small mt-1">
                        {compra.activo ? (
                          <span className="badge bg-success">Activo</span>
                        ) : (
                          <span className="badge bg-secondary">Inactivo</span>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>

                {tarjetaActiva && (
                  <div
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => e.stopPropagation()}
                    className="tarjeta-compra-capa"
                  >
                    <div
                      className="d-flex gap-2 tarjeta-compra-botones-capa"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => {
                          abrirEdicion(compra);
                          setIdTarjetaActiva(null);
                        }}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
};

export default TarjetaCompra;