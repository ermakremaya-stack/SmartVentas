import React, { useEffect, useMemo, useState } from "react";
import {
  Row,
  Col,
  Spinner,
  Alert,
  Form,
  Container,
  Badge,
  ButtonGroup,
  Button,
} from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import TarjetaCatalogo from "../components/catalogo/TarjetaCatalogo";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [ordenamiento, setOrdenamiento] = useState("nombre_asc");

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError(null);

      const { data: dataProductos, error: errorProductos } = await supabase
        .from("productos")
        .select("*")
        .order("producto_id", { ascending: true });

      if (errorProductos) {
        console.error("Error al cargar productos:", errorProductos.message);
        throw errorProductos;
      }

      const { data: dataCategorias, error: errorCategorias } = await supabase
        .from("categorias")
        .select("id_categoria, nombre_categoria, descripcion_categoria")
        .order("id_categoria", { ascending: true });

      if (errorCategorias) {
        console.error("Error al cargar categorías:", errorCategorias.message);
        throw errorCategorias;
      }

      const productosActivos = (dataProductos || []).filter(
        (producto) => producto.activo === true
      );

      setProductos(productosActivos);
      setCategorias(dataCategorias || []);
    } catch (err) {
      console.error("Error al cargar catálogo:", err.message);
      setError("No se pudieron cargar los productos. Intenta más tarde.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const obtenerNombreCategoria = (idCategoria) => {
    const categoria = categorias.find(
      (cat) => Number(cat.id_categoria) === Number(idCategoria)
    );

    return categoria?.nombre_categoria || `Categoría ${idCategoria}`;
  };

  const obtenerDescripcionCategoria = (idCategoria) => {
    const categoria = categorias.find(
      (cat) => Number(cat.id_categoria) === Number(idCategoria)
    );

    return categoria?.descripcion_categoria || "Sin descripción";
  };

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  const productosFiltrados = useMemo(() => {
    let filtrados = [...productos];

    if (categoriaSeleccionada !== "todas") {
      filtrados = filtrados.filter(
        (producto) =>
          Number(producto.categoria_id) === Number(categoriaSeleccionada)
      );
    }

    if (textoBusqueda.trim()) {
      const textoLower = textoBusqueda.toLowerCase().trim();

      filtrados = filtrados.filter((producto) => {
        const nombre = producto.nombre?.toLowerCase() || "";
        const categoria = obtenerNombreCategoria(producto.categoria_id)
          .toLowerCase();
        const descripcionCategoria = obtenerDescripcionCategoria(
          producto.categoria_id
        ).toLowerCase();
        const precioVenta = String(producto.precio_venta || "");
        const precioCompra = String(producto.precio_compra || "");

        return (
          nombre.includes(textoLower) ||
          categoria.includes(textoLower) ||
          descripcionCategoria.includes(textoLower) ||
          precioVenta.includes(textoLower) ||
          precioCompra.includes(textoLower)
        );
      });
    }

    switch (ordenamiento) {
      case "precio_menor":
        filtrados.sort(
          (a, b) => Number(a.precio_venta || 0) - Number(b.precio_venta || 0)
        );
        break;

      case "precio_mayor":
        filtrados.sort(
          (a, b) => Number(b.precio_venta || 0) - Number(a.precio_venta || 0)
        );
        break;

      case "nombre_desc":
        filtrados.sort((a, b) =>
          String(b.nombre || "").localeCompare(String(a.nombre || ""))
        );
        break;

      case "nombre_asc":
      default:
        filtrados.sort((a, b) =>
          String(a.nombre || "").localeCompare(String(b.nombre || ""))
        );
        break;
    }

    return filtrados;
  }, [productos, categorias, categoriaSeleccionada, textoBusqueda, ordenamiento]);

  const limpiarFiltros = () => {
    setCategoriaSeleccionada("todas");
    setTextoBusqueda("");
    setOrdenamiento("nombre_asc");
  };

  return (
    <Container fluid className="px-3 px-md-4 py-3">
      <div
        className="rounded-4 p-4 mb-4 shadow-sm text-white"
        style={{
          background:
            "linear-gradient(135deg, #198754 0%, #20c997 55%, #0dcaf0 100%)",
        }}
      >
        <Row className="align-items-center g-3">
          <Col md={8}>
            <Badge bg="light" text="success" className="mb-2 px-3 py-2">
              <i className="bi bi-basket2-fill me-2"></i>
              Supermercado
            </Badge>

            <h2 className="fw-bold mb-2">Catálogo</h2>

            <p className="mb-0 opacity-75">
              Encuentra abarrotes, bebidas, limpieza, carnes, frutas, verduras y más.
            </p>
          </Col>

          <Col md={4} className="text-md-end">
            <div className="bg-white bg-opacity-25 rounded-4 p-3 d-inline-block">
              <h4 className="fw-bold mb-0">{productosFiltrados.length}</h4>
              <small>productos disponibles</small>
            </div>
          </Col>
        </Row>
      </div>

      <div className="bg-white rounded-4 shadow-sm p-3 mb-4 border">
        <Row className="g-3 align-items-end">
          <Col xs={12} md={4} lg={3}>
            <Form.Group controlId="filtroCategoriaCatalogo">
              <Form.Label className="fw-semibold">
                <i className="bi bi-grid-fill me-2 text-success"></i>
                Categoría
              </Form.Label>

              <Form.Select
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                className="shadow-sm"
              >
                <option value="todas">Todas las categorías</option>

                {categorias.map((categoria) => (
                  <option
                    key={categoria.id_categoria}
                    value={categoria.id_categoria}
                  >
                    {categoria.nombre_categoria}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col xs={12} md={5} lg={5}>
            <Form.Group controlId="busquedaProductoCatalogo">
              <Form.Label className="fw-semibold">
                <i className="bi bi-search me-2 text-success"></i>
                Buscar producto
              </Form.Label>

              <CuadroBusquedas
                textoBusqueda={textoBusqueda}
                manejarCambioBusqueda={manejarBusqueda}
                placeholder="Buscar arroz, leche, jabón, bebidas..."
              />
            </Form.Group>
          </Col>

          <Col xs={12} md={3} lg={3}>
            <Form.Group controlId="ordenamientoCatalogo">
              <Form.Label className="fw-semibold">
                <i className="bi bi-sort-down me-2 text-success"></i>
                Ordenar por
              </Form.Label>

              <Form.Select
                value={ordenamiento}
                onChange={(e) => setOrdenamiento(e.target.value)}
                className="shadow-sm"
              >
                <option value="nombre_asc">Nombre A-Z</option>
                <option value="nombre_desc">Nombre Z-A</option>
                <option value="precio_menor">Menor precio</option>
                <option value="precio_mayor">Mayor precio</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col xs={12} lg={1}>
            <Button
              variant="outline-secondary"
              className="w-100"
              onClick={limpiarFiltros}
              title="Limpiar filtros"
            >
              <i className="bi bi-arrow-clockwise"></i>
            </Button>
          </Col>
        </Row>
      </div>

      {!cargando && categorias.length > 0 && (
        <Row className="mb-3">
          <Col className="d-flex flex-wrap gap-2">
            <ButtonGroup size="sm">
              <Button
                variant={
                  categoriaSeleccionada === "todas"
                    ? "success"
                    : "outline-success"
                }
                onClick={() => setCategoriaSeleccionada("todas")}
              >
                Todos
              </Button>

              {categorias.slice(0, 6).map((categoria) => (
                <Button
                  key={categoria.id_categoria}
                  variant={
                    String(categoriaSeleccionada) ===
                    String(categoria.id_categoria)
                      ? "success"
                      : "outline-success"
                  }
                  onClick={() =>
                    setCategoriaSeleccionada(String(categoria.id_categoria))
                  }
                >
                  {categoria.nombre_categoria}
                </Button>
              ))}
            </ButtonGroup>
          </Col>
        </Row>
      )}

      {cargando ? (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" variant="success" />
            <p className="mt-3 text-muted">
              Cargando productos del supermercado...
            </p>
          </Col>
        </Row>
      ) : error ? (
        <Alert variant="danger" className="text-center rounded-4">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      ) : productosFiltrados.length === 0 ? (
        <Alert variant="info" className="text-center rounded-4">
          <i className="bi bi-info-circle me-2"></i>
          No se encontraron productos que coincidan con tu búsqueda.
        </Alert>
      ) : (
        <Row className="g-4">
          {productosFiltrados.map((producto) => (
            <Col
              xs={12}
              sm={6}
              md={4}
              xl={3}
              xxl={2}
              key={producto.producto_id}
            >
              <TarjetaCatalogo
                producto={producto}
                categoriaNombre={obtenerNombreCategoria(producto.categoria_id)}
                categoriaDescripcion={obtenerDescripcionCategoria(
                  producto.categoria_id
                )}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Catalogo;