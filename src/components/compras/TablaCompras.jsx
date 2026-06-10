import React from "react";
import { Table, Button, Badge } from "react-bootstrap";

const TablaCompras = ({
  compras = [],
  proveedores = [],
  empleados = [],
  abrirEdicion,
  verDetalles,
  eliminarCompra
}) => {

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";

    return new Date(fecha).toLocaleString("es-NI", {
      dateStyle: "short",
      timeStyle: "short"
    });
  };

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat("es-NI", {
      style: "currency",
      currency: "NIO",
    }).format(Number(valor || 0));
  };

  const obtenerIdProveedor = (proveedor) => {
    return proveedor?.proveedor_id ?? proveedor?.id_proveedor;
  };

  const obtenerIdEmpleado = (empleado) => {
    return empleado?.empleado_id ?? empleado?.id_empleado;
  };

  const obtenerNombreProveedor = (proveedorId) => {
    const proveedor = proveedores.find(
      p => Number(obtenerIdProveedor(p)) === Number(proveedorId)
    );

    if (!proveedor) return String(proveedorId || "Sin proveedor");

    return String(
      proveedor.nombre_proveedor ||
      proveedor.nombre ||
      proveedor.nombre_empresa ||
      proveedor.razon_social ||
      proveedor.empresa ||
      proveedor.nombre_contacto ||
      proveedor.contacto ||
      `Proveedor ${proveedorId}`
    );
  };

  const obtenerNombreEmpleado = (empleadoId) => {
    const empleado = empleados.find(
      e => Number(obtenerIdEmpleado(e)) === Number(empleadoId)
    );

    if (!empleado) return String(empleadoId || "Sin empleado");

    return String(
      `${empleado.nombre_empleado || empleado.nombre || empleado.nombre1 || ""} ${
        empleado.apellido_empleado || empleado.apellido || empleado.apellido1 || ""
      }`.trim() ||
      `Empleado ${empleadoId}`
    );
  };

  return (
    <Table striped hover responsive size="sm" className="align-middle">
      <thead className="table-dark">
        <tr>
          <th>ID</th>
          <th>Fecha</th>
          <th>Factura</th>
          <th>Proveedor</th>
          <th>Empleado</th>
          <th className="text-end">Total</th>
          <th>Estado</th>
          <th className="text-center">Acciones</th>
        </tr>
      </thead>

      <tbody>
        {compras.length > 0 ? (
          compras.map((compra) => (
            <tr key={compra.compra_id}>
              <td>{compra.compra_id}</td>

              <td>{formatearFecha(compra.fecha_compra)}</td>

              <td>
                {compra.numero_factura_proveedor || "—"}
              </td>

              <td>
                {compra.proveedores?.nombre_proveedor ||
                  obtenerNombreProveedor(compra.proveedor_id)}
              </td>

              <td>
                {compra.empleados
                  ? `${compra.empleados.nombre_empleado || ""} ${compra.empleados.apellido_empleado || ""}`.trim()
                  : obtenerNombreEmpleado(compra.empleado_id)}
              </td>

              <td className="text-end fw-bold text-success">
                {formatearMoneda(compra.total_compra)}
              </td>

              <td>
                <Badge bg={compra.activo ? "success" : "secondary"}>
                  {compra.activo ? "Activo" : "Inactivo"}
                </Badge>
              </td>

              <td className="text-center">
                <div className="d-flex justify-content-center gap-2">
                  {verDetalles && (
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={() => verDetalles(compra)}
                    >
                      <i className="bi bi-eye"></i>
                    </Button>
                  )}

                  {abrirEdicion && (
                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={() => abrirEdicion(compra)}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                  )}

                  {eliminarCompra && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => eliminarCompra(compra.compra_id)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="text-center text-muted py-3">
              No hay compras registradas
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default TablaCompras;