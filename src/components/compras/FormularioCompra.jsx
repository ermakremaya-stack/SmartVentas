import React from "react";
import { Modal, Row, Col, Form, Button } from "react-bootstrap";

const FormularioCompra = ({
  mostrar,
  setMostrar,
  proveedores,
  empleados,
  proveedorSeleccionado,
  setProveedorSeleccionado,
  empleadoSeleccionado,
  setEmpleadoSeleccionado,
  fechaCompra,
  setFechaCompra,
  totalCompra,
  setTotalCompra,
  numeroFacturaProveedor,
  setNumeroFacturaProveedor,
  guardarCompra,
  compraAEditar
}) => {
  return (
    <Modal
      show={mostrar}
      onHide={() => setMostrar(false)}
      backdrop="static"
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {compraAEditar ? "Editar Compra" : "Nueva Compra"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row>
          <Col md={12}>
            <h5>Datos de la Compra</h5>

            <Form.Group className="mb-3">
              <Form.Label>Proveedor *</Form.Label>
              <Form.Select
                value={proveedorSeleccionado?.proveedor_id || ""}
                onChange={(e) => {
                  const proveedor = proveedores.find(
                    (p) => p.proveedor_id === Number(e.target.value)
                  );
                  setProveedorSeleccionado(proveedor || null);
                }}
              >
                <option value="">Seleccionar proveedor...</option>

                {proveedores.map((proveedor) => (
                  <option
                    key={proveedor.proveedor_id}
                    value={proveedor.proveedor_id}
                  >
                    {proveedor.nombre_proveedor}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Empleado *</Form.Label>
              <Form.Select
                value={empleadoSeleccionado?.empleado_id || ""}
                onChange={(e) => {
                  const empleado = empleados.find(
                    (emp) => emp.empleado_id === Number(e.target.value)
                  );
                  setEmpleadoSeleccionado(empleado || null);
                }}
              >
                <option value="">Seleccionar empleado...</option>

                {empleados.map((empleado) => (
                  <option
                    key={empleado.empleado_id}
                    value={empleado.empleado_id}
                  >
                    {empleado.nombre_empleado} {empleado.apellido_empleado}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Número de Factura del Proveedor *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: FAC-00125"
                    value={numeroFacturaProveedor}
                    onChange={(e) =>
                      setNumeroFacturaProveedor(e.target.value)
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Compra *</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={fechaCompra}
                    onChange={(e) => setFechaCompra(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Total de la Compra *</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={totalCompra}
                onChange={(e) => setTotalCompra(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>

        <Button
          variant="primary"
          onClick={guardarCompra}
          disabled={
            !proveedorSeleccionado ||
            !empleadoSeleccionado ||
            !fechaCompra ||
            !numeroFacturaProveedor.trim() ||
            Number(totalCompra) <= 0
          }
        >
          {compraAEditar ? "Actualizar Compra" : "Registrar Compra"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FormularioCompra;