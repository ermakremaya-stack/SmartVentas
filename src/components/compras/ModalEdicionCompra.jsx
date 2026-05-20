import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalEdicionCompra = ({
    mostrarModalEdicion,
    setMostrarModalEdicion,
    compraEditar,
    setCompraEditar,
    actualizarCompra,
    proveedores = [],
    empleados = []
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    const manejoCambio = (e) => {
        const { name, value } = e.target;

        setCompraEditar((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleActualizar = async () => {
        if (deshabilitado) return;

        setDeshabilitado(true);

        await actualizarCompra();

        setDeshabilitado(false);
    };

    return (
        <Modal
            show={mostrarModalEdicion}
            onHide={() => setMostrarModalEdicion(false)}
            backdrop="static"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Editar Compra</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Proveedor *</Form.Label>

                                <Form.Select
                                    name="proveedor_id"
                                    value={compraEditar.proveedor_id || ""}
                                    onChange={manejoCambio}
                                >
                                    <option value="">Seleccione proveedor</option>

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
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Empleado *</Form.Label>

                                <Form.Select
                                    name="empleado_id"
                                    value={compraEditar.empleado_id || ""}
                                    onChange={manejoCambio}
                                >
                                    <option value="">Seleccione empleado</option>

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
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Total Compra *</Form.Label>

                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    name="total_compra"
                                    value={compraEditar.total_compra || ""}
                                    onChange={manejoCambio}
                                />

                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Número Factura</Form.Label>

                                <Form.Control
                                    type="text"
                                    name="numero_factura_proveedor"
                                    value={compraEditar.numero_factura_proveedor || ""}
                                    onChange={manejoCambio}
                                />

                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Fecha Compra</Form.Label>

                        <Form.Control
                            type="datetime-local"
                            name="fecha_compra"
                            value={compraEditar.fecha_compra || ""}
                            onChange={manejoCambio}
                        />

                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="switch"
                            label="Compra Activa"
                            name="activo"
                            checked={compraEditar.activo || false}
                            onChange={(e) =>
                                setCompraEditar((prev) => ({
                                    ...prev,
                                    activo: e.target.checked
                                }))
                            }
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
                    disabled={deshabilitado}
                >
                    {deshabilitado
                        ? "Actualizando..."
                        : "Actualizar Compra"}
                </Button>

            </Modal.Footer>
        </Modal>
    );
};

export default ModalEdicionCompra;