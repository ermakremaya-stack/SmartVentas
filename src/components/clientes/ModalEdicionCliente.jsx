import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalEdicionCliente = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  clienteEditar,
  manejoCambioInputEdicion,
  actualizarCliente,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleActualizar = async (e) => {
    e.preventDefault();
    if (deshabilitado) return;
    setDeshabilitado(true);
    await actualizarCliente();
    setDeshabilitado(false);
  };

  const formularioInvalido = 
    !clienteEditar.nombre1 || clienteEditar.nombre1.trim() === "" || 
    !clienteEditar.apellido1 || clienteEditar.apellido1.trim() === "" || 
    !clienteEditar.cedula || clienteEditar.cedula.trim() === "" ||
    !clienteEditar.ciudad || clienteEditar.ciudad.trim() === "";

  return (
    <Modal
      show={mostrarModalEdicion}
      onHide={() => setMostrarModalEdicion(false)}
      backdrop="static"
      keyboard={false}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-pencil-square me-2 text-warning"></i>
          Modificar Cliente
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleActualizar}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Primer Nombre <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="nombre1"
                  value={clienteEditar.nombre1 || ""}
                  onChange={manejoCambioInputEdicion}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Segundo Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre2"
                  value={clienteEditar.nombre2 || ""}
                  onChange={manejoCambioInputEdicion}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Primer Apellido <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="apellido1"
                  value={clienteEditar.apellido1 || ""}
                  onChange={manejoCambioInputEdicion}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Segundo Apellido</Form.Label>
                <Form.Control
                  type="text"
                  name="apellido2"
                  value={clienteEditar.apellido2 || ""}
                  onChange={manejoCambioInputEdicion}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Cédula <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="cedula"
                  value={clienteEditar.cedula || ""}
                  onChange={manejoCambioInputEdicion}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Ciudad <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="ciudad"
                  value={clienteEditar.ciudad || ""}
                  onChange={manejoCambioInputEdicion}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Check 
              type="switch"
              id="edicion-activo-switch"
              label="Cliente activo en base de datos"
              name="activo"
              checked={clienteEditar.activo || false}
              onChange={manejoCambioInputEdicion}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModalEdicion(false)}>
            Cancelar Edición
          </Button>
          <Button
            type="submit"
            variant="warning"
            disabled={formularioInvalido || deshabilitado}
          >
            {deshabilitado ? "Actualizando..." : "Actualizar Datos"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalEdicionCliente;