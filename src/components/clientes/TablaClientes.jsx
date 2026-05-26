import React from "react";
import { Table, Button, Badge } from "react-bootstrap";

const TablaClientes = ({
  clientes,
  abrirModalEdicion,
  abrirModalEliminacion,
  generarPDFCliente,
}) => {
  return (
    <Table striped bordered hover responsive size="sm" className="shadow-sm">
      <thead className="table-dark">
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
              {cliente.activo ? (
                <Badge bg="success"><i className="bi bi-check-circle me-1"></i> Activo</Badge>
              ) : (
                <Badge bg="secondary"><i className="bi bi-x-circle me-1"></i> Inactivo</Badge>
              )}
            </td>
            <td className="text-center">
              <Button
                variant="outline-warning"
                size="sm"
                className="me-2"
                onClick={() => abrirModalEdicion(cliente)}
                title="Editar Cliente"
              >
                <i className="bi bi-pencil"></i>
              </Button>

              <Button
                variant="outline-danger"
                size="sm"
                className="me-2"
                onClick={() => abrirModalEliminacion(cliente)}
                title="Eliminar Cliente"
              >
                <i className="bi bi-trash"></i>
              </Button>

              <Button
                variant="outline-primary"
                size="sm"
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

export default TablaClientes;