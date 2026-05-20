import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalRegistroCompra = ({
    mostrarModal,
    setMostrarModal,
    nuevaCompra,
    setNuevaCompra,
    agregarCompra,
    proveedores = [],
    empleados = []
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    const manejoCambio = (e) => {
        const { name, value } = e.target;

        setNuevaCompra(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGuardar = async () => {
        if (deshabilitado) return;

        setDeshabilitado(true);

        await agregarCompra();

        setDeshabilitado(false);
    };

    return (
        <Modal
            show={mostrarModal}
            onHide={() => setMostrarModal(false)}
            backdrop="static"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Nueva Compra</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Proveedor *</Form.Label>

                                <Form.Select
                                    name="proveedor_id"
                                    value={nuevaCompra.proveedor_id || ""}
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
                                    value={nuevaCompra.empleado_id || ""}
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
                                    value={nuevaCompra.total_compra || ""}
                                    onChange={manejoCambio}
                                    placeholder="0.00"
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Número Factura</Form.Label>

                                <Form.Control
                                    type="text"
                                    name="numero_factura_proveedor"
                                    value={nuevaCompra.numero_factura_proveedor || ""}
                                    onChange={manejoCambio}
                                    placeholder="Ej: FAC-12345"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Fecha Compra</Form.Label>

                        <Form.Control
                            type="datetime-local"
                            name="fecha_compra"
                            value={nuevaCompra.fecha_compra || ""}
                            onChange={manejoCambio}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="switch"
                            label="Compra activa"
                            name="activo"
                            checked={nuevaCompra.activo || false}
                            onChange={(e) =>
                                setNuevaCompra(prev => ({
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
                    onClick={() => setMostrarModal(false)}
                >
                    Cancelar
                </Button>

                <Button
                    variant="primary"
                    onClick={handleGuardar}
                    disabled={deshabilitado}
                >
                    {deshabilitado ? "Guardando..." : "Guardar Compra"}
                </Button>

            </Modal.Footer>
        </Modal>
    );
};

export default ModalRegistroCompra;