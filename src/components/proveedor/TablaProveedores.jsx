import React, { useState } from "react";
import { Table, Spinner, Button, Badge, Form } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaProveedores = ({
    proveedores,
    handleEditClick,
    handleDesactivar,
    handleActivar
}) => {

    const [busqueda, setBusqueda] = useState('');

    const proveedoresFiltrados = proveedores.filter((prov) =>
        prov.nombre_empresa.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Lista de Proveedores</h4>
                <Form.Control
                    type="text"
                    placeholder="Buscar proveedor..."
                    className="w-25"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            {!proveedores ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" role="status" />
                </div>
            ) : proveedores.length === 0 ? (
                <div className="text-center my-5">
                    <p className="text-muted">No hay proveedores registrados actualmente.</p>
                </div>
            ) : (
                <Table striped borderless hover responsive size="sm" className="align-middle">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Teléfono</th>
                            <th className="d-none d-md-table-cell">Email</th>
                            <th className="d-none d-lg-table-cell">Dirección</th>
                            <th>Estado</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* AQUI ESTABA EL CAMBIO: Debes usar proveedoresFiltrados */}
                        {proveedoresFiltrados.map((prov) => (
                            <tr key={prov.proveedor_id}>
                                <td>{prov.nombre_empresa}</td>
                                <td>{prov.telefono}</td>
                                <td className="d-none d-md-table-cell">{prov.email}</td>
                                <td className="d-none d-lg-table-cell">{prov.direccion}</td>
                                <td>
                                    <Badge bg={prov.activo ? "success" : "secondary"}>
                                        {prov.activo ? "Activo" : "Inactivo"}
                                    </Badge>
                                </td>
                                <td className="text-center">
                                    <Button variant="outline-primary" size="sm" onClick={() => handleEditClick(prov)}>
                                        <i className="bi bi-pencil"></i>
                                    </Button>
                                    <Button
                                        variant={prov.activo ? "outline-warning" : "outline-success"}
                                        size="sm"
                                        className="ms-2"
                                        onClick={() => prov.activo ? handleDesactivar(prov.proveedor_id) : handleActivar(prov.proveedor_id)}
                                    >
                                        <i className={`bi ${prov.activo ? "bi-dash-circle" : "bi-check-circle"}`}></i>
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

export default TablaProveedores;