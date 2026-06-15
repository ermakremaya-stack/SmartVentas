import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionProducto = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  productoEditar,
  manejoCambioInputEdicion,
  actualizarProducto,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleActualizar = async () => {
    if (deshabilitado) return;

    setDeshabilitado(true);

    try {
      await actualizarProducto();
    } finally {
      setDeshabilitado(false);
    }
  };

  return (
    <Modal
      show={mostrarModalEdicion}
      onHide={() => setMostrarModalEdicion(false)}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Producto</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={productoEditar.nombre || ""}
              onChange={manejoCambioInputEdicion}
              placeholder="Ingresa el nombre"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categoría ID</Form.Label>
            <Form.Control
              type="number"
              name="categoria_id"
              value={productoEditar.categoria_id || ""}
              onChange={manejoCambioInputEdicion}
              placeholder="Ingresa el ID de la categoría"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio Compra</Form.Label>
            <Form.Control
              type="number"
              name="precio_compra"
              value={productoEditar.precio_compra || ""}
              onChange={manejoCambioInputEdicion}
              placeholder="Ingresa el precio de compra"
              min="0"
              step="0.01"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio Venta</Form.Label>
            <Form.Control
              type="number"
              name="precio_venta"
              value={productoEditar.precio_venta || ""}
              onChange={manejoCambioInputEdicion}
              placeholder="Ingresa el precio de venta"
              min="0"
              step="0.01"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="activo"
              label="Producto activo"
              checked={productoEditar.activo || false}
              onChange={manejoCambioInputEdicion}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setMostrarModalEdicion(false)}
        >
          Cancelar
        </Button>

        <Button
          variant="primary"
          onClick={handleActualizar}
          disabled={
            productoEditar.nombre.trim() === "" ||
            productoEditar.categoria_id === "" ||
            productoEditar.precio_compra === "" ||
            productoEditar.precio_venta === "" ||
            deshabilitado
          }
        >
          {deshabilitado ? "Actualizando..." : "Actualizar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionProducto;