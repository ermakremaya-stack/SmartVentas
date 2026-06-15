import React from "react";
import { Table, Button, Badge } from "react-bootstrap";

export const TablaClientes = ({
  clientes,
  abrirModalEdicion,
  abrirModalEliminacion,
  generarPDFCliente,
}) => {
  return (
    <Table striped borderless hover responsive size="sm">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre Completo</th>
          <th>Cédula</th>
          <th>Ciudad</th>
          <th className="text-center">Estado</th>
          <th className="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {clientes.map((cliente) => (
          <tr key={cliente.cliente_id} className="align-middle">
            <td>{cliente.cliente_id}</td>
            <td className="fw-semibold">
              {`${cliente.nombre1} ${cliente.nombre2 || ""} ${cliente.apellido1} ${cliente.apellido2 || ""}`.replace(/\s+/g, ' ')}
            </td>
            <td>{cliente.cedula}</td>
            <td>{cliente.ciudad}</td>
            <td className="text-center">
              <span className={`badge bg-${cliente.activo ? "success" : "secondary"}`}>
                {cliente.activo ? "activo" : "inactivo"}
              </span>
            </td>
            <td className="text-center text-nowrap">
              <Button
                variant="outline-warning"
                size="sm"
                className="m-1"
                onClick={() => abrirModalEdicion(cliente)}
                title="Editar Cliente"
              >
                <i className="bi bi-pencil"></i>
              </Button>

              <Button
                variant="outline-danger"
                size="sm"
                className="m-1"
                onClick={() => abrirModalEliminacion(cliente)}
                title="Eliminar Cliente"
              >
                <i className="bi bi-trash"></i>
              </Button>

              <Button
                variant="outline-primary"
                size="sm"
                className="m-1"
                onClick={() => generarPDFCliente(cliente)}
                title="Exportar Ficha PDF"
              >
                <i className="bi bi-file-earmark-pdf"></i>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};