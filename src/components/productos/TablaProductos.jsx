import React from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaProductos = ({
  productos,
  abrirModalEdicion,
  abrirModalEliminacion,
}) => {
  return (
    <>
      {!productos ? (
        <div className="text-center my-5">
          <h4>Cargando productos...</h4>
          <Spinner animation="border" variant="success" role="status" />
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center my-5">
          <p className="text-muted">
            No hay productos registrados actualmente.
          </p>
        </div>
      ) : (
        <Table striped borderless hover responsive size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría ID</th>
              <th className="d-none d-md-table-cell">Existencias</th>
              <th className="d-none d-md-table-cell">Precio Compra</th>
              <th className="d-none d-md-table-cell">Precio Venta</th>
              <th className="d-none d-md-table-cell">Activo</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((producto) => (
              <tr key={producto.producto_id}>
                <td>{producto.producto_id}</td>
                <td>{producto.nombre}</td>
                <td>{producto.categoria_id}</td>
                <td className="d-none d-md-table-cell">
                  {producto.existencias}
                </td>
                <td className="d-none d-md-table-cell">
                  {producto.precio_compra}
                </td>
                <td className="d-none d-md-table-cell">
                  {producto.precio_venta}
                </td>
                <td className="d-none d-md-table-cell">
                  {producto.activo ? "Sí" : "No"}
                </td>

                <td className="text-center">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => abrirModalEdicion(producto)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => abrirModalEliminacion(producto)}
                    className="ms-2"
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default TablaProductos;