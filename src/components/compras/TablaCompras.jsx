import React from "react";
import { Table, Button } from "react-bootstrap";

const TablaCompras = ({ compras, abrirEdicion }) => {
  return (
    <Table striped hover responsive size="sm">
      <thead>
        <tr>
          <th>ID</th>
          <th>Fecha</th>
          <th>Factura Proveedor</th>
          <th>Proveedor</th>
          <th>Empleado</th>
          <th className="text-end">Total</th>
          <th>Estado</th>
          <th className="text-center">Acciones</th>
        </tr>
      </thead>

      <tbody>
        {compras.map((compra) => (
          <tr key={compra.compra_id}>
            <td>#{compra.compra_id}</td>

            <td>
              {compra.fecha_compra
                ? new Date(compra.fecha_compra).toLocaleString("es-NI")
                : "Sin fecha"}
            </td>

            <td>{compra.numero_factura_proveedor}</td>

            <td>
              {compra.proveedores?.nombre_proveedor}
            </td>

            <td>
              {compra.empleados?.nombre_empleado}{" "}
              {compra.empleados?.apellido_empleado}
            </td>

            <td className="text-end fw-bold">
              C$ {parseFloat(compra.total_compra || 0).toFixed(2)}
            </td>

            <td>
              {compra.activo ? (
                <span className="badge bg-success">Activo</span>
              ) : (
                <span className="badge bg-secondary">Inactivo</span>
              )}
            </td>

            <td className="text-center">
              <Button
                variant="outline-warning"
                size="sm"
                onClick={() => abrirEdicion(compra)}
              >
                <i className="bi bi-pencil"></i>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TablaCompras;