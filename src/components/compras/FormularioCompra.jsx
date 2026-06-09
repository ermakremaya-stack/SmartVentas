import React, { useState } from "react";
import { Modal, Row, Col, Form, Button, Table } from "react-bootstrap";

const FormularioCompra = ({
  mostrar,
  setMostrar,
  proveedores,
  empleados,
  productos,
  proveedorSeleccionado,
  setProveedorSeleccionado,
  empleadoSeleccionado,
  setEmpleadoSeleccionado,
  fechaCompra,
  setFechaCompra,
  numeroFacturaProveedor,
  setNumeroFacturaProveedor,
  detalles,
  setDetalles,
  totalCompra,
  guardarCompra,
  compraAEditar
}) => {

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [precio, setPrecio] = useState(0);

  // ✅ Agregar producto
  const agregarDetalle = () => {
    if (!productoSeleccionado || cantidad <= 0 || precio <= 0) return;

    setDetalles(prev => {
      const existe = prev.find(p => p.producto_id === productoSeleccionado.producto_id);

      if (existe) {
        return prev.map(p =>
          p.producto_id === productoSeleccionado.producto_id
            ? { ...p, cantidad: p.cantidad + cantidad }
            : p
        );
      }

      return [
        ...prev,
        {
          producto_id: productoSeleccionado.producto_id,
          nombre_producto: productoSeleccionado.nombre_producto,
          cantidad,
          precio
        }
      ];
    });

    setCantidad(1);
    setPrecio(0);
    setProductoSeleccionado(null);
  };

  // ✅ Eliminar producto
  const eliminarDetalle = (id) => {
    setDetalles(prev => prev.filter(p => p.producto_id !== id));
  };

  // ✅ Calcular total
  const totalCalculado = detalles.reduce(
    (sum, d) => sum + d.cantidad * d.precio,
    0
  );

  return (
    <Modal show={mostrar} onHide={() => setMostrar(false)} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {compraAEditar ? "Editar Compra" : "Nueva Compra"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Proveedor *</Form.Label>
              <Form.Select
                value={proveedorSeleccionado?.proveedor_id || ""}
                onChange={(e) => {
                  const proveedor = proveedores.find(
                    p => p.proveedor_id === Number(e.target.value)
                  );
                  setProveedorSeleccionado(proveedor || null);
                }}
              >
                <option value="">Seleccionar...</option>
                {proveedores.map(p => (
                  <option key={p.proveedor_id} value={p.proveedor_id}>
                    {p.nombre_proveedor}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Empleado *</Form.Label>
              <Form.Select
                value={empleadoSeleccionado?.empleado_id || ""}
                onChange={(e) => {
                  const emp = empleados.find(
                    x => x.empleado_id === Number(e.target.value)
                  );
                  setEmpleadoSeleccionado(emp || null);
                }}
              >
                <option value="">Seleccionar...</option>
                {empleados.map(e => (
                  <option key={e.empleado_id} value={e.empleado_id}>
                    {e.nombre_empleado} {e.apellido_empleado}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Factura *</Form.Label>
              <Form.Control
                value={numeroFacturaProveedor}
                onChange={e => setNumeroFacturaProveedor(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Fecha *</Form.Label>
              <Form.Control
                type="datetime-local"
                value={fechaCompra}
                onChange={e => setFechaCompra(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <hr />

        {/* ✅ AGREGAR PRODUCTOS */}
        <h5>Agregar Productos</h5>

        <Row className="mb-2">
          <Col md={4}>
            <Form.Select
              value={productoSeleccionado?.producto_id || ""}
              onChange={(e) => {
                const prod = productos.find(
                  p => p.producto_id === Number(e.target.value)
                );
                setProductoSeleccionado(prod || null);
              }}
            >
              <option value="">Producto...</option>
              {productos.map(p => (
                <option key={p.producto_id} value={p.producto_id}>
                  {p.nombre_producto}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={2}>
            <Form.Control
              type="number"
              placeholder="Cant"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
            />
          </Col>

          <Col md={3}>
            <Form.Control
              type="number"
              placeholder="Precio compra"
              value={precio}
              onChange={(e) => setPrecio(Number(e.target.value))}
            />
          </Col>

          <Col md={3}>
            <Button onClick={agregarDetalle} className="w-100">
              Agregar
            </Button>
          </Col>
        </Row>

        {/* ✅ TABLA DETALLES */}
        <Table striped bordered size="sm">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {detalles.map(d => (
              <tr key={d.producto_id}>
                <td>{d.nombre_producto}</td>
                <td>{d.cantidad}</td>
                <td>{d.precio}</td>
                <td>{d.cantidad * d.precio}</td>
                <td>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => eliminarDetalle(d.producto_id)}
                  >
                    X
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* ✅ TOTAL AUTOMÁTICO */}
        <h5 className="text-end">
          Total: {totalCalculado.toFixed(2)}
        </h5>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>

        <Button
          onClick={guardarCompra}
          disabled={
            !proveedorSeleccionado ||
            !empleadoSeleccionado ||
            detalles.length === 0
          }
        >
          {compraAEditar ? "Actualizar" : "Guardar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FormularioCompra;