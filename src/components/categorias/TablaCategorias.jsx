import React from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaCategorias = ({
    categorias,
    abrirModalEdicion,
    abrirModalEliminacion
}) => {
    

    return (
        <>
            {!categorias ? (
                <div className="text-center my-5">
                    <h4>Cargando categorías...</h4>
                    <Spinner animation="border" variant="success" role="status" />
                </div>
            ) : categorias.length === 0 ? (
                <div className="text-center my-5">
                    <p className="text-muted">No hay categorías registradas actualmente.</p>
                </div>
            ) : (
                /* Si hay datos, mostramos la tabla */
                <Table striped borderless hover responsive size="sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th className="d-none d-md-table-cell">Descripción</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categorias.map((categoria) => (
                            <tr key={categoria.id_categoria}>
                                <td>{categoria.id_categoria}</td>
                                <td>{categoria.nombre_categoria}</td>
                                <td className="d-none d-md-table-cell">
                                    {categoria.descripcion_categoria}
                                </td>
                                <td className="text-center">
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => abrirModalEdicion(categoria)}
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </Button>

                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => abrirModalEliminacion(categoria)}
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

export default TablaCategorias;