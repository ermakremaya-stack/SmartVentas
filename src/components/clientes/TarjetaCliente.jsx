import React from "react";
import { Row, Col, Spinner, Button } from "react-bootstrap";
import { useSeleccionTarjeta } from "@/utils/tarjetas";
import { TarjetaBase } from "@/utils/tarjetas";

export const TarjetaCliente = ({
  clientes,
  abrirModalEdicion,
  abrirModalEliminacion,
  generarPDFCliente,
}) => {
  const { idActivo, alternarActivo, cerrar } = useSeleccionTarjeta();

  if (!clientes || clientes.length === 0) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="mb-3">
      {clientes.map((cliente) => {
        const esTarjetaActiva = idActivo === cliente.cliente_id;

        return (
          /* Envoltorio relativo para fijar las coordenadas de la burbuja de acciones */
          <div key={cliente.cliente_id} className="position-relative mb-2">
            
            <TarjetaBase
              esActivo={esTarjetaActiva}
              alHacerClick={() => alternarActivo(cliente.cliente_id)}
              ariaLabel={`Cliente ${cliente.nombre1} ${cliente.apellido1}`}
              acciones={
                /* CENTRADO ULTRA-FORZADO: Menú flotante exacto sobre la tarjeta */
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
                  onClick={(e) => e.stopPropagation()} // Evita cierres accidentales al tocar la burbuja
                >
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirModalEdicion(cliente);
                      cerrar();
                    }}
                  >
                    <i className="bi bi-pencil me-1"></i> Editar
                  </Button>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirModalEliminacion(cliente);
                      cerrar();
                    }}
                  >
                    <i className="bi bi-trash me-1"></i> Borrar
                  </Button>

                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      generarPDFCliente(cliente);
                      cerrar();
                    }}
                  >
                    <i className="bi bi-file-earmark-pdf me-1"></i> PDF
                  </Button>
                </div>
              }
            >
              {/* Contenido de datos con atenuación de opacidad controlada al seleccionarse */}
              <div 
                className="w-100 py-1" 
                style={{ 
                  opacity: esTarjetaActiva ? 0.25 : 1, 
                  transition: "opacity 0.2s ease-in-out" 
                }}
              >
                
                {/* Bloque superior derecho absoluto para el Badge de estado plano */}
                <div 
                  className="position-absolute top-0 end-0 mt-2 me-2"
                  style={{ zIndex: 1 }}
                >
                  <span className={`badge bg-${cliente.activo ? "success" : "secondary"}`}>
                    {cliente.activo ? "activo" : "inactivo"}
                  </span>
                </div>

                <Row className="align-items-center gx-2">
                  {/* Icono Lateral */}
                  <Col xs={2} className="text-center">
                    <div className={`rounded-circle p-2 d-inline-block ${cliente.activo ? 'bg-light text-primary' : 'bg-light text-muted'}`}>
                      <i className="bi bi-person fs-3"></i>
                    </div>
                  </Col>

                  {/* Datos del Cliente */}
                  <Col xs={10} className="text-start pe-5">
                    <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '75%' }}>
                      {`${cliente.nombre1} ${cliente.apellido1}`}
                    </div>
                    
                    <div className="small text-muted text-truncate mt-1">
                      <i className="bi bi-card-text me-1"></i> Cédula: {cliente.cedula}
                    </div>
                    <div className="small text-secondary text-truncate">
                      <i className="bi bi-geo-alt me-1"></i> Ciudad: {cliente.ciudad}
                    </div>
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