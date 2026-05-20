import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaCompra = ({
    compras,
    abrirModalEdicion,
}) => {

    const [cargando, setCargando] = useState(true);
    const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

    useEffect(() => {
        setCargando(!(compras && compras.length > 0));
    }, [compras]);

    const manejarTeclaEscape = useCallback((evento) => {
        if (evento.key === "Escape") setIdTarjetaActiva(null);
    }, []);

    useEffect(() => {
        window.addEventListener("keydown", manejarTeclaEscape);
        return () =>
            window.removeEventListener("keydown", manejarTeclaEscape);
    }, [manejarTeclaEscape]);

    const alternarTarjetaActiva = (id) => {
        setIdTarjetaActiva((anterior) =>
            anterior === id ? null : id
        );
    };

    return (
        <>
            {cargando ? (
                <div className="text-center my-5">
                    <h5>Cargando compras...</h5>
                    <Spinner animation="border" variant="success" />
                </div>
            ) : (
                <div>
                    {compras.map((compra) => {
                        const tarjetaActiva =
                            idTarjetaActiva === compra.compra_id;

                        return (
                            <Card
                                key={compra.compra_id}
                                className="mb-3 border-0 rounded-3 shadow-sm w-100"
                                onClick={() =>
                                    alternarTarjetaActiva(compra.compra_id)
                                }
                                tabIndex={0}
                                onKeyDown={(evento) => {
                                    if (evento.key === "Enter" || evento.key === " ") {
                                        evento.preventDefault();
                                        alternarTarjetaActiva(compra.compra_id);
                                    }
                                }}
                                aria-label={`Compra ${compra.compra_id}`}
                            >
                                <Card.Body className="p-2">
                                    <Row className="align-items-center gx-3">

                                        {/* Icono */}
                                        <Col xs="auto" className="px-2">
                                            <div
                                                className="bg-light d-flex align-items-center justify-content-center rounded"
                                                style={{ width: "60px", height: "60px" }}
                                            >
                                                <i className="bi bi-bag text-muted fs-3"></i>
                                            </div>
                                        </Col>

                                        {/* Info principal */}
                                        <Col className="text-start">
                                            <div className="fw-semibold">
                                                Proveedor: {compra.nombre_proveedor || "-"}
                                            </div>
                                            <div className="small text-muted">
                                                Factura: {compra.numero_factura_proveedor || "-"}
                                            </div>
                                            <div className="small text-muted">
                                                Fecha: {compra.fecha_compra}
                                            </div>
                                        </Col>

                                        {/* Info secundaria */}
                                        <Col
                                            xs="auto"
                                            className="d-flex flex-column align-items-end text-end"
                                        >
                                            <div className="fw-bold text-dark">
                                                ${compra.total_compra}
                                            </div>

                                            <div className="small text-muted">
                                                {compra.nombre_empleado || "-"}
                                            </div>

                                            <div className="fw-semibold small">
                                                {compra.activo ? "Activo" : "Inactivo"}
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>

                                {tarjetaActiva && (
                                    <div
                                        role="dialog"
                                        aria-modal="true"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIdTarjetaActiva(null);
                                        }}
                                        className="tarjeta-empleado-capa"
                                    >
                                        <div
                                            className="d-flex gap-2 tarjeta-empleado-botones-capa"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Button
                                                variant="outline-warning"
                                                size="sm"
                                                onClick={() => {
                                                    abrirModalEdicion(compra);
                                                    setIdTarjetaActiva(null);
                                                }}
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}
        </>
    );
};

export default TarjetaCompra;