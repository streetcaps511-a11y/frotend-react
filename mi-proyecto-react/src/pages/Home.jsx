// src/pages/Home.jsx
import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { 
  FaArrowRight, FaFire, FaStar, FaShoppingCart, FaTimes, 
  FaTag, FaPercent, FaExclamationCircle
} from "react-icons/fa";
import { initialCategories, initialProducts, initialSizes } from "../data";

const Home = ({ addToCart }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const handleSearch = (event) => {
      setSearchQuery(event.detail.query || "");
    };
    window.addEventListener("globalSearchFilter", handleSearch);
    return () => window.removeEventListener("globalSearchFilter", handleSearch);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return initialProducts;
    const query = searchQuery.toLowerCase();
    return initialProducts.filter((product) => {
      return (
        product.nombre?.toLowerCase().includes(query) ||
        product.descripcion?.toLowerCase().includes(query) ||
        product.categoria?.toLowerCase().includes(query) ||
        product.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }, [searchQuery]);

  const destacados = filteredProducts
    .filter((p) => (p.destacado || p.isFeatured) && p.isActive)
    .slice(0, 8);
  const masComprados = filteredProducts
    .filter((p) => p.isActive)
    .sort((a, b) => (b.sales || 0) - (a.sales || 0))
    .slice(0, 4);

  // ======================================================
  // COMPONENTE: TARJETA DE IMAGEN SIN CANTIDAD NI PRECIO
  // ======================================================
  const ImageOnlyCard = ({ product }) => {
    const isBestSeller = product.sales > 50;
    const isFeatured = product.destacado || product.isFeatured;
    const hasDiscount = product.hasDiscount && product.originalPrice > product.precio;
    const unidadesDisponibles = product.stock || 0;
    const isLowStock = unidadesDisponibles > 0 && unidadesDisponibles <= 10;
    const isOutOfStock = unidadesDisponibles <= 0;

    const handleCartClick = (e) => {
      e.stopPropagation();
      window.location.href = '/cart';
    };
    const handleViewDetails = (e) => {
      e.stopPropagation();
      setSelectedProduct(product);
    };

    return (
      <div 
        className="image-only-card" 
        onClick={() => setSelectedProduct(product)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && setSelectedProduct(product)}
      >
        <div className="image-container">
          <img 
            src={product.imagenes?.[0] || "https://via.placeholder.com/600x400/1E293B/FFFFFF?text=Sin+Imagen"} 
            alt={product.nombre}
            className="product-image"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/600x400/1E293B/FFFFFF?text=Sin+Imagen";
            }}
          />
          {/* BADGES */}
          {hasDiscount && (
            <div className="top-left-badge discount-badge-left">
              <FaPercent size={10} /> Oferta
            </div>
          )}
          {isBestSeller && (
            <div className="top-right-badge best-seller-badge-right">
              <FaShoppingCart size={10} /> Más Vendido
            </div>
          )}
          {!isBestSeller && isFeatured && (
            <div className="top-right-badge featured-badge-right">
              <FaStar size={10} /> Destacado
            </div>
          )}
          {isLowStock && (
            <div className="top-center-badge low-stock-badge">
              <FaExclamationCircle size={10} /> Últimas {unidadesDisponibles}
            </div>
          )}
          {isOutOfStock && (
            <div className="top-center-badge out-of-stock-badge">
              <FaTimes size={10} /> Agotado
            </div>
          )}
          {/* NOMBRE DEL PRODUCTO SIN FONDO */}
          <div className="product-name-bottom">
            <span>{product.nombre || "Producto sin nombre"}</span>
          </div>
        </div>
        <div className="image-overlay">
          <button 
            className="cart-icon-bottom-left"
            onClick={handleCartClick}
            aria-label="Ir al carrito"
          >
            <FaShoppingCart className="cart-icon-dark" />
          </button>
          <button 
            className="view-details-bottom-right"
            onClick={handleViewDetails}
            aria-label="Ver detalles del producto"
          >
            <span className="view-details-text">Ver detalles</span>
          </button>
        </div>
      </div>
    );
  };

  // ======================================================
  // MODAL CORREGIDO - CANTIDAD POR TALLA + TOTAL ACUMULADO
  // ======================================================
  const ProductModal = ({ product, onClose }) => {
    if (!product) return null;

    const [selectedSizesWithQuantity, setSelectedSizesWithQuantity] = useState([]);
    const availableSizeOptions = initialSizes.filter(sizeOpt =>
      !product.tallas || product.tallas.includes(sizeOpt.value)
    );
    const [showSizeError, setShowSizeError] = useState(false);

    // Función para manejar selección de tallas
    // Si la talla ya está seleccionada, incrementa la cantidad.
    const handleSizeSelect = (size) => {
      setSelectedSizesWithQuantity(prev => {
        const existingItem = prev.find(item => item.size === size);
        if (existingItem) {
          // Ya está seleccionada, incrementamos la cantidad.
          return prev.map(item =>
            item.size === size 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          // No está seleccionada, la agregamos con cantidad 1.
          return [...prev, { size, quantity: 1 }];
        }
      });
      setShowSizeError(false);
    };

    // Incrementar cantidad para una talla específica
    const handleIncreaseQuantity = (size) => {
      setSelectedSizesWithQuantity(prev =>
        prev.map(item =>
          item.size === size 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    };

    // Decrementar cantidad para una talla específica
    const handleDecreaseQuantity = (size) => {
      setSelectedSizesWithQuantity(prev =>
        prev.map(item =>
          item.size === size && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ).filter(item => item.quantity > 0)
      );
    };

    // Calcular el total general
    const calculateTotal = () => {
      return selectedSizesWithQuantity.reduce((total, item) => {
        return total + (product.precio * item.quantity);
      }, 0);
    };

    // Calcular el total de unidades
    const calculateTotalUnits = () => {
      return selectedSizesWithQuantity.reduce((total, item) => {
        return total + item.quantity;
      }, 0);
    };

    const handleAddToCartAndClose = () => {
      if (selectedSizesWithQuantity.length === 0 && availableSizeOptions.length > 0) {
        setShowSizeError(true);
        return;
      }

      if (availableSizeOptions.length === 0) {
        const productToAdd = { 
          ...product, 
          tallaSeleccionada: "Única",
          cantidad: 1,
          idUnico: `${product.id}-unique-${Date.now()}`
        };
        addToCart(productToAdd);
      } else {
        selectedSizesWithQuantity.forEach(item => {
          const productToAdd = { 
            ...product, 
            tallaSeleccionada: item.size,
            cantidad: item.quantity,
            idUnico: `${product.id}-${item.size}-${Date.now()}`
          };
          addToCart(productToAdd);
        });
      }
      onClose();
    };

    const openFullscreenImage = (imageUrl) => {
      setSelectedImage(imageUrl);
    };

    const FullscreenImageModal = ({ imageUrl, onClose }) => {
      if (!imageUrl) return null;
      return (
        <div className="fullscreen-modal-overlay" onClick={onClose}>
          <div className="fullscreen-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="fullscreen-modal-close" onClick={onClose}>
              <FaTimes size={20} />
            </button>
            <img src={imageUrl} alt="Imagen a pantalla completa" className="fullscreen-image" />
          </div>
        </div>
      );
    };

    return (
      <>
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content modal-centered" onClick={(e) => e.stopPropagation()}>
            {/* Contenedor horizontal */}
            <div className="modal-horizontal-container">
              {/* Lado izquierdo: imagen */}
              <div className="modal-image-side">
                <div className="modal-image-centered">
                  <img
                    src={product.imagenes?.[0] || "https://via.placeholder.com/600x400/1E293B/FFFFFF?text=Sin+Imagen"}
                    alt={product.nombre}
                    className="modal-img-main-centered"
                    onClick={() => openFullscreenImage(product.imagenes?.[0])}
                    style={{ cursor: 'pointer' }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/600x400/1E293B/FFFFFF?text=Sin+Imagen";
                    }}
                  />
                </div>
              </div>

              {/* Lado derecho: información */}
              <div className="modal-info-side">
                <div className="tags-top-centered">
                  {product.tags?.map((tag, index) => (
                    <span key={index} className="tag-item-centered">
                      <FaTag size={8} /> #{tag.toUpperCase()}
                    </span>
                  ))}
                </div>

                <div className="modal-name-price-row">
                  <span className="modal-product-type">{product.nombre}</span>
                  <span className="product-price-inline">${product.precio.toLocaleString()}</span>
                </div>

                {/* SECCIÓN DE TALLAS */}
                <div className="size-buttons-section">
                  <div className="size-buttons-label">Selecciona tallas (puedes elegir varias):</div>
                  {showSizeError && availableSizeOptions.length > 0 && (
                    <div className="size-error-alert">
                      <FaExclamationCircle size={12} />
                      <span>Debe seleccionar al menos una talla</span>
                    </div>
                  )}

                  <div className="size-buttons-compact-grid">
                    {availableSizeOptions.length > 0 ? (
                      availableSizeOptions.map((sizeOption) => {
                        const selectedItem = selectedSizesWithQuantity.find(item => item.size === sizeOption.value);
                        const isSelected = !!selectedItem;
                        return (
                          <div key={sizeOption.value} className="size-quantity-container">
                            <button
                              className={`size-btn-compact ${isSelected ? 'size-btn-compact-selected' : ''}`}
                              onClick={() => handleSizeSelect(sizeOption.value)}
                            >
                              {sizeOption.label}
                            </button>
                            {/* Controles de cantidad para cada talla seleccionada */}
                            {isSelected && (
                              <div className="size-quantity-controls">
                                <button 
                                  className="qty-btn-sm minus"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDecreaseQuantity(sizeOption.value);
                                  }}
                                >
                                  -
                                </button>
                                {/* Color rojo si quedan 2 o 3 unidades */}
                                <span 
                                  className={`qty-sm-display ${product.stock !== undefined && product.stock <= 3 ? 'low-stock-number' : ''}`}
                                >
                                  {selectedItem.quantity}
                                </span>
                                <button 
                                  className="qty-btn-sm plus"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleIncreaseQuantity(sizeOption.value);
                                  }}
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="size-quantity-container">
                        <button className="size-btn-compact size-btn-compact-selected" disabled>
                          Única
                        </button>
                        <div className="size-quantity-controls">
                          <button className="qty-btn-sm minus" disabled>-</button>
                          <span className="qty-sm-display">1</span>
                          <button className="qty-btn-sm plus" disabled>+</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* RESUMEN */}
                {selectedSizesWithQuantity.length > 0 && (
                  <div className="sizes-summary">
                    <div className="sizes-summary-label">Seleccionados:</div>
                    <div className="sizes-summary-list">
                      {selectedSizesWithQuantity.map(item => (
                        <div key={item.size} className="size-summary-item">
                          <span className="size-label">{item.size}</span>
                          <span className="size-quantity">x{item.quantity}</span>
                          <span className="size-subtotal">
                            ${(product.precio * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TOTAL */}
                <div className="total-section-general">
                  <span className="total-label-general">Total:</span>
                  <span className="total-amount-general">${calculateTotal().toLocaleString()}</span>
                </div>

                <div className="addcart-section-centered">
                  <button 
                    className="addcart-btn-centered" 
                    onClick={handleAddToCartAndClose}
                  >
                    <FaShoppingCart size={14} /> 
                    <span>Añadir al Carrito ({calculateTotalUnits()})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {selectedImage && <FullscreenImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />}
      </>
    );
  };

  const ofertas = initialProducts
    .filter(p => p.hasDiscount && p.originalPrice > p.precio && p.isActive)
    .slice(0, 4);

  return (
    <div style={{ background: "#030712", minHeight: "100vh" }}>
      {/* BARRA DE BÚSQUEDA FILTRADA */}
      {searchQuery && (
        <div style={{
          textAlign: "center",
          padding: "12px",
          backgroundColor: "rgba(255, 193, 7, 0.1)",
          color: "#FFC107",
          fontSize: "1.1rem",
          fontWeight: "bold",
        }}>
          Buscando: "{searchQuery}"
        </div>
      )}

      {/* HERO SECTION */}
      {!searchQuery && (
        <section style={{
          background: `
            linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.85)),
            url("https://res.cloudinary.com/dxc5qqsjd/image/upload/v1764642176/WhatsApp_Image_2025-12-01_at_9.07.34_PM_a3k3ob.jpg")
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 20px",
        }}>
          <div style={{
            padding: "25px 50px",
            borderRadius: "12px",
            textAlign: "center",
            maxWidth: "900px",
            width: "100%",
          }}>
            <h1 style={{
              color: "#FFF",
              fontSize: "2.4rem",
              fontWeight: "900",
              marginBottom: "10px",
            }}>
              Bienvenido a <span style={{ color: "#FFC107" }}>GM CAPS</span>
            </h1>
            <p style={{
              color: "#E2E8F0",
              margin: "5px 0 20px",
              fontSize: "1rem",
            }}>
              Las mejores Gorras de Medellín. Ediciones limitadas y más.
            </p>
            <Link
              to="/categorias"
              style={{
                padding: "12px 26px",
                borderRadius: "8px",
                border: "2px solid #FFC107",
                color: "#FFC107",
                background: "transparent",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: "600",
                transition: "all 0.3s ease",
              }}
            >
              Ver Categorías <FaArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

      {/* SECCIONES DINÁMICAS */}
      <section style={{ padding: "30px 20px" }}>
        <div className="section-header">
          <div className="section-title">
            <FaFire size={22} color="#FF4757" />
            <h2>Ofertas</h2>
          </div>
          <Link to="/ofertas" className="btn-ver-todo">VER TODAS</Link>
        </div>
        <div className="image-only-grid">
          {ofertas.map(product => <ImageOnlyCard key={product.id} product={product} />)}
        </div>
      </section>

      <section style={{ padding: "30px 20px" }}>
        <div className="section-header">
          <div className="section-title">
            <FaStar size={22} color="#FFD700" />
            <h2>Destacados</h2>
          </div>
          <Link to="/destacados" className="btn-ver-todo">VER TODAS</Link>
        </div>
        <div className="image-only-grid">
          {destacados.map(product => <ImageOnlyCard key={product.id} product={product} />)}
        </div>
      </section>

      <section style={{ padding: "30px 20px 20px 20px" }}>
        <div className="section-header">
          <div className="section-title">
            <FaShoppingCart size={22} color="#FFC107" />
            <h2>Más Comprados</h2>
          </div>
          <Link to="/mas-comprados" className="btn-ver-todo">VER TODAS</Link>
        </div>
        <div className="image-only-grid">
          {masComprados.map(product => <ImageOnlyCard key={product.id} product={product} />)}
        </div>
      </section>

      <section style={{ padding: "15px 20px 20px", textAlign: "center" }}>
        <Link to="/productos" className="btn-ver-todos-simple">
          <span>VER TODOS LOS PRODUCTOS</span>
          <FaArrowRight size={16} />
        </Link>
      </section>

      <Footer />

      {/* === ESTILOS INTEGRADOS === */}
      <style>{`
        /* === BASE === */
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto 25px;
          padding: 0 5px;
        }
        .section-title h2 {
          color: white;
          font-size: 1.6rem;
          margin: 0;
          font-weight: 900;
        }
        .btn-ver-todo {
          padding: 8px 22px;
          border: 1px solid #FFC107;
          color: #FFC107;
          background: transparent;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.95rem;
        }
        .btn-ver-todos-simple {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 35px;
          border: 2px solid #FFC107;
          background: #000;
          color: #FFC107;
          text-decoration: none;
          font-weight: 700;
          border-radius: 8px;
        }

        /* === GRILLA TARJETAS === */
        .image-only-grid {
          display: grid;
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
          grid-template-columns: repeat(4, 1fr);
        }
        .image-only-card {
          position: relative;
          cursor: pointer;
          border-radius: 12px;
          overflow: hidden;
          aspect-ratio: 1/1;
          background: #111;
        }

        /* BADGES Y OVERLAY */ 
        .top-left-badge, .top-right-badge, .top-center-badge {
          position: absolute;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .top-left-badge { top: 10px; left: 10px; }
        .top-right-badge { top: 10px; right: 10px; }
        .top-center-badge { top: 10px; left: 50%; transform: translateX(-50%); }
        .discount-badge-left { background: linear-gradient(135deg, #FF4757, #FF6B81); color: white; }
        .best-seller-badge-right { background: linear-gradient(135deg, #4DA6FF, #80C4FF); color: white; }
        .featured-badge-right { background: linear-gradient(135deg, #FFD700, #FF9800); color: #000; }
        .low-stock-badge { background: linear-gradient(135deg, #FF9800, #FFB74D); color: #000; font-weight: 800; }
        .out-of-stock-badge { background: linear-gradient(135deg, #666, #999); color: white; }

        /* NOMBRE DEL PRODUCTO SIN FONDO */
        .product-name-bottom {
          position: absolute;
          bottom: 10px;
          left: 0; right: 0;
          text-align: center;
          /* --- FONDO ELIMINADO --- */
          /* background: rgba(0,0,0,0.6); */
          color: rgba(255,255,255,0.9);
          padding: 6px 8px;
          font-size: 0.85rem;
          font-weight: 600;
          /* --- BORDE REDONDEADO ELIMINADO --- */
          /* border-radius: 0 0 12px 12px; */
          /* --- BACKDROP FILTER ELIMINADO --- */
          /* backdrop-filter: blur(2px); */
        }

        .image-overlay {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          opacity: 0;
          transition: opacity 0.3s;
          padding: 12px;
          border-radius: 12px;
        }
        .image-only-card:hover .image-overlay { opacity: 1; }

        .cart-icon-bottom-left {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FFC107, #FF9800);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .view-details-text {
          color: #FFC107;
          font-weight: 600;
          font-size: 0.75rem;
          padding: 5px 10px;
          border: 1.5px solid #FFC107;
          border-radius: 15px;
          background: rgba(0,0,0,0.7);
          text-transform: uppercase;
        }

        /* === MODAL HORIZONTAL === */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0, 0, 0, 0.92);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }
        .modal-content.modal-centered {
          background: #000;
          border: 1px solid #FFC107;
          border-radius: 10px;
          width: 800px;
          max-width: 90vw;
          height: 85vh;
          max-height: 85vh;
          padding: 0;
          display: flex;
        }
        .modal-horizontal-container {
          display: flex;
          width: 100%;
          height: 100%;
        }
        .modal-image-side {
          flex: 0 0 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #111;
          overflow: hidden;
          border-right: 1px solid rgba(255, 193, 7, 0.15);
        }
        .modal-info-side {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          background: #000;
        }
        .modal-img-main-centered {
          width: 100%;
          height: 100%;
          object-fit: contain;
          cursor: pointer;
        }

        /* Resto de estilos del modal (copiados y ajustados) */
        .tags-top-centered {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 12px;
        }
        .tag-item-centered {
          color: #FFC107;
          border: 1px solid #FFC107;
          padding: 2px 5px;
          border-radius: 3px;
          font-size: 0.65rem;
          font-weight: 600;
        }
        .modal-name-price-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          gap: 10px;
        }
        .modal-product-type {
          color: white;
          font-size: 1.1rem;
          font-weight: 800;
          flex: 1;
        }
        .product-price-inline {
          color: #FFC107;
          font-weight: 900;
          font-size: 1.2rem;
        }

        .size-buttons-section {
          margin-bottom: 15px;
        }
        .size-buttons-label {
          color: #94A3B8;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .size-error-alert {
          display: flex;
          gap: 6px;
          background: rgba(255, 87, 87, 0.1);
          color: #FF5757;
          padding: 6px 10px;
          border-radius: 4px;
          font-size: 0.75rem;
          margin-bottom: 10px;
        }
        .size-buttons-compact-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        .size-btn-compact {
          background: transparent;
          color: #FFC107;
          border: 1px solid #FFC107;
          padding: 8px 4px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          text-align: center;
          height: 32px;
        }
        .size-btn-compact-selected {
          background: rgba(255, 215, 0, 0.15);
          font-weight: 700;
        }
        .size-quantity-container {
          display: flex;
          flex-direction: column;
          gap: 5px;
          align-items: center;
        }
        .size-quantity-controls {
          display: flex;
          gap: 5px;
          margin-top: 3px;
        }
        .qty-btn-sm {
          width: 22px;
          height: 22px;
          /* --- FONDO GRIS ELIMINADO --- */
          /* background: rgba(255, 193, 7, 0.1); */
          border: 1px solid #FFC107;
          color: #FFC107;
          border-radius: 3px;
          font-size: 0.7rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .qty-sm-display {
          color: white;
          font-size: 0.8rem;
          min-width: 20px;
          text-align: center;
        }
        /* NUEVO: Color rojo para el número si quedan 2 o 3 unidades */
        .low-stock-number {
          color: #FF4757;
          font-weight: 800;
        }

        .sizes-summary {
          background: rgba(30, 41, 59, 0.3);
          border-radius: 8px;
          padding: 10px;
          margin: 15px 0;
          border: 1px solid rgba(255, 193, 7, 0.1);
        }
        .sizes-summary-label {
          color: #94A3B8;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .size-summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 10px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        .size-label { color: white; font-size: 0.85rem; }
        .size-quantity { color: #FFC107; font-weight: 700; }
        .size-subtotal {
          color: #FFC107;
          font-weight: 800;
          background: rgba(255, 193, 7, 0.1);
          padding: 2px 8px;
          border-radius: 3px;
        }

        .total-section-general {
          display: flex;
          justify-content: space-between;
          background: rgba(0,0,0,0.5);
          padding: 12px 15px;
          border-radius: 8px;
          margin-bottom: 15px;
          border: 1px solid rgba(255,193,7,0.2);
        }
        .total-label-general { color: white; font-weight: 700; }
        .total-amount-general {
          color: #FFC107;
          font-weight: 900;
          font-size: 1.2rem;
          background: rgba(255,193,7,0.1);
          padding: 6px 15px;
          border-radius: 4px;
        }
        .addcart-btn-centered {
          background: transparent;
          color: #FFC107;
          border: none;
          padding: 12px 0;
          font-weight: 800;
          font-size: 1rem;
          cursor: pointer;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-transform: uppercase;
        }

        /* FULLSCREEN MODAL */
        .fullscreen-modal-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.98);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1001;
        }
        .fullscreen-modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0,0,0,0.7);
          border: none;
          color: white;
          cursor: pointer;
          padding: 10px;
          border-radius: 50%;
        }
        .fullscreen-image {
          max-width: 100%;
          max-height: 90vh;
          object-fit: contain;
          border-radius: 8px;
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .image-only-grid { grid-template-columns: repeat(3, 1fr); }
          .modal-content.modal-centered { width: 95vw; height: auto; max-height: 90vh; }
          .modal-horizontal-container { flex-direction: column; }
          .modal-image-side {
            height: 200px;
            flex: 0 0 auto;
            border-right: none;
            border-bottom: 1px solid rgba(255,193,7,0.15);
          }
          .modal-info-side { padding: 15px; }
        }
        @media (max-width: 576px) {
          .image-only-grid { grid-template-columns: 1fr; }
          .size-buttons-compact-grid { grid-template-columns: repeat(3, 1fr); }
          .modal-image-side { height: 180px; }
        }
      `}</style>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
      {selectedImage && (
        <div className="fullscreen-modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="fullscreen-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="fullscreen-modal-close" onClick={() => setSelectedImage(null)}>
              <FaTimes size={20} />
            </button>
            <img src={selectedImage} alt="Imagen ampliada" className="fullscreen-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;