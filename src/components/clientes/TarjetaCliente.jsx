import React from "react";
import { Row, Col, Spinner, Button, Badge } from "react-bootstrap";
import { useSeleccionTarjeta } from "@/utils/tarjetas";
import { TarjetaBase } from "@/utils/tarjetas";

const TarjetaCliente = ({
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
      {clientes.map((cliente) => (
        <TarjetaBase
          key={cliente.cliente_id}
          esActivo={idActivo === cliente.cliente_id}
          alHacerClick={() => alternarActivo(cliente.cliente_id)}
          ariaLabel={`Cliente ${cliente.nombre1} ${cliente.apellido1}`}
          acciones={
            <div className="d-flex gap-2">
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
                <i className="bi bi-file-earmark-pdf"></i> PDF
              </Button>
            </div>
          }
        >
          <Row className="align-items-center gx-2 py-1">
            <Col xs={2} className="text-center">
              <div className={`rounded-circle p-2 d-inline-block ${cliente.activo ? 'bg-light text-primary' : 'bg-light text-muted'}`}>
                <i className="bi bi-person fs-3"></i>
              </div>
            </Col>
            <Col xs={10} className="text-start">
              <div className="fw-bold text-truncate text-dark d-flex align-items-center gap-2">
                {`${cliente.nombre1} ${cliente.apellido1}`}
                {cliente.activo ? (
                  <Badge bg="success" className="p-1" pill><i className="bi bi-check"></i></Badge>
                ) : (
                  <Badge bg="secondary" className="p-1" pill><i className="bi bi-x"></i></Badge>
                )}
              </div>
              <div className="small text-muted text-truncate">
                <i className="bi bi-card-text me-1"></i> Cédula: {cliente.cedula}
              </div>
              <div className="small text-secondary text-truncate">
                <i className="bi bi-geo-alt me-1"></i> Ciudad: {cliente.ciudad}
              </div>
            </Col>
          </Row>
        </TarjetaBase>
      ))}
    </div>
  );
};

export default TarjetaCliente;