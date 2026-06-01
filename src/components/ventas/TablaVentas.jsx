import React from "react";
import { Table, Button, Badge } from "react-bootstrap";

export const TablaVentas = ({
    ventas,
    abrirModalEdicion,
    generarPDFVenta,
}) => {
    
    // Función auxiliar para formatear la fecha de Supabase (ISO string)
    const formatearFecha = (fechaString) => {
        if (!fechaString) return "---";
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString("es-NI", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Función auxiliar para formatear montos en Córdobas
    const formatearMoneda = (monto) => {
        return new Intl.NumberFormat("es-NI", {
            style: "currency",
            currency: "NIO",
        }).format(monto);
    };

    return (
        <Table striped bordered hover responsive size="sm" className="shadow-sm">
            <thead className="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Fecha / Hora</th>
                    <th>Cliente</th>
                    <th>Monto Total</th>
                    <th className="text-center">Estado</th>
                    <th className="text-center">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {ventas.map((venta) => {
                    // Extraemos de forma segura el objeto de relación 'clientes' inyectado por Supabase
                    const c = venta.clientes;
                    const nombreCliente = c
                        ? c.nombre_cliente
                            ? `${c.nombre_cliente} ${c.apellido_cliente || ""}`.trim()
                            : `${c.nombre1 || ""} ${c.apellido1 || ""}`.trim()
                        : "Cliente no especificado";

                    return (
                        <tr key={venta.id_venta} className="align-middle">
                            <td>{venta.id_venta}</td>
                            <td className="text-nowrap">{formatearFecha(venta.fecha_venta)}</td>
                            <td className="fw-semibold">
                                {nombreCliente} {c && <small className="text-muted d-block">{c.cedula}</small>}
                            </td>
                            <td className="fw-bold text-end pe-3">
                                {formatearMoneda(venta.total)}
                            </td>
                            <td className="text-center">
                                {venta.estado}
                            </td>
                            <td className="text-center text-nowrap">
                                <Button
                                    variant="outline-warning"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => abrirModalEdicion(venta)}
                                    title="Editar Venta / Cambiar Estado"
                                >
                                    <i className="bi bi-pencil"></i>
                                </Button>

                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => generarPDFVenta(venta)}
                                    title="Exportar Recibo PDF"
                                >
                                    <i className="bi bi-file-earmark-pdf"></i>
                                </Button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
};