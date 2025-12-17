// src/pages/SearchResults.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { initialProducts } from '../data';
import {
  FaSearch,
  FaTimes,
  FaShoppingCart,
  FaStar,
  FaFire,
  FaPalette,
  FaRuler
} from 'react-icons/fa';

const SearchResults = ({ addToCart }) => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q') || '';
    setSearchTerm(query);
    
    if (query) {
      // Simular carga
      setTimeout(() => {
        const filtered = initialProducts.filter(product =>
          product.nombre.toLowerCase().includes(query.toLowerCase()) ||
          product.categoria.toLowerCase().includes(query.toLowerCase()) ||
          product.descripcion?.toLowerCase().includes(query.toLowerCase()) ||
          product.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        setResults(filtered);
        setLoading(false);
      }, 500);
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [location.search]);

  const handleAddToCart = (product) => {
    if (addToCart) {
      addToCart({
        id: product.id,
        name: product.nombre,
        price: product.precio,
        originalPrice: product.originalPrice,
        image: product.imagenes?.[0] || '',
        quantity: 1,
        color: product.colores?.[0] || 'Negro',
        size: product.tallas?.[0] || 'Única',
        stock: product.stock,
        category: product.categoria
      });
      
      // Notificación
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #FFC107, #FFD54F);
        color: #000;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
      `;
      notification.innerHTML = `<strong>✓ Producto agregado</strong>`;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '60px 20px', 
        textAlign: 'center', 
        color: '#fff',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ fontSize: '40px', marginBottom: '20px' }}>🔍</div>
        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Buscando productos...</h2>
        <p>Por favor espera un momento</p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '40px 20px', 
      maxWidth: '1400px', 
      margin: '0 auto',
      minHeight: '70vh'
    }}>
      <div style={{ 
        backgroundColor: 'rgba(30, 41, 59, 0.7)',
        padding: '25px',
        borderRadius: '12px',
        marginBottom: '40px',
        border: '1px solid rgba(255, 193, 7, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #FFC107, #FFD54F)',
            color: '#000',
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
          }}>
            <FaSearch />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ 
              fontSize: '28px', 
              color: '#FFFFFF', 
              margin: 0,
              fontWeight: '700'
            }}>
              Resultados de búsqueda
            </h1>
            <p style={{ 
              fontSize: '16px', 
              color: '#CCCCCC', 
              margin: '8px 0 0 0'
            }}>
              {searchTerm ? `Buscando: "${searchTerm}"` : 'Ingresa un término de búsqueda'}
            </p>
          </div>
        </div>

        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '20px'
        }}>
          <div>
            <span style={{ 
              color: '#FFC107', 
              fontSize: '18px', 
              fontWeight: '600'
            }}>
              {results.length} {results.length === 1 ? 'producto encontrado' : 'productos encontrados'}
            </span>
          </div>
          <Link 
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'transparent',
              color: '#FFC107',
              padding: '10px 20px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
              border: '2px solid #FFC107',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FFC107';
              e.currentTarget.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#FFC107';
            }}
          >
            <FaTimes size={12} />
            Volver al inicio
          </Link>
        </div>
      </div>

      {results.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '30px',
          padding: '20px 0'
        }}>
          {results.map((product) => (
            <div
              key={product.id}
              style={{
                backgroundColor: '#1A1A1A',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #333',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <img
                  src={product.imagenes?.[0] || 'https://via.placeholder.com/300x200?text=GM'}
                  alt={product.nombre}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                {product.hasDiscount && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: '#FF4757',
                    color: '#FFF',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}>
                    <FaFire size={12} />
                    -{Math.round(((product.originalPrice - product.precio) / product.originalPrice) * 100)}%
                  </div>
                )}
                {product.isFeatured && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: '#FFC107',
                    color: '#000',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}>
                    <FaStar size={12} />
                    Destacado
                  </div>
                )}
              </div>

              <div style={{ padding: '20px' }}>
                <h3 style={{
                  fontSize: '16px',
                  color: '#FFFFFF',
                  margin: '0 0 10px 0',
                  fontWeight: '700',
                  height: '40px',
                  overflow: 'hidden',
                }}>
                  {product.nombre}
                </h3>

                <p style={{
                  color: '#CCCCCC',
                  fontSize: '13px',
                  margin: '0 0 15px 0',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                }}>
                  {product.categoria}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  {product.colores && product.colores.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '15px' }}>
                      <FaPalette size={14} style={{ color: '#FFC107' }} />
                      <span style={{ color: '#aaa', fontSize: '12px' }}>{product.colores.length} colores</span>
                    </div>
                  )}
                  {product.tallas && product.tallas.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaRuler size={14} style={{ color: '#FFC107' }} />
                      <span style={{ color: '#aaa', fontSize: '12px' }}>{product.tallas.length} tallas</span>
                    </div>
                  )}
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px',
                }}>
                  <div>
                    <span style={{
                      color: '#FFC107',
                      fontSize: '20px',
                      fontWeight: 'bold',
                    }}>
                      ${product.precio.toLocaleString()}
                    </span>
                    {product.hasDiscount && (
                      <span style={{
                        color: '#999',
                        fontSize: '14px',
                        textDecoration: 'line-through',
                        marginLeft: '10px',
                      }}>
                        ${product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span style={{
                    color: product.stock > 0 ? '#10B981' : '#FF4757',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}>
                    {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
                  </span>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock <= 0}
                  style={{
                    width: '100%',
                    backgroundColor: product.stock > 0 ? '#FFC107' : '#666',
                    color: product.stock > 0 ? '#000' : '#999',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={(e) => {
                    if (product.stock > 0) {
                      e.currentTarget.style.backgroundColor = '#ffd54f';
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (product.stock > 0) {
                      e.currentTarget.style.backgroundColor = '#FFC107';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  <FaShoppingCart size={14} />
                  {product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          backgroundColor: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '12px',
          border: '1px dashed rgba(255, 193, 7, 0.3)'
        }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>🔍</div>
          <h2 style={{ fontSize: '24px', color: '#FFFFFF', marginBottom: '10px' }}>
            No se encontraron resultados
          </h2>
          <p style={{ color: '#CCCCCC', marginBottom: '25px', fontSize: '16px' }}>
            {searchTerm 
              ? `No encontramos productos relacionados con "${searchTerm}"`
              : 'Ingresa un término en la barra de búsqueda para encontrar productos'
            }
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/"
              style={{
                padding: '12px 24px',
                backgroundColor: '#FFC107',
                color: '#000',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ffd54f';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFC107';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Volver al Inicio
            </Link>
            <Link 
              to="/categorias"
              style={{
                padding: '12px 24px',
                backgroundColor: 'transparent',
                color: '#FFC107',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                border: '2px solid #FFC107',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FFC107';
                e.currentTarget.style.color = '#000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#FFC107';
              }}
            >
              Ver Categorías
            </Link>
            <Link 
              to="/ofertas"
              style={{
                padding: '12px 24px',
                backgroundColor: 'transparent',
                color: '#FFC107',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                border: '2px solid #FFC107',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FFC107';
                e.currentTarget.style.color = '#000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#FFC107';
              }}
            >
              Ver Ofertas
            </Link>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes slideOut {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(100%);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default SearchResults;