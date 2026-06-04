import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroProducto = ({
  mostrarModal,
  setMostrarModal,
  nuevoProducto,
  manejoCambioInput,
  agregarProducto,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleRegistrar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await agregarProducto();
    setDeshabilitado(false);
  };

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Agregar Producto</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={nuevoProducto?.nombre || ""}
              onChange={manejoCambioInput}
              placeholder="Ingresa el nombre"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categoría ID</Form.Label>
            <Form.Control
              type="number"
              name="categoria_id"
              value={nuevoProducto?.categoria_id || ""}
              onChange={manejoCambioInput}
              placeholder="Ingresa el ID de la categoría"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Existencias</Form.Label>
            <Form.Control
              type="number"
              name="existencias"
              value={nuevoProducto?.existencias || ""}
              onChange={manejoCambioInput}
              placeholder="Ingresa las existencias"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio Compra</Form.Label>
            <Form.Control
              type="number"
              name="precio_compra"
              value={nuevoProducto?.precio_compra || ""}
              onChange={manejoCambioInput}
              placeholder="Ingresa el precio de compra"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio Venta</Form.Label>
            <Form.Control
              type="number"
              name="precio_venta"
              value={nuevoProducto?.precio_venta || ""}
              onChange={manejoCambioInput}
              placeholder="Ingresa el precio de venta"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="activo"
              label="Activo"
              checked={nuevoProducto?.activo || false}
              onChange={manejoCambioInput}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>

        <Button
          variant="primary"
          onClick={handleRegistrar}
          disabled={
            !nuevoProducto?.nombre?.trim() ||
            !nuevoProducto?.categoria_id ||
            !nuevoProducto?.existencias ||
            !nuevoProducto?.precio_compra ||
            !nuevoProducto?.precio_venta ||
            deshabilitado
          }
        >
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProducto;