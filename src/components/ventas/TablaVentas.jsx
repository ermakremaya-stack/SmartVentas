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
    <Table striped borderless hover responsive size="sm">
      <thead>
        <tr>
          <th>ID</th>
          <th>Fecha / Hora</th>
          <th>Cliente</th>
          <th className="text-end pe-3">Monto Total</th>
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

          // Determinar si la venta está cerrada
          const esCerrada = venta.estado === "Cerrada";

          return (
            <tr key={venta.id_venta} className="align-middle">
              <td>{venta.id_venta}</td>
              <td className="text-nowrap">{formatearFecha(venta.fecha_venta)}</td>
              <td>
                <div>{nombreCliente}</div>
                {c && <small className="text-muted d-block">{c.cedula}</small>}
              </td>
              <td className="text-end pe-3">
                {formatearMoneda(venta.total)}
              </td>
              <td className="text-center">
                {/* Badge plano nativo exactamente igual al de empleados */}
                <span className="badge bg-primary">
                  {(venta.estado || "Abierta").toLowerCase()}
                </span>
              </td>
              <td className="text-center text-nowrap">
                {esCerrada ? (
                  <Button
                    variant="outline-success"
                    size="sm"
                    className="m-1"
                    onClick={() => abrirModalEdicion(venta)}
                    title="Ver detalles de la venta (Solo Lectura)"
                  >
                    <i className="bi bi-eye-fill"></i>
                  </Button>
                ) : (
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="m-1"
                    onClick={() => abrirModalEdicion(venta)}
                    title="Editar Venta / Cerrar Registro"
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                )}

                <Button
                  variant="outline-primary"
                  size="sm"
                  className="m-1"
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