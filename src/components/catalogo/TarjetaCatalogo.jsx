import React, { useMemo, useState } from "react";
import { Card, Badge, Modal, Button, Row, Col } from "react-bootstrap";

const TarjetaCatalogo = ({ producto, categoriaNombre }) => {
  const [mostrarModal, setMostrarModal] = useState(false);

  const precioVenta = Number(producto.precio_venta || 0);
  const precioCompra = Number(producto.precio_compra || 0);

  const ganancia = precioVenta - precioCompra;

  const porcentajeGanancia =
    precioCompra > 0 ? ((ganancia / precioCompra) * 100).toFixed(0) : 0;

  const estiloProducto = useMemo(() => {
    const texto = `${producto.nombre || ""} ${categoriaNombre || ""}`.toLowerCase();

    if (
      texto.includes("fruta") ||
      texto.includes("verdura") ||
      texto.includes("tomate") ||
      texto.includes("cebolla") ||
      texto.includes("papa") ||
      texto.includes("manzana") ||
      texto.includes("banano")
    ) {
      return {
        icono: "bi bi-apple",
        color: "#198754",
        fondo: "linear-gradient(135deg, #d1e7dd, #f8fff9)",
        etiqueta: "Fresco",
      };
    }

    if (
      texto.includes("leche") ||
      texto.includes("queso") ||
      texto.includes("yogurt") ||
      texto.includes("lácteo")
    ) {
      return {
        icono: "bi bi-cup-straw",
        color: "#0dcaf0",
        fondo: "linear-gradient(135deg, #cff4fc, #f8fdff)",
        etiqueta: "Lácteo",
      };
    }

    if (
      texto.includes("arroz") ||
      texto.includes("frijol") ||
      texto.includes("azúcar") ||
      texto.includes("aceite") ||
      texto.includes("harina") ||
      texto.includes("café")
    ) {
      return {
        icono: "bi bi-bag-fill",
        color: "#fd7e14",
        fondo: "linear-gradient(135deg, #ffe5d0, #fffaf5)",
        etiqueta: "Abarrote",
      };
    }

    if (
      texto.includes("agua") ||
      texto.includes("jugo") ||
      texto.includes("gaseosa") ||
      texto.includes("bebida") ||
      texto.includes("refresco")
    ) {
      return {
        icono: "bi bi-cup-straw",
        color: "#0d6efd",
        fondo: "linear-gradient(135deg, #cfe2ff, #f8fbff)",
        etiqueta: "Bebida",
      };
    }

    if (
      texto.includes("jabón") ||
      texto.includes("detergente") ||
      texto.includes("cloro") ||
      texto.includes("limpieza") ||
      texto.includes("desinfectante")
    ) {
      return {
        icono: "bi bi-droplet-fill",
        color: "#6f42c1",
        fondo: "linear-gradient(135deg, #e2d9f3, #fbf9ff)",
        etiqueta: "Limpieza",
      };
    }

    if (
      texto.includes("pollo") ||
      texto.includes("carne") ||
      texto.includes("res") ||
      texto.includes("cerdo") ||
      texto.includes("embutido")
    ) {
      return {
        icono: "bi bi-shop",
        color: "#dc3545",
        fondo: "linear-gradient(135deg, #f8d7da, #fff8f8)",
        etiqueta: "Carnes",
      };
    }

    return {
      icono: "bi bi-basket2-fill",
      color: "#198754",
      fondo: "linear-gradient(135deg, #e9ecef, #ffffff)",
      etiqueta: "Producto",
    };
  }, [producto.nombre, categoriaNombre]);

  const esOferta = precioVenta > 0 && precioVenta <= 50;
  const esDestacado = producto.producto_id % 2 === 0;

  return (
    <>
      <Card
        className="h-100 border-0 shadow-sm overflow-hidden rounded-4 catalogo-card"
        style={{
          cursor: "pointer",
          transition: "all 0.25s ease",
          backgroundColor: "#fff",
        }}
        role="button"
        tabIndex={0}
        onClick={() => setMostrarModal(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") setMostrarModal(true);
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow = "0 1rem 2rem rgba(0,0,0,.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "";
        }}
        aria-labelledby={`producto-${producto.producto_id}-title`}
      >
        <div className="position-relative">
          <div
            className="ratio ratio-1x1 d-flex align-items-center justify-content-center"
            style={{
              background: estiloProducto.fondo,
            }}
          >
            <div className="d-flex flex-column align-items-center justify-content-center h-100 w-100">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                style={{
                  width: "82px",
                  height: "82px",
                  backgroundColor: "#fff",
                }}
              >
                <i
                  className={`${estiloProducto.icono}`}
                  style={{
                    fontSize: "2.7rem",
                    color: estiloProducto.color,
                  }}
                ></i>
              </div>

              <span
                className="small fw-semibold mt-3 px-3 py-1 rounded-pill"
                style={{
                  color: estiloProducto.color,
                  backgroundColor: "rgba(255,255,255,.75)",
                }}
              >
                {estiloProducto.etiqueta}
              </span>
            </div>
          </div>

          <div className="position-absolute top-0 start-0 m-2 d-flex flex-column gap-1">
            {esOferta && (
              <Badge bg="danger" pill>
                Oferta
              </Badge>
            )}

            {esDestacado && (
              <Badge bg="warning" text="dark" pill>
                Popular
              </Badge>
            )}
          </div>

          <div className="position-absolute top-0 end-0 m-2">
            <Badge bg="success" pill>
              Disponible
            </Badge>
          </div>
        </div>

        <Card.Body className="d-flex flex-column p-3">
          <div className="mb-2">
            <Badge bg="light" text="dark" className="border">
              <i className="bi bi-tag me-1 text-success"></i>
              {categoriaNombre || "Sin categoría"}
            </Badge>
          </div>

          <Card.Title
            id={`producto-${producto.producto_id}-title`}
            className="h6 fw-bold text-dark mb-2"
            style={{
              minHeight: "40px",
            }}
          >
            {producto.nombre}
          </Card.Title>

          <div className="mt-auto">
            <div className="d-flex align-items-end justify-content-between gap-2">
              <div>
                <small className="text-muted">Precio</small>
                <h4 className="text-success fw-bold mb-0">
                  C$ {precioVenta.toFixed(2)}
                </h4>
              </div>

              <Button
                variant="outline-success"
                size="sm"
                className="rounded-circle"
                title="Ver detalle"
                onClick={(e) => {
                  e.stopPropagation();
                  setMostrarModal(true);
                }}
              >
                <i className="bi bi-eye"></i>
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Modal
        show={mostrarModal}
        onHide={() => setMostrarModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold fs-4">
            <i className={`${estiloProducto.icono} me-2`} style={{ color: estiloProducto.color }}></i>
            {producto.nombre}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="pt-3">
          <Row className="g-4">
            <Col md={5}>
              <div
                className="rounded-4 d-flex flex-column align-items-center justify-content-center shadow-sm"
                style={{
                  minHeight: "330px",
                  background: estiloProducto.fondo,
                }}
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center bg-white shadow-sm"
                  style={{
                    width: "130px",
                    height: "130px",
                  }}
                >
                  <i
                    className={`${estiloProducto.icono}`}
                    style={{
                      fontSize: "4rem",
                      color: estiloProducto.color,
                    }}
                  ></i>
                </div>

                <Badge
                  className="mt-4 px-3 py-2"
                  style={{
                    backgroundColor: estiloProducto.color,
                  }}
                >
                  {estiloProducto.etiqueta}
                </Badge>
              </div>
            </Col>

            <Col md={7}>
              <div className="mb-3 d-flex flex-wrap gap-2">
                <Badge bg="secondary" pill>
                  {categoriaNombre || "Sin categoría"}
                </Badge>

                <Badge bg="success" pill>
                  Disponible
                </Badge>

                {esOferta && (
                  <Badge bg="danger" pill>
                    Precio especial
                  </Badge>
                )}

                {esDestacado && (
                  <Badge bg="warning" text="dark" pill>
                    Producto popular
                  </Badge>
                )}
              </div>

              <h2 className="text-success fw-bold mb-1">
                C$ {precioVenta.toFixed(2)}
              </h2>

              <p className="text-muted mb-4">
                Producto disponible en supermercado.
              </p>

              <div className="bg-light rounded-4 p-3 mb-3">
                <h6 className="fw-bold mb-3">
                  <i className="bi bi-info-circle me-2 text-success"></i>
                  Información del producto
                </h6>

                <Row className="g-2">
                  <Col xs={6}>
                    <small className="text-muted">Código</small>
                    <div className="fw-semibold">#{producto.producto_id}</div>
                  </Col>

                  <Col xs={6}>
                    <small className="text-muted">Categoría</small>
                    <div className="fw-semibold">
                      {categoriaNombre || "Sin categoría"}
                    </div>
                  </Col>

                  <Col xs={6}>
                    <small className="text-muted">Precio compra</small>
                    <div className="fw-semibold">
                      C$ {precioCompra.toFixed(2)}
                    </div>
                  </Col>

                  <Col xs={6}>
                    <small className="text-muted">Precio venta</small>
                    <div className="fw-semibold text-success">
                      C$ {precioVenta.toFixed(2)}
                    </div>
                  </Col>
                </Row>
              </div>

              <div className="alert alert-success rounded-4 mb-0">
                <i className="bi bi-check-circle-fill me-2"></i>
                Este producto está activo y disponible para la venta.
              </div>

              {ganancia > 0 && (
                <div className="alert alert-light border rounded-4 mt-3 mb-0">
                  <i className="bi bi-graph-up-arrow me-2 text-success"></i>
                  Margen aproximado:{" "}
                  <strong>C$ {ganancia.toFixed(2)}</strong>{" "}
                  <span className="text-muted">
                    ({porcentajeGanancia}%)
                  </span>
                </div>
              )}
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={() => setMostrarModal(false)}>
            Cerrar
          </Button>

          <Button variant="success" onClick={() => setMostrarModal(false)}>
            <i className="bi bi-basket2-fill me-2"></i>
            Continuar viendo
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TarjetaCatalogo;