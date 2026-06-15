import React, { useState } from "react";
import { Modal, Row, Col, Form, Button, Table } from "react-bootstrap";

const FormularioCompra = ({
  mostrar,
  setMostrar,
  resetFormulario,
  proveedores = [],
  empleados = [],
  productos = [],
  proveedorSeleccionado,
  setProveedorSeleccionado,
  empleadoSeleccionado,
  setEmpleadoSeleccionado,
  fechaCompra,
  setFechaCompra,
  numeroFacturaProveedor,
  setNumeroFacturaProveedor,
  detalles = [],
  setDetalles,
  totalCompra,
  guardarCompra,
  compraAEditar,
}) => {
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [precio, setPrecio] = useState(0);
  const [deshabilitado, setDeshabilitado] = useState(false);

  // ================= CERRAR MODAL =================
  const cerrarModal = () => {
    setMostrar(false);

    if (resetFormulario) {
      resetFormulario();
    }

    setProductoSeleccionado(null);
    setCantidad(1);
    setPrecio(0);
  };

  // ================= IDS SEGUROS =================
  const obtenerIdProveedor = (proveedor) => {
    return proveedor?.proveedor_id ?? proveedor?.id_proveedor;
  };

  const obtenerIdEmpleado = (empleado) => {
    return empleado?.empleado_id ?? empleado?.id_empleado;
  };

  const obtenerIdProducto = (producto) => {
    return producto?.producto_id ?? producto?.id_producto;
  };

  // ================= NOMBRES SEGUROS =================
  const obtenerNombreProveedor = (proveedor) => {
    const idProveedor = obtenerIdProveedor(proveedor);

    return String(
      proveedor?.nombre_proveedor ||
        proveedor?.nombre ||
        proveedor?.nombre_empresa ||
        proveedor?.razon_social ||
        proveedor?.empresa ||
        proveedor?.nombre_contacto ||
        proveedor?.contacto ||
        `Proveedor ${idProveedor}`
    );
  };

  const obtenerNombreEmpleado = (empleado) => {
    const idEmpleado = obtenerIdEmpleado(empleado);

    return String(
      `${empleado?.nombre_empleado || empleado?.nombre || empleado?.nombre1 || ""} ${
        empleado?.apellido_empleado ||
        empleado?.apellido ||
        empleado?.apellido1 ||
        ""
      }`.trim() || `Empleado ${idEmpleado}`
    );
  };

  const obtenerNombreProducto = (producto) => {
    const idProducto = obtenerIdProducto(producto);

    return String(
      producto?.nombre_producto ||
        producto?.nombre ||
        producto?.descripcion ||
        `Producto ${idProducto}`
    );
  };

  // ================= SUBTOTAL AUTOMÁTICO =================
  const subtotalActual = Number(cantidad || 0) * Number(precio || 0);

  // ================= AGREGAR PRODUCTO =================
  const agregarDetalle = () => {
    if (!productoSeleccionado || cantidad <= 0 || precio <= 0) return;

    const idProducto = obtenerIdProducto(productoSeleccionado);

    setDetalles((prev) => {
      const existe = prev.find(
        (p) => Number(p.producto_id) === Number(idProducto)
      );

      if (existe) {
        return prev.map((p) =>
          Number(p.producto_id) === Number(idProducto)
            ? {
                ...p,
                cantidad: Number(p.cantidad) + Number(cantidad),
                subtotal:
                  (Number(p.cantidad) + Number(cantidad)) * Number(p.precio),
              }
            : p
        );
      }

      return [
        ...prev,
        {
          producto_id: idProducto,
          nombre_producto: obtenerNombreProducto(productoSeleccionado),
          cantidad: Number(cantidad),
          precio: Number(precio),
          subtotal: Number(cantidad) * Number(precio),
        },
      ];
    });

    setCantidad(1);
    setPrecio(0);
    setProductoSeleccionado(null);
  };

  // ================= ELIMINAR PRODUCTO =================
  const eliminarDetalle = (id) => {
    setDetalles((prev) =>
      prev.filter((p) => Number(p.producto_id) !== Number(id))
    );
  };

  // ================= TOTAL =================
  const totalCalculado = detalles.reduce(
    (sum, d) => sum + Number(d.cantidad || 0) * Number(d.precio || 0),
    0
  );

  // ================= GUARDAR / ACTUALIZAR =================
  const manejarGuardar = async () => {
    if (deshabilitado) return;

    setDeshabilitado(true);

    try {
      await guardarCompra();
    } finally {
      setDeshabilitado(false);
    }
  };

  return (
    <Modal
      show={mostrar}
      onHide={cerrarModal}
      size="lg"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {compraAEditar ? "Actualizar Compra" : "Nueva Compra"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Proveedor *</Form.Label>

              <Form.Select
                value={
                  proveedorSeleccionado
                    ? obtenerIdProveedor(proveedorSeleccionado)
                    : ""
                }
                onChange={(e) => {
                  const proveedor = proveedores.find(
                    (p) =>
                      Number(obtenerIdProveedor(p)) === Number(e.target.value)
                  );

                  setProveedorSeleccionado(proveedor || null);
                }}
              >
                <option value="">Seleccionar...</option>

                {proveedores.map((p, index) => {
                  const idProveedor = obtenerIdProveedor(p);

                  return (
                    <option
                      key={idProveedor || `proveedor-${index}`}
                      value={idProveedor || ""}
                    >
                      {obtenerNombreProveedor(p)}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Empleado *</Form.Label>

              <Form.Select
                value={
                  empleadoSeleccionado
                    ? obtenerIdEmpleado(empleadoSeleccionado)
                    : ""
                }
                onChange={(e) => {
                  const emp = empleados.find(
                    (x) => Number(obtenerIdEmpleado(x)) === Number(e.target.value)
                  );

                  setEmpleadoSeleccionado(emp || null);
                }}
              >
                <option value="">Seleccionar...</option>

                {empleados.map((e, index) => {
                  const idEmpleado = obtenerIdEmpleado(e);

                  return (
                    <option
                      key={idEmpleado || `empleado-${index}`}
                      value={idEmpleado || ""}
                    >
                      {obtenerNombreEmpleado(e)}
                    </option>
                  );
                })}
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
                onChange={(e) => setNumeroFacturaProveedor(e.target.value)}
                placeholder="Ej: FAC-00125"
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Fecha *</Form.Label>
              <Form.Control
                type="datetime-local"
                value={fechaCompra}
                onChange={(e) => setFechaCompra(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <hr />

        <h5>Agregar Productos</h5>

        <Row className="mb-2">
          <Col md={3}>
            <Form.Label>Producto</Form.Label>
            <Form.Select
              value={
                productoSeleccionado
                  ? obtenerIdProducto(productoSeleccionado)
                  : ""
              }
              onChange={(e) => {
                const prod = productos.find(
                  (p) => Number(obtenerIdProducto(p)) === Number(e.target.value)
                );

                setProductoSeleccionado(prod || null);

                if (prod?.precio_compra) {
                  setPrecio(Number(prod.precio_compra));
                } else if (prod?.precio_unitario_compra) {
                  setPrecio(Number(prod.precio_unitario_compra));
                } else if (prod?.precio_venta) {
                  setPrecio(Number(prod.precio_venta));
                } else {
                  setPrecio(0);
                }

                setCantidad(1);
              }}
            >
              <option value="">Producto...</option>

              {productos.map((p, index) => {
                const idProducto = obtenerIdProducto(p);

                return (
                  <option
                    key={idProducto || `producto-${index}`}
                    value={idProducto || ""}
                  >
                    {obtenerNombreProducto(p)}
                  </option>
                );
              })}
            </Form.Select>
          </Col>

          <Col md={2}>
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              type="number"
              min="1"
              placeholder="Cant"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
            />
          </Col>

          <Col md={2}>
            <Form.Label>Precio unitario</Form.Label>
            <Form.Control
              type="number"
              min="0"
              step="0.01"
              placeholder="Precio compra"
              value={precio}
              onChange={(e) => setPrecio(Number(e.target.value))}
            />
          </Col>

          <Col md={2}>
            <Form.Label>Subtotal</Form.Label>
            <Form.Control
              type="number"
              value={subtotalActual.toFixed(2)}
              readOnly
            />
          </Col>

          <Col md={3} className="d-flex align-items-end">
            <Button
              onClick={agregarDetalle}
              className="w-100"
              disabled={!productoSeleccionado || cantidad <= 0 || precio <= 0}
            >
              <i className="bi bi-plus-lg me-1"></i>
              Agregar
            </Button>
          </Col>
        </Row>

        <Table striped bordered size="sm" responsive>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
              <th className="text-center">Acción</th>
            </tr>
          </thead>

          <tbody>
            {detalles.length > 0 ? (
              detalles.map((d, index) => (
                <tr key={d.producto_id || `detalle-${index}`}>
                  <td>{d.nombre_producto}</td>
                  <td>{d.cantidad}</td>
                  <td>C$ {Number(d.precio || 0).toFixed(2)}</td>
                  <td>
                    C${" "}
                    {(Number(d.cantidad || 0) * Number(d.precio || 0)).toFixed(
                      2
                    )}
                  </td>
                  <td className="text-center">
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => eliminarDetalle(d.producto_id)}
                    >
                      <i className="bi bi-x-lg"></i>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No hay productos agregados
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        <h5 className="text-end">
          Total: C$ {totalCalculado.toFixed(2)}
        </h5>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={cerrarModal}>
          Cancelar
        </Button>

        <Button
          variant={compraAEditar ? "warning" : "primary"}
          onClick={manejarGuardar}
          disabled={
            !proveedorSeleccionado ||
            !empleadoSeleccionado ||
            !numeroFacturaProveedor.trim() ||
            detalles.length === 0 ||
            deshabilitado
          }
        >
          {deshabilitado
            ? compraAEditar
              ? "Actualizando..."
              : "Guardando..."
            : compraAEditar
            ? "Actualizar"
            : "Guardar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FormularioCompra;