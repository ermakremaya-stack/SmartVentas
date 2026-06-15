import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import NotificacionOperacion from "../components/NotificationOperation";
import TablaProductos from "../components/productos/TablaProductos";
import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
import ModalEliminacionProducto from "../components/productos/ModalEliminacionProducto";
import TarjetasProductos from "../components/productos/TarjetasProductos";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ornedamiento/Paginacion";

const Productos = () => {
  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);
  const [paginaActual, establecerPaginaActual] = useState(1);

  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  const [toast, setToast] = useState({
    mostrar: false,
    mensaje: "",
    tipo: "",
  });

  const [mostrarModal, setMostrarModal] = useState(false);

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [mostrarModalEliminacion, setMostrarModalEliminacion] =
    useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const [productoEditar, setProductoEditar] = useState({
    producto_id: "",
    nombre: "",
    categoria_id: "",
    precio_compra: "",
    precio_venta: "",
    activo: true,
  });

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    categoria_id: "",
    precio_compra: "",
    precio_venta: "",
    activo: true,
  });

  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
    establecerPaginaActual(1);
  };

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setProductosFiltrados(productos);
    } else {
      const textoLower = textoBusqueda.toLowerCase().trim();

      const filtrados = productos.filter(
        (producto) =>
          producto.nombre?.toLowerCase().includes(textoLower) ||
          String(producto.categoria_id).includes(textoLower) ||
          String(producto.precio_compra).includes(textoLower) ||
          String(producto.precio_venta).includes(textoLower) ||
          (producto.activo ? "activo" : "inactivo").includes(textoLower)
      );

      setProductosFiltrados(filtrados);
    }
  }, [textoBusqueda, productos]);

  const abrirModalEdicion = (producto) => {
    setProductoEditar({
      producto_id: producto.producto_id,
      nombre: producto.nombre,
      categoria_id: producto.categoria_id,
      precio_compra: producto.precio_compra,
      precio_venta: producto.precio_venta,
      activo: producto.activo,
    });

    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (producto) => {
    setProductoAEliminar(producto);
    setMostrarModalEliminacion(true);
  };

  const cargarProductos = async () => {
    try {
      setCargando(true);

      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("producto_id", { ascending: true });

      if (error) {
        console.error("Error al cargar productos:", error.message);
        setToast({
          mostrar: true,
          mensaje: "Error al cargar productos.",
          tipo: "error",
        });
        return;
      }

      setProductos(data || []);
    } catch (err) {
      console.error("Excepción al cargar productos:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al cargar productos.",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const manejoCambioInput = (e) => {
    const { name, value, type, checked } = e.target;

    setNuevoProducto((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value, type, checked } = e.target;

    setProductoEditar((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const agregarProducto = async () => {
    try {
      if (
        !nuevoProducto.nombre.trim() ||
        nuevoProducto.categoria_id === "" ||
        nuevoProducto.precio_compra === "" ||
        nuevoProducto.precio_venta === ""
      ) {
        setToast({
          mostrar: true,
          mensaje: "Debe llenar todos los campos.",
          tipo: "advertencia",
        });
        return;
      }

      const { error } = await supabase.from("productos").insert([
        {
          nombre: nuevoProducto.nombre,
          categoria_id: Number(nuevoProducto.categoria_id),
          precio_compra: Number(nuevoProducto.precio_compra),
          precio_venta: Number(nuevoProducto.precio_venta),
          activo: nuevoProducto.activo,
        },
      ]);

      if (error) {
        console.error("Error al agregar producto:", error.message);
        setToast({
          mostrar: true,
          mensaje: "Error al registrar el producto.",
          tipo: "error",
        });
        return;
      }

      setToast({
        mostrar: true,
        mensaje: `Producto "${nuevoProducto.nombre}" registrado exitosamente.`,
        tipo: "exito",
      });

      setNuevoProducto({
        nombre: "",
        categoria_id: "",
        precio_compra: "",
        precio_venta: "",
        activo: true,
      });

      setMostrarModal(false);

      await cargarProductos();
    } catch (err) {
      console.error("Excepción al agregar producto:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al registrar producto.",
        tipo: "error",
      });
    }
  };

  const actualizarProducto = async () => {
    try {
      if (
        !productoEditar.nombre.trim() ||
        productoEditar.categoria_id === "" ||
        productoEditar.precio_compra === "" ||
        productoEditar.precio_venta === ""
      ) {
        setToast({
          mostrar: true,
          mensaje: "Debe llenar todos los campos.",
          tipo: "advertencia",
        });
        return;
      }

      setMostrarModalEdicion(false);

      const { error } = await supabase
        .from("productos")
        .update({
          nombre: productoEditar.nombre,
          categoria_id: Number(productoEditar.categoria_id),
          precio_compra: Number(productoEditar.precio_compra),
          precio_venta: Number(productoEditar.precio_venta),
          activo: productoEditar.activo,
        })
        .eq("producto_id", productoEditar.producto_id);

      if (error) {
        console.error("Error al actualizar producto:", error.message);
        setToast({
          mostrar: true,
          mensaje: `Error al actualizar el producto ${productoEditar.nombre}.`,
          tipo: "error",
        });
        return;
      }

      await cargarProductos();

      setToast({
        mostrar: true,
        mensaje: `Producto ${productoEditar.nombre} actualizado exitosamente.`,
        tipo: "exito",
      });
    } catch (err) {
      console.error("Excepción al actualizar producto:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al actualizar producto.",
        tipo: "error",
      });
    }
  };

  const eliminarProducto = async () => {
    if (!productoAEliminar) return;

    try {
      setMostrarModalEliminacion(false);

      const { error } = await supabase
        .from("productos")
        .delete()
        .eq("producto_id", productoAEliminar.producto_id);

      if (error) {
        console.error("Error al eliminar producto:", error.message);
        setToast({
          mostrar: true,
          mensaje: `Error al eliminar el producto ${productoAEliminar.nombre}.`,
          tipo: "error",
        });
        return;
      }

      await cargarProductos();

      setToast({
        mostrar: true,
        mensaje: `Producto ${productoAEliminar.nombre} eliminado exitosamente.`,
        tipo: "exito",
      });

      setProductoAEliminar(null);
    } catch (err) {
      console.error("Excepción al eliminar producto:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al eliminar producto.",
        tipo: "error",
      });
    }
  };

  return (
    <Container className="mt-3">
      <Row className="align-items-center mb-3">
        <Col xs={9} sm={7} lg={7} className="d-flex align-items-center">
          <h3 className="mb-0">
            <i className="bi bi-box-seam-fill me-2"></i>
            Productos
          </h3>
        </Col>

        <Col xs={3} sm={5} md={5} lg={5} className="text-end">
          <Button onClick={() => setMostrarModal(true)} size="md">
            <i className="bi-plus-lg"></i>
            <span className="d-none d-sm-inline ms-2">Nuevo Producto</span>
          </Button>
        </Col>
      </Row>

      <hr />

      {cargando && (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" variant="success" size="lg" />
            <p className="mt-3 text-muted">Cargando productos...</p>
          </Col>
        </Row>
      )}

      {!cargando && (
        <Row className="mb-4">
          <Col md={6} lg={5}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarBusqueda}
              placeholder="Buscar por nombre, categoría, precio o estado..."
            />
          </Col>
        </Row>
      )}

      {!cargando &&
        textoBusqueda.trim() &&
        productosFiltrados.length === 0 && (
          <Row className="mb-4">
            <Col>
              <Alert variant="info" className="text-center">
                <i className="bi bi-info-circle me-2"></i>
                No se encontraron productos que coincidan con "{textoBusqueda}".
              </Alert>
            </Col>
          </Row>
        )}

      {!cargando && productosFiltrados.length > 0 && (
        <Row>
          <Col xs={12} sm={12} md={12} className="d-lg-none">
            <TarjetasProductos
              productos={productosPaginados}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
        </Row>
      )}

      {!cargando && productosFiltrados.length > 0 && (
        <Row>
          <Col lg={12} className="d-none d-lg-block">
            <TablaProductos
              productos={productosPaginados}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
        </Row>
      )}

      {!cargando && productosFiltrados.length > 0 && (
        <Paginacion
          registrosPorPagina={registrosPorPagina}
          totalRegistros={productosFiltrados.length}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          establecerRegistrosPorPagina={establecerRegistrosPorPagina}
        />
      )}

      <ModalRegistroProducto
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoProducto={nuevoProducto}
        manejoCambioInput={manejoCambioInput}
        agregarProducto={agregarProducto}
      />

      <ModalEdicionProducto
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        productoEditar={productoEditar}
        manejoCambioInputEdicion={manejoCambioInputEdicion}
        actualizarProducto={actualizarProducto}
      />

      <ModalEliminacionProducto
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarProducto={eliminarProducto}
        producto={productoAEliminar}
      />

      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />
    </Container>
  );
};

export default Productos;