import React, { useState } from "react";
import { Modal, Form, Button, Row, Col, Table, Card, Badge } from "react-bootstrap";

export const FormularioVenta = ({
    mostrar,
    setMostrar,
    clientes,
    empleados,
    productos,
    clienteSeleccionado,
    setClienteSeleccionado,
    empleadoSeleccionado,
    setEmpleadoSeleccionado,
    metodoPago,
    setMetodoPago,
    detalles,
    totalGeneral,
    agregarDetalle,
    eliminarDetalle,
    actualizarCantidad,
    guardarVenta,
    ventaAEditar,
    cerrarVenta,
}) => {
    // Estados locales para el selector temporal de productos
    const [productoIdTemp, setProductoIdTemp] = useState("");
    const [cantidadTemp, setCantidadTemp] = useState(1);
    const [deshabilitado, setDeshabilitado] = useState(false);
    const [cerrandoRecord, setCerrandoRecord] = useState(false); // Spinner local para el botón de cerrar registro

    // Determinar si el documento actual ya está congelado en la base de datos
    const esSoloLectura = ventaAEditar?.estado === "Cerrada";

    // Formateador local de moneda (Córdobas)
    const formatearMoneda = (monto) => {
        return new Intl.NumberFormat("es-NI", {
            style: "currency",
            currency: "NIO",
        }).format(monto);
    };

    const handleAgregarProducto = (e) => {
        e.preventDefault();
        if (!productoIdTemp || esSoloLectura) return;

        const prod = productos.find((p) => p.producto_id === Number(productoIdTemp));
        if (prod) {
            agregarDetalle(prod, Number(cantidadTemp));
            // Resetear selectores temporales
            setProductoIdTemp("");
            setCantidadTemp(1);
        }
    };

    const handleEnviarFormulario = async (e) => {
        e.preventDefault();
        if (deshabilitado || esSoloLectura) return;

        setDeshabilitado(true);
        const exito = await guardarVenta();
        setDeshabilitado(false);

        // Si se guardó con éxito una nueva venta o edición, cerramos el modal
        if (exito) setMostrar(false);
    };

    // Manejador del botón manual para congelar la factura y procesar stock
    const handleCerrarRegistroDefinitivo = async () => {
        if (!ventaAEditar?.id_venta || cerrandoRecord) return;

        // Confirmación nativa de seguridad para evitar errores accidentales
        const seguro = window.confirm(
            `¿Está seguro que desea CERRAR la venta #${ventaAEditar.id_venta}? Una vez cerrada, se descontará el stock del inventario y no podrá volver a modificar sus datos ni sus artículos.`
        );

        if (!seguro) return;

        setCerrandoRecord(true);
        // Enviamos el ID y el estado actual de los detalles (carrito) para la RPC
        const exito = await cerrarVenta(ventaAEditar.id_venta, detalles);
        setCerrandoRecord(false);

        if (exito) {
            setMostrar(false); // Clausura el modal automáticamente al finalizar
        }
    };

    return (
        <Modal
            show={mostrar}
            onHide={() => setMostrar(false)}
            backdrop="static"
            keyboard={false}
            fullscreen="lg-down"
            size="xl"
        >
            {/* Cabecera responsiva: se apila en vertical en móviles muy pequeños */}
            <Modal.Header closeButton className="py-2 py-sm-3">
                <Modal.Title className="w-100 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center g-2 gap-2">
                    <div className="fs-5 fs-sm-4 text-truncate">
                        <i className={`bi ${ventaAEditar ? "bi-pencil-square text-warning" : "bi-receipt text-primary"} me-2`}></i>
                        {ventaAEditar ? `Modificar Venta # ${ventaAEditar.id_venta}` : "Generar Nueva Factura de Venta"}
                    </div>
                    {/* Badge indicador del estado real en la cabecera */}
                    {ventaAEditar && (
                        <Badge bg={esSoloLectura ? "danger" : "success"} className="fs-6 px-3 py-2 ms-0 ms-sm-3">
                            <i className={`bi ${esSoloLectura ? "bi-lock-fill" : "bi-unlock-fill"} me-1`}></i>
                            {ventaAEditar.estado || "Abierta"}
                        </Badge>
                    )}
                </Modal.Title>
            </Modal.Header>

            {/* FORMULARIO GENERAL: Forzamos dirección en columna y contención absoluta para evitar que arrastre el fondo */}
            <Form onSubmit={handleEnviarFormulario} className="d-flex flex-column overflow-hidden" style={{ maxHeight: "calc(100vh - 60px)" }}>

                {/* CUERPO DEL MODAL: Maneja su propio scroll de manera aislada e independiente */}
                <Modal.Body className="p-2 p-sm-3 overflow-y-auto" style={{ flex: "1 1 auto" }}>
                    {/* Alerta informativa si la factura es inmutable */}
                    {esSoloLectura && (
                        <div className="alert alert-danger d-flex align-items-start mb-3 shadow-sm p-2 p-sm-3" role="alert">
                            <i className="bi bi-exclamation-octagon-fill fs-4 me-2 lh-1"></i>
                            <div className="small">
                                <strong>Registro Protegido:</strong> Esta venta ha sido clasificada como <strong>Cerrada</strong>. No se permiten modificaciones en la cabecera ni en el desglose de productos.
                            </div>
                        </div>
                    )}

                    {/* SECCIÓN 1: DATOS MAESTROS (CABECERA) */}
                    <Card className="mb-3 bg-light border-0 shadow-sm">
                        <Card.Body className="p-2 p-sm-3">
                            <h6 className="text-uppercase text-secondary fw-bold mb-2 mb-sm-3 small"> Datos Generales </h6>
                            <Row className="g-2">
                                {/* Selector de Cliente */}
                                <Col xs={12} sm={6} md={4}>
                                    <Form.Group>
                                        <Form.Label className="small mb-1">Cliente <span className="text-danger">*</span></Form.Label>
                                        <Form.Select
                                            size="sm"
                                            value={clienteSeleccionado?.cliente_id || ""}
                                            onChange={(e) => {
                                                const cl = clientes.find((c) => c.cliente_id === Number(e.target.value));
                                                setClienteSeleccionado(cl || null);
                                            }}
                                            required
                                            disabled={!!ventaAEditar || esSoloLectura}
                                        >
                                            <option value="">-- Seleccionar Cliente --</option>
                                            {clientes.map((c) => (
                                                <option key={c.cliente_id} value={c.cliente_id}>
                                                    {c.nombre_cliente ? `${c.nombre_cliente} ${c.apellido_cliente || ""}` : `${c.nombre1} ${c.apellido1}`} ({c.cedula || 'S/C'})
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                {/* Selector de Empleado */}
                                <Col xs={12} sm={6} md={4}>
                                    <Form.Group>
                                        <Form.Label className="small mb-1">Atendido por <span className="text-danger">*</span></Form.Label>
                                        <Form.Select
                                            size="sm"
                                            value={empleadoSeleccionado?.id_empleado || ""}
                                            onChange={(e) => {
                                                const emp = empleados.find((em) => em.id_empleado === Number(e.target.value));
                                                setEmpleadoSeleccionado(emp || null);
                                            }}
                                            required
                                            disabled={esSoloLectura}
                                        >
                                            <option value="">-- Seleccionar Empleado --</option>
                                            {empleados.map((e) => (
                                                <option key={e.id_empleado} value={e.id_empleado}>
                                                    {`${e.nombre_empleado} ${e.apellido_empleado}`}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                {/* Método de Pago */}
                                <Col xs={12} sm={12} md={4}>
                                    <Form.Group>
                                        <Form.Label className="small mb-1">Método de Pago <span className="text-danger">*</span></Form.Label>
                                        <Form.Select
                                            size="sm"
                                            value={metodoPago}
                                            onChange={(e) => setMetodoPago(e.target.value)}
                                            required
                                            disabled={esSoloLectura}
                                        >
                                            <option value="efectivo">Efectivo</option>
                                            <option value="tarjeta">Tarjeta de Crédito / Débito</option>
                                            <option value="transferencia">Transferencia Electrónica</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* SECCIÓN 2: AGREGAR PRODUCTOS AL DETALLE */}
                    {!esSoloLectura && (
                        <Card className="mb-3 border-secondary-subtle shadow-sm">
                            <Card.Body className="p-2 p-sm-3">
                                <h6 className="text-uppercase text-secondary fw-bold mb-2 mb-sm-3 small">Agregar Artículos</h6>
                                <Row className="align-items-end g-2">
                                    <Col xs={12} md={7}>
                                        <Form.Group>
                                            <Form.Label className="small mb-1">Buscar Producto</Form.Label>
                                            <Form.Select
                                                size="sm"
                                                value={productoIdTemp}
                                                onChange={(e) => setProductoIdTemp(e.target.value)}
                                            >
                                                <option value="">-- Seleccione un artículo --</option>
                                                {productos.map((p) => (
                                                    <option key={p.producto_id} value={p.producto_id}>
                                                        {p.nombre} - {formatearMoneda(p.precio_venta)} (Stock: {p.stock})
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} md={3}>
                                        <Form.Group>
                                            <Form.Label className="small mb-1">Cantidad</Form.Label>
                                            <Form.Control
                                                size="sm"
                                                type="number"
                                                min="1"
                                                value={cantidadTemp}
                                                onChange={(e) => setCantidadTemp(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} md={2}>
                                        <Button
                                            size="sm"
                                            variant="success"
                                            className="w-100 d-flex align-items-center justify-content-center"
                                            onClick={handleAgregarProducto}
                                            disabled={!productoIdTemp}
                                        >
                                            <i className="bi bi-plus-circle me-1"></i> Añadir
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    )}

                    {/* SECCIÓN 3: CUERPO DEL DETALLE RESPONSIVO */}
                    <h5 className="mb-2 mt-3 text-dark d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center g-1 gap-1">
                        <span className="fs-7 text-uppercase text-secondary fw-bold">Cuerpo del Detalle</span>
                        <span className="fw-bold text-primary fs-5 fs-sm-4">Total: {formatearMoneda(totalGeneral)}</span>
                    </h5>

                    {/* 3A. VISTA EN LISTA DE TARJETAS: Reducimos ligeramente la altura máxima para resguardar pantallas móviles muy compactas */}
                    <div className="d-block d-lg-none mb-2" style={{ maxHeight: "180px", overflowY: "auto" }}>
                        {detalles.length === 0 ? (
                            <div className="text-center py-4 text-muted bg-white border rounded shadow-sm">
                                <i className="bi bi-cart-x fs-3 d-block mb-1"></i>
                                <span className="small">No hay artículos agregados todavía.</span>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-2">
                                {detalles.map((item) => (
                                    <div key={item.producto_id} className="p-2 bg-white border rounded shadow-sm">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div className="min-w-0 me-2">
                                                <div className="fw-bold text-dark small text-wrap">{item.nombre}</div>
                                                <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                                                    ID: {item.producto_id} | Precio: {formatearMoneda(item.precio)}
                                                </div>
                                            </div>
                                            <div className="text-end text-nowrap">
                                                <span className="fw-bold text-secondary small">
                                                    {formatearMoneda(item.cantidad * item.precio)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="text-muted small" style={{ fontSize: "0.75rem" }}>Cant:</span>
                                                <Form.Control
                                                    type="number"
                                                    size="sm"
                                                    className="text-center px-1"
                                                    style={{ maxWidth: "65px", fontSize: "0.85rem" }}
                                                    min="1"
                                                    disabled={esSoloLectura}
                                                    value={item.cantidad}
                                                    onChange={(e) => actualizarCantidad(item.producto_id, Number(e.target.value))}
                                                />
                                            </div>

                                            {!esSoloLectura && (
                                                <Button
                                                    variant="link"
                                                    className="text-danger p-0 border-0 m-0"
                                                    onClick={() => eliminarDetalle(item.producto_id)}
                                                >
                                                    <i className="bi bi-trash-fill fs-6"></i>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 3B. VISTA EN TABLA TRADICIONAL: oculta en móviles, visible desde escritorios (>= lg) */}
                    <div className="table-responsive border rounded bg-white shadow-sm d-none d-lg-block mb-3" style={{ maxHeight: "220px" }}>
                        <Table striped hover size="sm" className="mb-0 align-middle small">
                            <thead className="table-dark sticky-top">
                                <tr>
                                    <th style={{ width: "60px" }}>ID</th>
                                    <th>Descripción del Producto</th>
                                    <th className="text-end" style={{ width: "100px" }}>Precio</th>
                                    <th className="text-center" style={{ width: "100px" }}>Cant.</th>
                                    <th className="text-end" style={{ width: "110px" }}>Subtotal</th>
                                    {!esSoloLectura && <th className="text-center" style={{ width: "50px" }}>Acción</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {detalles.length === 0 ? (
                                    <tr>
                                        <td colSpan={esSoloLectura ? "5" : "6"} className="text-center py-4 text-muted italic">
                                            <i className="bi bi-cart-x fs-4 d-block mb-2"></i>
                                            No hay artículos agregados a la orden todavía.
                                        </td>
                                    </tr>
                                ) : (
                                    detalles.map((item) => (
                                        <tr key={item.producto_id}>
                                            <td className="text-muted">{item.producto_id}</td>
                                            <td className="fw-semibold text-dark">{item.nombre}</td>
                                            <td className="text-end">{formatearMoneda(item.precio)}</td>
                                            <td className="text-center">
                                                <Form.Control
                                                    type="number"
                                                    size="sm"
                                                    className="text-center mx-auto"
                                                    style={{ maxWidth: "65px" }}
                                                    min="1"
                                                    disabled={esSoloLectura}
                                                    value={item.cantidad}
                                                    onChange={(e) => actualizarCantidad(item.producto_id, Number(e.target.value))}
                                                />
                                            </td>
                                            <td className="text-end fw-bold text-secondary">
                                                {formatearMoneda(item.cantidad * item.precio)}
                                            </td>
                                            {!esSoloLectura && (
                                                <td className="text-center">
                                                    <Button
                                                        variant="link"
                                                        className="text-danger p-0"
                                                        onClick={() => eliminarDetalle(item.producto_id)}
                                                    >
                                                        <i className="bi bi-trash-fill fs-6"></i>
                                                    </Button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Modal.Body>

                {/* FOOTER DEL MODAL: Convertido a fondo sólido blanco y fijado de forma estricta para tapar cualquier renderizado residual del fondo */}
                <Modal.Footer className="bg-white border-top d-flex flex-column flex-sm-row justify-content-between gap-2 p-2 p-sm-3" style={{ position: "sticky", bottom: 0, zIndex: 1020 }}>
                    <div className="w-100 w-sm-auto text-center text-sm-start">
                        {ventaAEditar && !esSoloLectura && (
                            <Button
                                size="sm"
                                variant="danger"
                                className="w-100 w-sm-auto"
                                onClick={handleCerrarRegistroDefinitivo}
                                disabled={cerrandoRecord || deshabilitado || detalles.length === 0}
                            >
                                {cerrandoRecord ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Cerrando Factura...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-lock-fill me-1"></i> Cerrar Registro Definitivamente
                                    </>
                                )}
                            </Button>
                        )}
                    </div>

                    <div className="w-100 w-sm-auto d-flex justify-content-end gap-2">
                        <Button size="sm" variant="secondary" className="px-3" onClick={() => setMostrar(false)}>
                            {esSoloLectura ? "Salir" : "Cancelar"}
                        </Button>

                        {!esSoloLectura && (
                            <Button
                                size="sm"
                                type="submit"
                                variant={ventaAEditar ? "warning" : "primary"}
                                className="px-3"
                                disabled={detalles.length === 0 || deshabilitado}
                            >
                                {deshabilitado ? "Guardando..." : ventaAEditar ? "Guardar Cambios" : "Procesar Factura"}
                            </Button>
                        )}
                    </div>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};