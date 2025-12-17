// src/pages/Ofertas.jsx
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { 
  FaArrowRight, 
  FaFire, 
  FaShoppingCart, 
  FaTimes,
  FaTag,
  FaExclamationCircle
} from "react-icons/fa";
import { initialProducts, initialSizes } from "../data";

const Ofertas = ({ addToCart }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const ofertas = useMemo(() => {
    return initialProducts.filter(p => 
      p.hasDiscount && 
      p.originalPrice > p.precio && 
      p.isActive
    );
  }, []);

  const ImageOnlyCard = ({ product, onClick }) => {
    const isBestSeller = product.sales > 50;

    return (
      <div 
        className="image-only-card" 
        onClick={() => onClick(product)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && onClick(product)}
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
          
          <div className="discount-badge">
            -{Math.round(((product.originalPrice - product.precio) / product.originalPrice) * 100)}%
          </div>

          {isBestSeller && (
            <div className="best-seller-badge">
              <FaShoppingCart size={12} /> Más Vendido
            </div>
          )}
        </div>

        <div className="image-overlay">
          <div className="overlay-content">
            <span className="view-details-text">Ver detalles</span>
          </div>
        </div>
      </div>
    );
  };

  // ======================================================
  // MODAL ACTUALIZADO: AJUSTES FINALES (IMAGEN LLENA, SIN PREMIUM)
  // ======================================================
  const ProductModal = ({ product, onClose, addToCart }) => {
    if (!product) return null;

    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const availableSizeOptions = initialSizes.filter(sizeOpt =>
      !product.tallas || product.tallas.includes(sizeOpt.value)
    );
    const [selectedImage, setSelectedImage] = useState(null);
    const [showSizeError, setShowSizeError] = useState(false);

    const handleAddToCartAndClose = () => {
      if (!selectedSize && availableSizeOptions.length > 0) {
        setShowSizeError(true);
        return;
      }
      const finalSize = selectedSize || (availableSizeOptions.length > 0 ? availableSizeOptions[0].value : "Única");
      const productToAdd = { 
        ...product, 
        tallaSeleccionada: finalSize,
        cantidad: quantity,
        idUnico: `${product.id}-${finalSize}-${Date.now()}`
      };
      addToCart(productToAdd);
      onClose();
    };

    const handleSizeSelect = (size) => {
      setSelectedSize(size);
      setShowSizeError(false);
    };

    const handleIncreaseQuantity = () => setQuantity(q => q + 1);
    const handleDecreaseQuantity = () => setQuantity(q => q > 1 ? q - 1 : 1);

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

    // Calculamos el subtotal
    const subtotal = product.precio * quantity;

    return (
      <>
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content modal-centered" onClick={(e) => e.stopPropagation()}>
            {/* --- QUITAMOS EL BOTÓN DE CERRAR (X) --- */}
            {/* <button className="modal-close-centered" onClick={onClose}> */}
            {/*   <FaTimes size={20} /> */}
            {/* </button> */}

            <div className="modal-centered-container">
              <div className="modal-image-section">
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
                  {/* El precio ya está sobre la imagen, no se toca */}
                </div>
              </div>

              <div className="modal-info-centered">
                <div className="tags-top-centered">
                  {product.tags?.map((tag, index) => (
                    <span key={index} className="tag-item-centered">
                      <FaTag size={8} /> #{tag.toUpperCase()}
                    </span>
                  ))}
                </div>

                {/* === NOMBRE Y PRECIO DEL PRODUCTO EN LA MISMA LÍNEA === */}
                <div className="modal-name-price-row">
                  <span className="modal-product-type">{product.nombre}</span>
                  <span className="product-price-inline">${product.precio.toLocaleString()}</span>
                </div>

                {/* === SUBTOTAL Y CANTIDAD EN LA MISMA LÍNEA === */}
                <div className="subtotal-quantity-row">
                  <span className="subtotal-text">Subtotal: ${subtotal.toLocaleString()}</span>
                  <div className="quantity-controls-in-line">
                    <span className="quantity-label">Cantidad:</span>
                    <button 
                      className="quantity-btn-in-line minus"
                      onClick={handleDecreaseQuantity}
                    >
                      -
                    </button>
                    <span className="quantity-display-in-line">{quantity}</span>
                    <button 
                      className="quantity-btn-in-line plus"
                      onClick={handleIncreaseQuantity}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="size-buttons-section">
                  <div className="size-buttons-label">Talla:</div>
                  {showSizeError && availableSizeOptions.length > 0 && (
                    <div className="size-error-alert">
                      <FaExclamationCircle size={12} />
                      <span>Debe seleccionar una talla</span>
                    </div>
                  )}
                  <div className="size-buttons-container">
                    {availableSizeOptions.length > 0 ? (
                      availableSizeOptions.map((sizeOption) => (
                        <button
                          key={sizeOption.value}
                          className={`size-button ${selectedSize === sizeOption.value ? 'size-button-selected' : ''}`}
                          onClick={() => handleSizeSelect(sizeOption.value)}
                        >
                          {sizeOption.label}
                        </button>
                      ))
                    ) : (
                      <button className="size-button size-button-selected" disabled>
                        Única
                      </button>
                    )}
                  </div>
                </div>

                <div className="addcart-section-centered">
                  <button 
                    className="addcart-btn-centered" 
                    onClick={handleAddToCartAndClose}
                  >
                    <FaShoppingCart size={14} /> 
                    <span>Añadir al Carrito</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedImage && (
          <FullscreenImageModal 
            imageUrl={selectedImage} 
            onClose={() => setSelectedImage(null)} 
          />
        )}
      </>
    );
  };

  return (
    <div style={{ background: "#030712", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <section
        style={{
          background: "#031326",
          padding: "100px 20px 70px",
          textAlign: "center",
          borderBottomLeftRadius: "30px",
          borderBottomRightRadius: "30px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-40px",
            left: 0,
            width: "100%",
            height: "80px",
            background: "#FFFF",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px",
            marginBottom: "20px",
          }}
        >
          <FaFire size={28} color="#FF4757" />
          <h1 style={{ color: "white", fontSize: "3rem", fontWeight: "700", margin: 0 }}>
            Ofertas Especiales
          </h1>
        </div>

        <p
          style={{
            color: "#cbd5e1",
            fontSize: "1.2rem",
            maxWidth: "900px",
            margin: "0 auto",
            lineHeight: "1.6",
            marginBottom: "10px",
          }}
        >
          Ahorra en tus productos favoritos con descuentos reales. Encuentra las mejores ofertas en gorras y accesorios.
        </p>

        <p style={{ color: "#FFC107", fontSize: "1.4rem", fontWeight: "700" }}>
          {ofertas.length} productos en oferta
        </p>

        <div
          style={{
            position: "absolute",
            bottom: "-40px",
            left: 0,
            width: "100%",
            height: "80px",
            background: "#030712",
            borderTopLeftRadius: "50% 80%",
            borderTopRightRadius: "50% 80%",
          }}
        />
      </section>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px", flex: 1 }}>
        <div className="image-only-grid">
          {ofertas.map((product) => (
            <ImageOnlyCard
              key={product.id}
              product={product}
              onClick={setSelectedProduct}
            />
          ))}
        </div>

        {ofertas.length === 0 && (
          <div style={{ textAlign: "center", color: "#94A3B8", padding: "50px 20px" }}>
            <p style={{ fontSize: "1.2rem" }}>No hay ofertas disponibles en este momento.</p>
            <Link 
              to="/productos" 
              style={{
                display: "inline-block",
                marginTop: "20px",
                padding: "10px 20px",
                background: "#FFC107",
                color: "#000",
                textDecoration: "none",
                borderRadius: "6px",
                fontWeight: "bold"
              }}
            >
              Ver todos los productos
            </Link>
          </div>
        )}
      </div>

      <section style={{ 
        padding: "15px 20px 20px",
        textAlign: "center"
      }}>
        <Link
          to="/productos"
          className="btn-ver-todos-simple"
        >
          <span>VER TODOS LOS PRODUCTOS</span>
          <FaArrowRight size={16} />
        </Link>
      </section>

      <Footer />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          addToCart={addToCart}
        />
      )}

      <style>{`
        .image-only-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(4, 1fr);
          max-width: 1200px;
          margin: 0 auto;
        }

        .image-only-card {
          position: relative;
          cursor: pointer;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          aspect-ratio: 1/1;
          background: #111;
        }
        .image-only-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(255, 193, 7, 0.2);
        }
        .image-container {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
          z-index: 0;
        }
        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .image-only-card:hover .product-image {
          transform: scale(1.05);
        }

        .discount-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #FFC107;
          color: #4DA6FF;
          padding: 5px 10px;
          border-radius: 50px;
          font-weight: 900;
          font-size: 0.9rem;
          z-index: 3;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          border: 1px solid #FFD700;
          min-width: 36px;
          text-align: center;
        }

        .best-seller-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: linear-gradient(135deg, #4DA6FF 0%, #80C4FF 100%);
          color: white;
          padding: 5px 10px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.8rem;
          z-index: 3;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 2;
          border-radius: 12px;
        }
        .image-only-card:hover .image-overlay {
          opacity: 1;
        }
        .overlay-content {
          text-align: center;
          transform: translateY(10px);
          transition: transform 0.3s ease;
        }
        .image-only-card:hover .overlay-content {
          transform: translateY(0);
        }
        .view-details-text {
          color: #FFC107;
          font-weight: 700;
          font-size: 1rem;
          padding: 8px 16px;
          border: 2px solid #FFC107;
          border-radius: 6px;
          background: rgba(0, 0, 0, 0.8);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* === MODAL CENTRADO (AJUSTES FINALES) === */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.92);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content.modal-centered {
          background: #000000; /* FONDO NEGRO PURO */
          border: 1px solid #FFC107;
          border-radius: 10px;
          width: 400px;
          padding: 0;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.7);
          display: flex;
          flex-direction: column;
          position: relative;
        }

        /* --- ELIMINAMOS EL BOTÓN DE CERRAR (X) --- */

        .modal-centered-container {
          display: flex;
          flex-direction: column;
        }

        /* === IMAGEN LLENA (OCUPA TODO EL ESPACIO) === */
        .modal-image-section {
          position: relative;
          width: 100%;
          height: 220px;
          overflow: hidden;
        }

        .modal-image-centered {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-img-main-centered {
          width: 100%;
          height: 100%;
          object-fit: cover;
          /* Eliminamos cualquier borde o padding */
          border: none;
          margin: 0;
          padding: 0;
        }

        .image-price-overlay {
          position: absolute;
          top: 10px;
          left: 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 6px 12px;
          border-radius: 6px;
          background: rgba(0, 0, 0, 0.85);
          min-width: 80px;
          white-space: nowrap;
        }

        .current-price-small {
          color: #FFC107;
          font-weight: 900;
          font-size: 0.8rem;
          white-space: nowrap;
        }

        .old-price-small {
          color: #aaa;
          text-decoration: line-through;
          font-size: 0.7rem;
          white-space: nowrap;
        }

        /* === INFORMACIÓN DEL PRODUCTO === */
        .modal-info-centered {
          display: flex;
          flex-direction: column;
          padding: 15px;
        }

        .tags-top-centered {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 8px;
        }

        .tag-item-centered {
          background: transparent;
          color: #FFC107;
          padding: 2px 5px;
          border: 1px solid #FFC107;
          border-radius: 3px;
          font-size: 0.65rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 3px;
          text-transform: uppercase;
        }

        /* === NOMBRE Y PRECIO EN LA MISMA LÍNEA === */
        .modal-name-price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          gap: 10px;
        }

        .modal-product-type {
          color: white;
          font-size: 1rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          flex: 1;
          min-width: 120px;
          word-break: break-word;
          line-height: 1.2;
        }

        .product-price-inline {
          color: #FFC107;
          font-weight: 900;
          font-size: 1.1rem;
          white-space: nowrap;
        }

        /* === SUBTOTAL Y CANTIDAD EN LA MISMA LÍNEA === */
        .subtotal-quantity-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          gap: 10px;
        }

        .subtotal-text {
          color: #FFC107;
          font-weight: 900;
          font-size: 0.9rem;
          white-space: nowrap;
        }

        .quantity-controls-in-line {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 0, 0, 0.8);
          padding: 4px 8px;
          border-radius: 4px;
        }

        .quantity-label {
          color: white;
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .quantity-btn-in-line {
          width: 22px;
          height: 22px;
          background: #111;
          border: 1px solid #334155;
          color: white;
          border-radius: 3px;
          font-size: 0.8rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .quantity-btn-in-line:hover {
          border-color: #FFC107;
          background: rgba(255, 193, 7, 0.1);
        }

        .quantity-display-in-line {
          color: white;
          font-size: 0.9rem;
          font-weight: 700;
          min-width: 20px;
          text-align: center;
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
          align-items: center;
          gap: 6px;
          background: rgba(255, 87, 87, 0.1);
          color: #FF5757;
          padding: 6px 10px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 10px;
          border: 1px solid rgba(255, 87, 87, 0.3);
        }

        .size-buttons-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }

        .size-button {
          background: transparent;
          color: #FFC107;
          border: 1px solid #FFC107;
          padding: 8px 4px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 0;
          text-align: center;
          box-shadow: none;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .size-button:hover {
          background: rgba(255, 193, 7, 0.05);
        }

        .size-button-selected {
          background: #FFD700; /* AMARILLO MÁS OSCURO */
          color: #000;
          border-color: #FFC107;
          font-weight: 700;
          box-shadow: none; /* SIN SOMBRA */
        }

        .addcart-section-centered {
          margin-top: auto;
          padding-top: 10px;
        }

        .addcart-btn-centered {
          /* SIN FONDO, SIN BORDE, SOLO TEXTO AMARILLO */
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
          letter-spacing: 0.4px;
          transition: all 0.2s ease;
        }

        .addcart-btn-centered:hover {
          text-shadow: 0 0 8px rgba(255, 193, 7, 0.5);
        }

        .fullscreen-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.98);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1001;
          padding: 20px;
        }
        .fullscreen-modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.7);
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 10px;
          border-radius: 50%;
        }
        .fullscreen-modal-close:hover {
          background: rgba(255, 193, 7, 0.8);
          color: #000;
        }
        .fullscreen-image {
          max-width: 100%;
          max-height: 90vh;
          object-fit: contain;
          border-radius: 8px;
        }

        .btn-ver-todos-simple {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 35px;
          border-radius: 8px;
          background: #000000;
          color: #FFC107;
          text-decoration: none;
          font-size: 1.1rem;
          font-weight: 700;
          border: 2px solid #FFC107;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-ver-todos-simple:hover {
          background: rgba(255, 193, 7, 0.1);
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(255, 193, 7, 0.25);
        }

        /* RESPONSIVE */
        @media (max-width: 1200px) {
          .image-only-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 900px) {
          .image-only-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .image-only-grid { grid-template-columns: repeat(2, 1fr); }
          .modal-content.modal-centered { 
            width: 90%; 
            max-width: 400px; 
          }
          .modal-image-section { height: 200px; }
          .size-buttons-container {
            grid-template-columns: repeat(3, 1fr);
            gap: 5px;
          }
          .size-button {
            padding: 6px 3px;
            font-size: 0.75rem;
            height: 30px;
          }
          .modal-info-centered { padding: 12px; }
          .quantity-controls-in-line {
            padding: 4px 6px;
            gap: 6px;
          }
          .quantity-btn-in-line {
            width: 20px;
            height: 20px;
            font-size: 0.7rem;
          }
          .quantity-display-in-line {
            font-size: 0.8rem;
          }
          .subtotal-text, .product-price-inline {
            font-size: 0.8rem;
          }
          .modal-product-type {
            font-size: 0.9rem;
          }
        }
        @media (max-width: 576px) {
          .image-only-grid { grid-template-columns: 1fr; }
          .modal-content.modal-centered { 
            width: 95%; 
          }
          .modal-image-section { height: 180px; }
          .modal-info-centered { padding: 10px; }
          .size-buttons-container { 
            grid-template-columns: repeat(3, 1fr);
            gap: 4px; 
          }
          .size-button { 
            padding: 5px 2px; 
            font-size: 0.7rem; 
            height: 28px;
          }
          .quantity-btn-in-line { width: 20px; height: 20px; font-size: 0.7rem; }
          .quantity-display-in-line { font-size: 0.8rem; }
          .addcart-btn-centered { 
            padding: 10px 0; 
            font-size: 0.9rem; 
          }
          .discount-badge { font-size: 0.8rem; padding: 4px 8px; min-width: 32px; }
          .best-seller-badge { font-size: 0.75rem; padding: 4px 8px; }
          .btn-ver-todos-simple { width: 100%; padding: 14px 20px; font-size: 0.95rem; justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default Ofertas;