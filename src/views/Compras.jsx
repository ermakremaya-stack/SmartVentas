import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Button,
    Spinner,
    Alert
} from "react-bootstrap";

import { supabase } from "../database/supabaseconfig";

import ModalRegistroCompra from "../components/compras/ModalRegistroCompra";
import ModalEdicionCompra from "../components/compras/ModalEdicionCompra";

import TarjetaCompra from "../components/compras/TarjetaCompra";

import NotificacionOperacion from "../components/NotificationOperation";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ornedamiento/Paginacion";

const Compras = () => {

    const [compras, setCompras] = useState([]);
    const [comprasFiltradas, setComprasFiltradas] = useState([]);

    const [proveedores, setProveedores] = useState([]);
    const [empleados, setEmpleados] = useState([]);

    const [cargando, setCargando] = useState(true);

    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

    const [textoBusqueda, setTextoBusqueda] = useState("");

    const [toast, setToast] = useState({
        mostrar: false,
        mensaje: "",
        tipo: ""
    });

    const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);
    const [paginaActual, establecerPaginaActual] = useState(1);

    const [nuevaCompra, setNuevaCompra] = useState({
        proveedor_id: "",
        empleado_id: "",
        total_compra: "",
        numero_factura_proveedor: "",
        fecha_compra: "",
        activo: true
    });

    const [compraEditar, setCompraEditar] = useState({
        compra_id: "",
        proveedor_id: "",
        empleado_id: "",
        total_compra: "",
        numero_factura_proveedor: "",
        fecha_compra: "",
        activo: true
    });

    const comprasPaginadas = comprasFiltradas.slice(
        (paginaActual - 1) * registrosPorPagina,
        paginaActual * registrosPorPagina
    );

    const manejarBusqueda = (e) => {
        setTextoBusqueda(e.target.value);
    };

    useEffect(() => {

        if (!textoBusqueda.trim()) {
            setComprasFiltradas(compras);
        } else {

            const texto = textoBusqueda.toLowerCase().trim();

            const filtradas = compras.filter((compra) =>
                compra.nombre_proveedor?.toLowerCase().includes(texto) ||
                compra.numero_factura_proveedor?.toLowerCase().includes(texto) ||
                compra.nombre_empleado?.toLowerCase().includes(texto)
            );

            setComprasFiltradas(filtradas);
        }

    }, [textoBusqueda, compras]);

    const cargarCompras = async () => {

        try {

            setCargando(true);

            const { data, error } = await supabase
                .from("compras")
                .select(`
                    *,
                    proveedores (
                        proveedor_id,
                        nombre_proveedor
                    ),
                    empleados (
                        empleado_id,
                        nombre_empleado,
                        apellido_empleado
                    )
                `)
                .order("compra_id", { ascending: false });

            if (error) {

                console.error(error.message);

                setToast({
                    mostrar: true,
                    mensaje: "Error al cargar compras.",
                    tipo: "error"
                });

                return;
            }

            const comprasFormateadas = data.map((compra) => ({
                ...compra,
                nombre_proveedor:
                    compra.proveedores?.nombre_proveedor,

                nombre_empleado:
                    `${compra.empleados?.nombre_empleado || ""} ${compra.empleados?.apellido_empleado || ""}`
            }));

            setCompras(comprasFormateadas);

        } catch (error) {

            console.error(error.message);

            setToast({
                mostrar: true,
                mensaje: "Error inesperado al cargar compras.",
                tipo: "error"
            });

        } finally {

            setCargando(false);
        }
    };

    const cargarProveedores = async () => {

        const { data, error } = await supabase
            .from("proveedores")
            .select("*")
            .order("nombre_proveedor");

        if (!error) {
            setProveedores(data || []);
        }
    };

    const cargarEmpleados = async () => {

        const { data, error } = await supabase
            .from("empleados")
            .select("*")
            .order("nombre_empleado");

        if (!error) {
            setEmpleados(data || []);
        }
    };

    useEffect(() => {

        cargarCompras();
        cargarProveedores();
        cargarEmpleados();

    }, []);

    const agregarCompra = async () => {

        try {

            if (
                !nuevaCompra.proveedor_id ||
                !nuevaCompra.empleado_id ||
                !nuevaCompra.total_compra
            ) {

                setToast({
                    mostrar: true,
                    mensaje: "Debe completar los campos obligatorios.",
                    tipo: "advertencia"
                });

                return;
            }

            const { error } = await supabase
                .from("compras")
                .insert([
                    {
                        proveedor_id: nuevaCompra.proveedor_id,
                        empleado_id: nuevaCompra.empleado_id,
                        total_compra: nuevaCompra.total_compra,
                        numero_factura_proveedor:
                            nuevaCompra.numero_factura_proveedor,
                        fecha_compra: nuevaCompra.fecha_compra,
                        activo: nuevaCompra.activo
                    }
                ]);

            if (error) {

                console.error(error.message);

                setToast({
                    mostrar: true,
                    mensaje: "Error al registrar compra.",
                    tipo: "error"
                });

                return;
            }

            setToast({
                mostrar: true,
                mensaje: "Compra registrada exitosamente.",
                tipo: "exito"
            });

            setNuevaCompra({
                proveedor_id: "",
                empleado_id: "",
                total_compra: "",
                numero_factura_proveedor: "",
                fecha_compra: "",
                activo: true
            });

            setMostrarModal(false);

            await cargarCompras();

        } catch (error) {

            console.error(error.message);

            setToast({
                mostrar: true,
                mensaje: "Error inesperado al registrar compra.",
                tipo: "error"
            });
        }
    };

    const abrirModalEdicion = (compra) => {

        setCompraEditar({
            compra_id: compra.compra_id,
            proveedor_id: compra.proveedor_id,
            empleado_id: compra.empleado_id,
            total_compra: compra.total_compra,
            numero_factura_proveedor:
                compra.numero_factura_proveedor,
            fecha_compra: compra.fecha_compra,
            activo: compra.activo
        });

        setMostrarModalEdicion(true);
    };

    const actualizarCompra = async () => {

        try {

            if (
                !compraEditar.proveedor_id ||
                !compraEditar.empleado_id ||
                !compraEditar.total_compra
            ) {

                setToast({
                    mostrar: true,
                    mensaje: "Debe completar los campos obligatorios.",
                    tipo: "advertencia"
                });

                return;
            }

            const { error } = await supabase
                .from("compras")
                .update({
                    proveedor_id: compraEditar.proveedor_id,
                    empleado_id: compraEditar.empleado_id,
                    total_compra: compraEditar.total_compra,
                    numero_factura_proveedor:
                        compraEditar.numero_factura_proveedor,
                    fecha_compra: compraEditar.fecha_compra,
                    activo: compraEditar.activo
                })
                .eq("compra_id", compraEditar.compra_id);

            if (error) {

                console.error(error.message);

                setToast({
                    mostrar: true,
                    mensaje: "Error al actualizar compra.",
                    tipo: "error"
                });

                return;
            }

            setMostrarModalEdicion(false);

            setToast({
                mostrar: true,
                mensaje: "Compra actualizada exitosamente.",
                tipo: "exito"
            });

            await cargarCompras();

        } catch (error) {

            console.error(error.message);

            setToast({
                mostrar: true,
                mensaje: "Error inesperado al actualizar compra.",
                tipo: "error"
            });
        }
    };

    return (

        <Container className="mt-3">

            <Row className="align-items-center mb-3">

                <Col xs={9} sm={7} lg={7}>
                    <h3 className="mb-0">
                        <i className="bi bi-bag-plus-fill me-2"></i>
                        Compras
                    </h3>
                </Col>

                <Col xs={3} sm={5} lg={5} className="text-end">

                    <Button
                        onClick={() => setMostrarModal(true)}
                    >
                        <i className="bi bi-plus-lg"></i>

                        <span className="d-none d-sm-inline ms-2">
                            Nueva Compra
                        </span>
                    </Button>

                </Col>

            </Row>

            <hr />

            {cargando && (
                <Row className="text-center my-5">

                    <Col>

                        <Spinner
                            animation="border"
                            variant="success"
                        />

                        <p className="mt-3 text-muted">
                            Cargando compras...
                        </p>

                    </Col>

                </Row>
            )}

            <Row className="mb-4">

                <Col md={6} lg={5}>

                    <CuadroBusquedas
                        textoBusqueda={textoBusqueda}
                        manejarCambioBusqueda={manejarBusqueda}
                        placeholder="Buscar compra..."
                    />

                </Col>

            </Row>

            {!cargando &&
                textoBusqueda.trim() &&
                comprasFiltradas.length === 0 && (

                    <Alert variant="info" className="text-center">

                        <i className="bi bi-info-circle me-2"></i>

                        No se encontraron compras.

                    </Alert>
                )}

            {!cargando &&
                comprasFiltradas.length > 0 && (

                    <Row>

                        <Col xs={12} className="d-lg-none">

                            <TarjetaCompra
                                compras={comprasPaginadas}
                                abrirModalEdicion={abrirModalEdicion}
                            />

                        </Col>

                    </Row>
                )}

            {!cargando &&
                comprasFiltradas.length > 0 && (

                    <Row>

                        <Col xs={12}>

                            <TarjetaCompra
                                compras={comprasPaginadas}
                                abrirModalEdicion={abrirModalEdicion}
                            />

                        </Col>

                    </Row>
                )}

            {comprasFiltradas.length > 0 && (

                <Paginacion
                    registrosPorPagina={registrosPorPagina}
                    totalRegistros={comprasFiltradas.length}
                    paginaActual={paginaActual}
                    establecerPaginaActual={establecerPaginaActual}
                    establecerRegistrosPorPagina={
                        establecerRegistrosPorPagina
                    }
                />
            )}

            <ModalRegistroCompra
                mostrarModal={mostrarModal}
                setMostrarModal={setMostrarModal}
                nuevaCompra={nuevaCompra}
                setNuevaCompra={setNuevaCompra}
                agregarCompra={agregarCompra}
                proveedores={proveedores}
                empleados={empleados}
            />

            <ModalEdicionCompra
                mostrarModalEdicion={mostrarModalEdicion}
                setMostrarModalEdicion={setMostrarModalEdicion}
                compraEditar={compraEditar}
                setCompraEditar={setCompraEditar}
                actualizarCompra={actualizarCompra}
                proveedores={proveedores}
                empleados={empleados}
            />

            <NotificacionOperacion
                mostrar={toast.mostrar}
                mensaje={toast.mensaje}
                tipo={toast.tipo}
                onCerrar={() =>
                    setToast({
                        ...toast,
                        mostrar: false
                    })
                }
            />

        </Container>
    );
};

export default Compras;