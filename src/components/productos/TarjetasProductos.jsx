import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetasProductos = ({
  productos,
  abrirModalEdicion,
  abrirModalEliminacion,
}) => {
  const [cargando, setCargando] = useState(true);
  const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

  useEffect(() => {
    setCargando(!productos);
  }, [productos]);

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
          <h5>Cargando productos...</h5>
          <Spinner animation="border" variant="success" role="status" />
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center my-5">
          <p className="text-muted">No hay productos registrados.</p>
        </div>
      ) : (
        <div>
          {productos.map((producto) => {
            const tarjetaActiva = idTarjetaActiva === producto.producto_id;

            return (
              <Card
                key={producto.producto_id}
                className="mb-3 border-0 rounded-3 shadow-sm w-100 tarjeta-producto-contenedor"
                onClick={() => alternarTarjetaActiva(producto.producto_id)}
                tabIndex={0}
                onKeyDown={(evento) => {
                  if (evento.key === "Enter" || evento.key === " ") {
                    evento.preventDefault();
                    alternarTarjetaActiva(producto.producto_id);
                  }
                }}
                aria-label={`Producto ${producto.nombre}`}
              >
                <Card.Body
                  className={`p-2 tarjeta-producto-cuerpo ${
                    tarjetaActiva
                      ? "tarjeta-producto-activo"
                      : "tarjeta-producto-cuerpo-inactivo"
                  }`}
                >
                  <Row className="align-items-center gx-3">
                    <Col xs={2} className="px-2">
                      <div className="bg-light d-flex align-items-center justify-content-center rounded tarjeta-producto-placeholder-imagen">
                        <i className="bi bi-box-seam text-muted fs-3"></i>
                      </div>
                    </Col>

                    <Col xs={5} className="text-start">
                      <div className="fw-semibold text-truncate">
                        {producto.nombre}
                      </div>

                      <div className="small text-muted text-truncate">
                        Categoría ID: {producto.categoria_id}
                      </div>
                    </Col>

                    <Col
                      xs={5}
                      className="d-flex flex-column align-items-end justify-content-center text-end"
                    >
                      <div className="fw-semibold small">
                        C$ {producto.precio_venta}
                      </div>

                      <div className="small text-muted">
                        Compra: C$ {producto.precio_compra}
                      </div>

                      <Button
                        variant={producto.activo ? "success" : "secondary"}
                        size="sm"
                        disabled
                        className="mt-1 px-2"
                      >
                        <i
                          className={`bi ${
                            producto.activo
                              ? "bi-check-circle-fill"
                              : "bi-x-circle-fill"
                          } me-1`}
                        ></i>
                        {producto.activo ? "Activo" : "Inactivo"}
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>

                {tarjetaActiva && (
                  <div
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIdTarjetaActiva(null);
                    }}
                    className="tarjeta-producto-capa"
                  >
                    <div
                      className="d-flex gap-2 tarjeta-producto-botones-capa"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => {
                          abrirModalEdicion(producto);
                          setIdTarjetaActiva(null);
                        }}
                        aria-label={`Editar ${producto.nombre}`}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>

                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          abrirModalEliminacion(producto);
                          setIdTarjetaActiva(null);
                        }}
                        aria-label={`Eliminar ${producto.nombre}`}
                      >
                        <i className="bi bi-trash"></i>
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

export default TarjetasProductos;