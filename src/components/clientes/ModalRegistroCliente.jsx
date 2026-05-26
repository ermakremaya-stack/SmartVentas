import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalRegistroCliente = ({
  mostrarModal,
  setMostrarModal,
  nuevoCliente,
  manejoCambioInput,
  agregarCliente,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleRegistrar = async (e) => {
    e.preventDefault();
    if (deshabilitado) return;
    setDeshabilitado(true);
    await agregarCliente();
    setDeshabilitado(false);
  };

  const formularioInvalido = 
    nuevoCliente.nombre1.trim() === "" || 
    nuevoCliente.apellido1.trim() === "" || 
    nuevoCliente.cedula.trim() === "" ||
    nuevoCliente.ciudad.trim() === "";

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      backdrop="static"
      keyboard={false}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-person-plus-fill me-2 text-primary"></i>
          Registrar Nuevo Cliente
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleRegistrar}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Primer Nombre <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="nombre1"
                  value={nuevoCliente.nombre1}
                  onChange={manejoCambioInput}
                  placeholder="Ej: Juan"
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
                  value={nuevoCliente.nombre2}
                  onChange={manejoCambioInput}
                  placeholder="Ej: Carlos (Opcional)"
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
                  value={nuevoCliente.apellido1}
                  onChange={manejoCambioInput}
                  placeholder="Ej: Pérez"
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
                  value={nuevoCliente.apellido2}
                  onChange={manejoCambioInput}
                  placeholder="Ej: López (Opcional)"
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
                  value={nuevoCliente.cedula}
                  onChange={manejoCambioInput}
                  placeholder="Ej: 001-XXXXXX-XXXXX"
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
                  value={nuevoCliente.ciudad}
                  onChange={manejoCambioInput}
                  placeholder="Ej: Managua"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Check 
              type="switch"
              id="registro-activo-switch"
              label="Cliente habilitado/activo dentro del sistema"
              name="activo"
              checked={nuevoCliente.activo}
              onChange={manejoCambioInput}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={formularioInvalido || deshabilitado}
          >
            {deshabilitado ? "Guardando..." : "Guardar Cliente"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalRegistroCliente;