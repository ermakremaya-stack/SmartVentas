import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaEmpleado = ({
  empleados,
  abrirModalEdicion,
}) => {
  const [cargando, setCargando] = useState(true);
  const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

  useEffect(() => {
    setCargando(!(empleados && empleados.length > 0));
  }, [empleados]);

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
          <h5>Cargando empleados...</h5>
          <Spinner animation="border" variant="success" role="status" />
        </div>
      ) : (
        <div>
          {empleados.map((empleado) => {
            const tarjetaActiva = idTarjetaActiva === empleado.id_empleado;

            return (
              /* Envoltorio relativo forzado para controlar el centro matemático exacto */
              <div key={empleado.id_empleado} className="position-relative w-100 mb-3">
                
                <Card
                  className="border-0 rounded-3 shadow-sm w-100"
                  onClick={() => alternarTarjetaActiva(empleado.id_empleado)}
                  tabIndex={0}
                  onKeyDown={(evento) => {
                    if (evento.key === "Enter" || evento.key === " ") {
                      evento.preventDefault();
                      alternarTarjetaActiva(empleado.id_empleado);
                    }
                  }}
                  aria-label={`Empleado ${empleado.nombre_empleado} ${empleado.apellido_empleado}`}
                >
                  {/* Atenuamos el contenido cuando la tarjeta está seleccionada */}
                  <Card.Body
                    className="p-2"
                    style={{ 
                      opacity: tarjetaActiva ? 0.25 : 1, 
                      transition: "opacity 0.2s ease-in-out" 
                    }}
                  >
                    <Row className="align-items-center gx-3">
                      {/* Avatar circular */}
                      <Col xs="auto" className="px-2">
                        <div
                          className="bg-light d-flex align-items-center justify-content-center rounded-circle text-primary"
                          style={{ width: "55px", height: "55px" }}
                        >
                          <i className="bi bi-person fs-3"></i>
                        </div>
                      </Col>

                      {/* Información de Identidad */}
                      <Col className="text-start pe-5">
                        <div className="fw-bold text-dark text-truncate">
                          {empleado.nombre_empleado} {empleado.apellido_empleado}
                        </div>
                        <div className="small text-muted text-truncate">
                          <i className="bi bi-envelope me-1"></i> {empleado.email}
                        </div>
                        <div className="small text-secondary text-truncate">
                          <i className="bi bi-telephone me-1"></i> {empleado.celular || "-"}
                        </div>
                      </Col>

                      {/* Meta-bloque Derecho (PIN, Rol y Estado) */}
                      <Col
                        xs="auto"
                        className="d-flex flex-column align-items-end justify-content-center text-end gap-1"
                      >
                        {/* Badge Plano consistente con la tabla grupal */}
                        <span className="badge bg-primary text-white px-2 py-1">
                          {(empleado.tipo_empleado || "empleado").toLowerCase()}
                        </span>
                        
                        <div className="small text-muted">
                          <span className="text-secondary fw-semibold">PIN:</span> {empleado.pin || "-"}
                        </div>
                        
                        <div className="text-success small fw-semibold d-flex align-items-center gap-1">
                          <span className="rounded-circle bg-success" style={{ width: "6px", height: "6px", display: "inline-block" }}></span>
                          activo
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* MENÚ DE ACCIONES FLOTANTE ULTRA-FORZADO AL CENTRO */}
                {tarjetaActiva && (
                  <div
                    className="d-flex gap-2 bg-white p-2 rounded shadow-sm border align-items-center"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 100,
                      pointerEvents: "auto"
                    }}
                    onClick={(e) => {
                      // Previene que el click en la burbuja cierre accidentalmente la tarjeta
                      e.stopPropagation();
                    }}
                  >
                    <Button
                      variant="outline-warning"
                      size="sm"
                      className="d-flex align-items-center gap-1"
                      onClick={() => {
                        abrirModalEdicion(empleado);
                        setIdTarjetaActiva(null);
                      }}
                      aria-label={`Editar ${empleado.nombre_empleado}`}
                    >
                      <i className="bi bi-pencil"></i> Editar
                    </Button>
                    
                    {/* Botón de cierre rápido para mejorar la experiencia de usuario */}
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setIdTarjetaActiva(null)}
                    >
                      <i className="bi bi-x-lg"></i>
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default TarjetaEmpleado;