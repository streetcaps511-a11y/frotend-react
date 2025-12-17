// src/pages/admin/ComprasPage.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import AdminLayoutClean from './AdminLayoutClean';
import { initialOrders, paymentMethods, initialProducts, initialSuppliers, initialSizes, initialColors } from '../../data'; 
import UniversalModal from '../../components/UniversalModal';
import EntityTable from '../../components/EntityTable';
import Alert from '../../components/Alert';
import AnularOperacionModal from '../../components/AnularOperacionModal';
import SearchInput from '../../components/SearchInput';
import DateInputWithCalendar from '../../components/DateInputWithCalendar'; 

// =============================================
// FUNCIÓN UTILIDAD: FORMATO DE PRECIO
// =============================================
const formatPrice = (value) => {
  if (!value) return '';
  const numericValue = value.toString().replace(/[^\d]/g, '');
  if (numericValue === '') return '';
  const number = parseInt(numericValue, 10);
  return isNaN(number) ? '' : number.toLocaleString('es-CO');
};

// =============================================
// COMPONENTE StatusPill
// =============================================
const StatusPill = React.memo(({ status }) => {
  const getColorForStatus = (status) => {
    switch(status?.toLowerCase()) {
      case 'activo':
      case 'completada':
        return '#10B981';
      case 'anulada':
      case 'cancelada':
        return '#EF4444';
      case 'pendiente':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };
  const color = getColorForStatus(status);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: "12px",
        backgroundColor: `${color}20`,
        color: color,
        fontWeight: 600,
        fontSize: "0.7rem",
        textTransform: "capitalize",
        border: `1px solid ${color}40`,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: color,
          marginRight: 4,
        }}
      />
      {status}
    </span>
  );
});

// =============================================
// COMPONENTE StatusFilter
// =============================================
const StatusFilter = ({ filterStatus, onFilterSelect }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setOpen(!open)} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          padding: '8px 12px', 
          backgroundColor: 'transparent', 
          border: '1px solid #F5C81B', 
          color: '#F5C81B', 
          borderRadius: '6px', 
          fontSize: '13px', 
          cursor: 'pointer', 
          whiteSpace: 'nowrap', 
          minWidth: '110px', 
          justifyContent: 'space-between', 
          fontWeight: '600', 
          height: '36px' 
        }} 
        onMouseEnter={e => { 
          e.target.style.backgroundColor = '#F5C81B'; 
          e.target.style.color = '#000'; 
        }} 
        onMouseLeave={e => { 
          e.target.style.backgroundColor = 'transparent'; 
          e.target.style.color = '#F5C81B'; 
        }}
      >
        <span>{filterStatus}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          <polyline points="6,9 12,15 18,9"/>
        </svg>
      </button>
      {open && (
        <div style={{ 
          position: 'absolute', 
          top: '100%', 
          right: 0, 
          marginTop: '4px', 
          backgroundColor: '#1F2937', 
          border: '1px solid #F5C81B', 
          borderRadius: '6px', 
          padding: '6px 0', 
          minWidth: '120px', 
          zIndex: 1000, 
          boxShadow: '0 4px 12px rgba(245, 200, 27, 0.3)' 
        }}>
          {['Todos', 'Completadas', 'Anuladas'].map(status => (
            <button 
              key={status} 
              onClick={() => { onFilterSelect(status); setOpen(false); }} 
              style={{ 
                width: '100%', 
                padding: '6px 12px', 
                backgroundColor: filterStatus === status ? '#F5C81B' : 'transparent', 
                border: 'none', 
                color: filterStatus === status ? '#000' : '#F5C81B', 
                fontSize: '13px', 
                textAlign: 'left', 
                cursor: 'pointer', 
                fontWeight: filterStatus === status ? '600' : '400' 
              }}
              onMouseEnter={e => filterStatus !== status && (
                e.target.style.backgroundColor = '#F5C81B',
                e.target.style.color = '#000'
              )}
              onMouseLeave={e => filterStatus !== status && (
                e.target.style.backgroundColor = 'transparent',
                e.target.style.color = '#F5C81B'
              )}
            >
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// =============================================
// COMPONENTE ProductoForm
// =============================================
const ProductoForm = React.memo(({ 
  producto, 
  onChange,
  onRemove, 
  index, 
  isViewMode = false, 
  error = false, 
  isFirst = false 
}) => {
  const subtotal = (producto.cantidad || 0) * (parseFloat(producto.precio) || 0);
  const baseStyle = {
    display: 'grid',
    gap: '6px',
    alignItems: 'center',
    marginBottom: '6px',
  };
  const productInputStyle = {
    backgroundColor: 'transparent',
    border: `1px solid ${error ? '#ef4444' : '#334155'}`,
    borderRadius: '4px',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '500',
    padding: '2px 4px',
    margin: '0',
    width: '100%',
    height: '26px',
    outline: 'none',
    boxShadow: 'none',
    cursor: 'text',
    lineHeight: '1.4',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  };
  const selectStyleNoArrow = {
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none',
    backgroundImage: 'none',
    paddingRight: '4px',
  };
  
  const gridTemplate = '2.5fr 1fr 1fr 0.8fr 1fr 1.2fr';
  if (isViewMode) {
    return (
      <div style={{ ...baseStyle, gridTemplateColumns: gridTemplate, padding: '4px 0' }}>
        <div style={{ color: '#fff', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {producto.nombre || '-'}
        </div>
        <div style={{ color: '#94a3b8', fontSize: '11px', textAlign: 'center' }}>{producto.color || '-'}</div>
        <div style={{ color: '#94a3b8', fontSize: '11px', textAlign: 'center' }}>{producto.talla || '-'}</div>
        <div style={{ color: '#fff', fontSize: '11px', textAlign: 'center' }}>{producto.cantidad || 0}</div>
        <div style={{ color: '#F5C81B', fontSize: '11px', textAlign: 'center', fontWeight: '600' }}>
          ${(parseFloat(producto.precio) || 0).toLocaleString('es-CO')}
        </div>
        <div style={{ color: '#F5C81B', fontSize: '11px', textAlign: 'center', fontWeight: '600' }}>
          ${subtotal.toLocaleString('es-CO')}
        </div>
      </div>
    );
  }
  const showRemoveButton = !isFirst;
  return (
    <div style={{ 
      ...baseStyle, 
      gridTemplateColumns: showRemoveButton ? `${gridTemplate} auto` : gridTemplate
    }}>
      <select
        value={producto.id || ''}
        onChange={(e) => {
          const selectedId = parseInt(e.target.value);
          const selectedProduct = initialProducts.find(p => p.id === selectedId);
          if (selectedProduct) {
            onChange(index, 'id', selectedId);
            onChange(index, 'nombre', selectedProduct.nombre);
          } else {
            onChange(index, 'id', '');
            onChange(index, 'nombre', '');
          }
        }}
        style={{
          ...productInputStyle,
          ...selectStyleNoArrow,
          borderColor: error ? '#ef4444' : (producto.id ? '#334155' : '#475569'),
          color: producto.id ? '#ffffff' : '#94a3b8',
        }}
      >
        <option value="" style={{backgroundColor: '#1e293b', color: '#94a3b8'}}>Producto</option> 
        {initialProducts.map(product => (
          <option key={product.id} value={product.id} style={{backgroundColor: '#1e293b', color: '#fff'}}>
            {product.nombre}
          </option>
        ))}
      </select>
      <select
        value={producto.color || ''}
        onChange={(e) => onChange(index, 'color', e.target.value)}
        style={{
          ...productInputStyle,
          ...selectStyleNoArrow,
          textAlign: 'center',
          color: producto.color ? '#ffffff' : '#94a3b8',
        }}
      >
        <option value="" style={{backgroundColor: '#1e293b', color: '#94a3b8'}}>Color</option>
        {initialColors?.map(color => (
          <option key={color.value} value={color.value} style={{backgroundColor: '#1e293b', color: '#fff'}}>{color.label}</option>
        ))}
      </select>
      <select
        value={producto.talla || ''}
        onChange={(e) => onChange(index, 'talla', e.target.value)}
        style={{
          ...productInputStyle,
          ...selectStyleNoArrow,
          textAlign: 'center',
          color: producto.talla ? '#ffffff' : '#94a3b8',
        }}
      >
        <option value="" style={{backgroundColor: '#1e293b', color: '#94a3b8'}}>Talla</option>
        {initialSizes?.map(talla => (
          <option key={talla.value} value={talla.value} style={{backgroundColor: '#1e293b', color: '#fff'}}>{talla.label}</option>
        ))}
      </select>
      <input
        type="number"
        value={producto.cantidad || ''}
        onChange={(e) => {
          const val = e.target.value;
          onChange(index, 'cantidad', val === '' ? '' : parseInt(val) || 0);
        }}
        style={{ 
          ...productInputStyle, 
          textAlign: 'center',
          WebkitAppearance: 'none',
          MozAppearance: 'textfield',
          appearance: 'none',
        }}
        min="1"
      />
      <input
        type="text"
        value={formatPrice(producto.precio)}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^\d]/g, '');
          onChange(index, 'precio', raw);
        }}
        placeholder="0"
        style={{
          ...productInputStyle,
          textAlign: 'center',
          color: '#F5C81B',
          fontWeight: '600',
        }}
      />
      <div style={{
        ...productInputStyle,
        backgroundColor: 'transparent', 
        border: 'none',
        color: '#F5C81B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        cursor: 'default',
        padding: '0'
      }}>
        ${subtotal.toLocaleString('es-CO')}
      </div>
      {showRemoveButton && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          style={{
            backgroundColor: 'transparent',
            color: '#ef4444',
            border: '1px solid #ef4444',
            borderRadius: '3px',
            padding: '0',
            cursor: 'pointer',
            height: '26px', 
            width: '26px', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px' 
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.producto.id === nextProps.producto.id &&
    prevProps.producto.nombre === nextProps.producto.nombre &&
    prevProps.producto.color === nextProps.producto.color &&
    prevProps.producto.talla === nextProps.producto.talla &&
    prevProps.producto.cantidad === nextProps.producto.cantidad &&
    prevProps.producto.precio === nextProps.producto.precio &&
    prevProps.isViewMode === nextProps.isViewMode &&
    prevProps.error === nextProps.error &&
    prevProps.isFirst === nextProps.isFirst
  );
});

// =============================================
// COMPONENTES DE FORMULARIO MODULARIZADOS
// =============================================
const FormField = React.memo(({ label, name, required = false, children, error }) => (
  <div>
    <label style={{ 
      fontSize: '12px', 
      color: '#e2e8f0', 
      fontWeight: '500', 
      marginBottom: '2px', 
      display: 'block' 
    }}>
      {label}: {required && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
    {children}
    {error && (
      <div style={{ color: '#f87171', fontSize: '11px', fontWeight: '500', marginTop: '1px', height: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ color: '#f87171', fontSize: '14px' }}>●</span>
        {error}
      </div>
    )}
  </div>
));

const DetailField = React.memo(({ label, value }) => (
  <div>
    <label style={{ fontSize: "12px", color: "#e2e8f0", fontWeight: "500", marginBottom: "2px", display: "block" }}>
      {label}:
    </label>
    <div style={{
      backgroundColor: "#1e293b",
      border: "1px solid #334155",
      borderRadius: "6px",
      padding: "4px 8px",
      color: "#f1f5f9",
      fontSize: "13px",
      minHeight: "30px",
      display: "flex",
      alignItems: "center",
    }}>
      {value || 'N/A'}
    </div>
  </div>
));

// =============================================
// CompraFormFields - MODIFICADO: Agregado campo de estado en edición
// =============================================
const CompraFormFields = React.memo(({
  mode,
  compra,
  nuevaCompra,
  setNuevaCompra,
  errors,
  closeModal,
  calcularTotal,
  agregarProducto,
  actualizarProducto,
  eliminarProducto,
  handleCreateCompra,
  handleEditCompra,
  proveedoresActivos,
  paymentMethods
}) => {
  const isView = mode === 'view';
  const isCreateMode = mode === 'create';
  const isEditMode = mode === 'edit';
  
  const estadosDisponibles = ['Completada', 'Anulada'];
  
  if (isView) {
    const total = compra?.productos?.reduce((sum, p) => sum + (p.cantidad * (parseFloat(p.precio) || 0)), 0) || 0;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 2 }}>
            <DetailField label="Proveedor" value={compra?.proveedor} />
          </div>
          <div style={{ flex: 1 }}>
            <DetailField label="Estado" value={compra?.estado} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <DetailField label="Método de Pago" value={compra?.metodo} />
          </div>
          <div style={{ flex: 1 }}>
            <DetailField label="Fecha" value={compra?.fecha} />
          </div>
        </div>
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '6px' 
          }}>
            <label style={{ fontSize: "12px", color: "#e2e8f0", fontWeight: "500", display: "block" }}>
              Productos:
            </label>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              padding: '4px 8px',
              backgroundColor: '#1e293b',
              border: '1px solid #F5C81B',
              borderRadius: '4px'
            }}>
              <span style={{ fontSize: '12px', color: '#e2e8f0', fontWeight: '500' }}>Total:</span>
              <span style={{ fontSize: '14px', color: '#F5C81B', fontWeight: '700' }}>
                ${total.toLocaleString('es-CO')}
              </span>
            </div>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2.5fr 1fr 1fr 0.8fr 1fr 1.2fr',
            gap: '6px',
            fontSize: '10px',
            color: '#94a3b8',
            marginBottom: '4px',
            padding: '0 4px',
            fontWeight: '600',
            borderBottom: '1px solid #334155', 
            paddingBottom: '4px'
          }}>
            <div>Producto</div>
            <div style={{ textAlign: 'center' }}>Color</div>
            <div style={{ textAlign: 'center' }}>Talla</div>
            <div style={{ textAlign: 'center' }}>Cant</div>
            <div style={{ textAlign: 'center' }}>Precio</div>
            <div style={{ textAlign: 'center' }}>Subtotal</div>
          </div>
          <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
            {compra?.productos?.map((p, i) => (
              <ProductoForm 
                key={`view-${p.id || i}`} 
                producto={p} 
                isViewMode={true} 
              />
            ))}
          </div>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          marginTop: '8px'
        }}>
          <button
            onClick={closeModal}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #94a3b8',
              color: '#94a3b8',
              padding: '6px 16px',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              minWidth: '80px',
              height: '32px',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#94a3b8';
              e.currentTarget.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ flex: 1 }}>
        <FormField label="Proveedor" name="proveedor" required error={errors.proveedor}>
          <select
            value={nuevaCompra.proveedor}
            onChange={(e) => setNuevaCompra(prev => ({ ...prev, proveedor: e.target.value }))}
            style={{
              width: '100%', 
              padding: '4px 8px', 
              borderRadius: '4px',
              border: `1px solid ${errors.proveedor ? '#ef4444' : '#334155'}`, 
              backgroundColor: '#1e293b',
              color: '#fff', 
              fontSize: '12px', 
              height: '30px', 
              outline: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23F5C81B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6,9 12,15 18,9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
              backgroundSize: '12px',
              paddingRight: '28px',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none',
            }}
          >
            <option value="">Seleccionar proveedor</option>
            {proveedoresActivos.map(proveedor => (
              <option key={proveedor.id} value={proveedor.nombre}>
                {proveedor.nombre}
              </option>
            ))}
          </select>
        </FormField>
      </div>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        {isEditMode && (
          <div style={{ flex: 1 }}>
            <FormField label="Estado" name="estado">
              <select
                value={nuevaCompra.estado || 'Completada'}
                onChange={(e) => setNuevaCompra(prev => ({ ...prev, estado: e.target.value }))}
                style={{
                  width: '100%', 
                  padding: '4px 8px', 
                  borderRadius: '4px',
                  border: '1px solid #334155', 
                  backgroundColor: '#1e293b',
                  color: '#fff', 
                  fontSize: '12px', 
                  height: '30px', 
                  outline: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23F5C81B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6,9 12,15 18,9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                  backgroundSize: '12px',
                  paddingRight: '28px',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                }}
              >
                {estadosDisponibles.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </FormField>
          </div>
        )}
        
        <div style={{ flex: 1 }}>
          <FormField label="Método de Pago" name="metodoPago">
            <select
              value={nuevaCompra.metodoPago}
              onChange={(e) => setNuevaCompra(prev => ({ ...prev, metodoPago: e.target.value }))}
              style={{
                width: '100%', 
                padding: '4px 8px', 
                borderRadius: '4px',
                border: '1px solid #334155', 
                backgroundColor: '#1e293b',
                color: '#fff', 
                fontSize: '12px', 
                height: '30px', 
                outline: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23F5C81B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6,9 12,15 18,9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
                backgroundSize: '12px',
                paddingRight: '28px',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none',
              }}
            >
              {paymentMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </FormField>
        </div>
        
        <div style={{ flex: 1 }}>
          <FormField label="Fecha" name="fecha" required error={errors.fecha}>
            <DateInputWithCalendar
              value={nuevaCompra.fecha}
              onChange={(date) =>
                setNuevaCompra(prev => ({ ...prev, fecha: date }))
              }
              error={errors.fecha}
            />
          </FormField>
        </div>
      </div>
      
      <div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '6px' 
        }}>
          <label style={{ fontSize: "12px", color: "#e2e8f0", fontWeight: "500", display: "block" }}>Productos:</label>
          <button
            type="button"
            onClick={agregarProducto}
            style={{
              backgroundColor: 'transparent',
              color: '#F5C81B',
              border: '1px solid #F5C81B',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
              fontSize: '11px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            + Agregar Producto
          </button>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2.5fr 1fr 1fr 0.8fr 1fr 1.2fr auto',
          gap: '6px',
          fontSize: '10px',
          color: '#94a3b8',
          marginBottom: '4px',
          padding: '0 4px',
          fontWeight: '600'
        }}>
          <div>Producto</div>
          <div style={{ textAlign: 'center' }}>Color</div>
          <div style={{ textAlign: 'center' }}>Talla</div>
          <div style={{ textAlign: 'center' }}>Cant</div>
          <div style={{ textAlign: 'center' }}>Precio</div>
          <div style={{ textAlign: 'center' }}>Subtotal</div>
          <div></div>
        </div>
        <div style={{ maxHeight: '120px', overflowY: 'auto', paddingRight: '2px' }}>
          {nuevaCompra.productos.map((producto, index) => {
            const productoErrors = [];
            if (errors[`producto_precio_${index}`]) productoErrors.push(errors[`producto_precio_${index}`]);
            if (errors[`producto_cantidad_${index}`]) productoErrors.push(errors[`producto_cantidad_${index}`]);
            return (
              <div key={producto._tempKey || `product-${index}`} style={{ marginBottom: '4px' }}>
                <ProductoForm
                  producto={producto}
                  index={index}
                  onChange={actualizarProducto}
                  onRemove={eliminarProducto}
                  error={productoErrors.length > 0}
                  isFirst={index === 0}
                />
                {productoErrors.length > 0 && (
                  <div style={{ color: '#f87171', fontSize: '10px', marginTop: '2px' }}>
                    {productoErrors.join(' • ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        paddingTop: '8px',
        borderTop: '1px solid #1e293b'
      }}>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
        }}>
            <span style={{ fontSize: '14px', color: '#e2e8f0', fontWeight: '500' }}>Total:</span>
            <span style={{ fontSize: '18px', color: '#F5C81B', fontWeight: '700' }}>${calcularTotal().toLocaleString('es-CO')}</span>
        </div>
        <div style={{ flex: 3, display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={closeModal}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #94a3b8',
              color: '#94a3b8',
              padding: '6px 16px',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              minWidth: '80px',
              height: '32px',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#94a3b8';
              e.currentTarget.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            Cancelar
          </button>
          <button
            onClick={isCreateMode ? handleCreateCompra : handleEditCompra}
            style={{
              backgroundColor: '#F5C81B',
              border: 'none',
              color: '#0f172a',
              padding: '6px 18px',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              minWidth: '90px',
              height: '32px',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5d33c';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F5C81B';
            }}
          >
            {isCreateMode ? 'Guardar Compra' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
    return (
        prevProps.mode === nextProps.mode &&
        prevProps.compra === nextProps.compra && 
        prevProps.nuevaCompra === nextProps.nuevaCompra &&
        prevProps.errors === nextProps.errors &&
        prevProps.proveedoresActivos === nextProps.proveedoresActivos
    );
});

// =============================================
// PÁGINA PRINCIPAL
// =============================================
const ComprasPage = () => {
  const [compras, setCompras] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [errors, setErrors] = useState({});
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'view',
    compra: null
  });
  const [anularModal, setAnularModal] = useState({ isOpen: false, compra: null });
  const [nuevaCompra, setNuevaCompra] = useState({
    proveedor: '',
    metodoPago: 'Efectivo',
    fecha: new Date().toLocaleDateString('es-CO'),
    productos: [{ id: '', nombre: '', color: '', talla: '', cantidad: 1, precio: '', _tempKey: Date.now() + Math.random() }],
    observaciones: '',
    estado: 'Completada'
  });

  const proveedoresActivos = useMemo(() => {
    return initialSuppliers
      ? initialSuppliers
          .filter(proveedor => proveedor.Estado)
          .map(proveedor => ({
            id: proveedor.IdProveedor,
            nombre: proveedor.Nombre,
            tipoDocumento: proveedor.TipoDocumento,
            numeroDocumento: proveedor.NumeroDocumento,
            telefono: proveedor.Telefono,
            direccion: proveedor.Direccion,
            correo: proveedor.Correo,
            estado: proveedor.Estado
          }))
      : [];
  }, []);

  const columns = [
    { 
      header: 'Proveedor', 
      field: 'proveedor',
      width: '300px',
      render: (item) => (
        <span style={{ color: '#fff', fontSize: '13px', fontWeight: '500' }}>
          {item.proveedor || 'N/A'}
        </span>
      )
    },
    { 
      header: 'Fecha', 
      field: 'fecha', 
      width: '90px',
      render: (item) => (
        <span style={{ color: '#fff', fontSize: '13px' }}>
          {item.fecha}
        </span>
      )
    },
    { 
      header: 'Total', 
      field: 'total',
      width: '120px',
      render: (item) => (
        <span style={{ 
          fontSize: '13px',
          fontWeight: '600',
          color: '#Fff'
        }}>
          ${Number(item.total).toLocaleString('es-CO')}
        </span>
      )
    },
    { 
      header: 'Método', 
      field: 'metodo',
      width: '100px',
      render: (item) => (
        <span style={{ color: '#fff', fontSize: '13px' }}>
          {item.metodo}
        </span>
      )
    },
    { 
      header: 'Estado', 
      field: 'estado',
      width: '100px',
      render: (item) => <StatusPill status={item.estado} />
    }
  ];

  useEffect(() => {
    const todasLasCompras = initialOrders.map(orden => ({
      id: `#${orden.IdCompra}`,
      proveedor: orden.proveedor,
      fecha: orden.Fecha ? new Date(orden.Fecha).toLocaleDateString('es-CO') : 'N/A', 
      total: orden.Total || 0,
      metodo: orden.metodoPago,
      estado: orden.estado === 'Anulada' ? 'Anulada' : 'Completada', 
      productos: orden.productos || [],
      isActive: orden.estado !== 'Anulada',
      observaciones: orden.observaciones || ''
    }));
    setCompras(todasLasCompras);
  }, []);

  const filteredCompras = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    let filtered = compras;
    const statusFilters = {
      'Todos': compra => true,
      'Completadas': compra => compra.estado === 'Completada',
      'Anuladas': compra => compra.estado === 'Anulada',
    };
    if (statusFilters[filterStatus]) {
      filtered = filtered.filter(statusFilters[filterStatus]);
    }
    if (term) {
      filtered = filtered.filter(compra => {
        const searchFields = [
          (compra.proveedor || '').toLowerCase(),
          (compra.estado || '').toLowerCase(),
          (compra.metodo || '').toLowerCase(),
          (compra.id || '').toLowerCase(),
        ];
        return searchFields.some(field => field.includes(term));
      });
    }
    return filtered;
  }, [compras, searchTerm, filterStatus]);

  const totalPages = Math.ceil(filteredCompras.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredCompras.length);
  const paginated = filteredCompras.slice(startIndex, endIndex);
  const showingStart = filteredCompras.length > 0 ? startIndex + 1 : 0;

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
    else if (totalPages === 0) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const showAlert = useCallback((message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setCurrentPage(1);
  }, []);

  const handleFilterSelect = useCallback((status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  }, []);
  
  const openModal = useCallback((mode = 'create', compra = null) => {
    if (compra && compra.estado === 'Anulada' && mode !== 'view') {
      showAlert('Las compras anuladas solo pueden ser vistas en detalle.', 'error');
      return;
    }
    setModalState({ isOpen: true, mode, compra });
    setErrors({});
    
    const mapProductos = (prods) => prods.map((p, i) => ({
      id: p.IdProducto || p.id || '',
      nombre: p.nombre || '',
      color: p.color || '', 
      talla: p.talla || '', 
      cantidad: p.cantidad || 1,
      precio: p.precio ? p.precio.toString() : '',
      _tempKey: p.IdProducto || p.id || `temp-${Date.now()}-${i}`,
    }));

    if (mode === 'edit' && compra) {
      setNuevaCompra({
        proveedor: compra.proveedor,
        metodoPago: compra.metodo,
        fecha: compra.fecha,
        productos: mapProductos(compra.productos),
        observaciones: compra.observaciones || '',
        estado: compra.estado || 'Completada'
      });
    } else if (mode === 'view' && compra) {
      setNuevaCompra({
        proveedor: compra.proveedor,
        metodoPago: compra.metodo,
        fecha: compra.fecha,
        productos: mapProductos(compra.productos),
        observaciones: compra.observaciones || '',
        estado: compra.estado || 'Completada'
      });
    } else {
      setNuevaCompra({
        proveedor: '',
        metodoPago: 'Efectivo',
        fecha: new Date().toLocaleDateString('es-CO'),
        productos: [{ id: '', nombre: '', color: '', talla: '', cantidad: 1, precio: '', _tempKey: Date.now() + Math.random() }],
        observaciones: '',
        estado: 'Completada'
      });
    }
  }, [showAlert]);

  const closeModal = useCallback(() => {
    setModalState({ isOpen: false, mode: 'view', compra: null });
    setErrors({});
    setNuevaCompra({
      proveedor: '',
      metodoPago: 'Efectivo',
      fecha: new Date().toLocaleDateString('es-CO'),
      productos: [{ id: '', nombre: '', color: '', talla: '', cantidad: 1, precio: '', _tempKey: Date.now() + Math.random() }],
      observaciones: '',
      estado: 'Completada'
    });
  }, []);

  const agregarProducto = useCallback(() => {
    setNuevaCompra(prev => ({
      ...prev,
      productos: [...prev.productos, { 
        id: '', 
        nombre: '', 
        color: '', 
        talla: '', 
        cantidad: 1, 
        precio: '', 
        _tempKey: Date.now() + Math.random()
      }] 
    }));
  }, []);

  const eliminarProducto = useCallback((index) => {
    if (nuevaCompra.productos.length > 1) {
      setNuevaCompra(prev => ({
        ...prev,
        productos: prev.productos.filter((_, i) => i !== index)
      }));
    }
  }, [nuevaCompra.productos.length]);

  const actualizarProducto = useCallback((index, campo, valor) => {
    setNuevaCompra(prev => {
      const nuevosProductos = [...prev.productos];
      if (nuevosProductos[index]) {
        nuevosProductos[index] = {
          ...nuevosProductos[index],
          [campo]: valor
        };
      }
      return {
        ...prev,
        productos: nuevosProductos
      };
    });
  }, []);

  const calcularTotal = useCallback(() => {
    return nuevaCompra.productos.reduce((total, producto) => {
      const precio = parseFloat(producto.precio) || 0;
      return total + (producto.cantidad || 0) * precio;
    }, 0);
  }, [nuevaCompra.productos]);

  const validarFormulario = useCallback(() => {
    const newErrors = {};
    if (!nuevaCompra.proveedor.trim()) newErrors.proveedor = 'El proveedor es requerido.';
    const [day, month, year] = nuevaCompra.fecha.split('/').map(Number);
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!nuevaCompra.fecha.trim() || !dateRegex.test(nuevaCompra.fecha) || isNaN(day) || isNaN(month) || isNaN(year)) {
      newErrors.fecha = 'La fecha es requerida o inválida.';
    }

    const productosValidos = nuevaCompra.productos.filter(p => p.nombre.trim() !== '');
    if (productosValidos.length === 0) newErrors.productos = 'Agregue al menos un producto válido.';
    nuevaCompra.productos.forEach((producto, index) => {
      if (producto.nombre.trim()) {
        const precioNum = parseFloat(producto.precio);
        if (!producto.precio || precioNum <= 0 || isNaN(precioNum)) {
          newErrors[`producto_precio_${index}`] = 'El precio debe ser un número mayor a 0.';
        }
        if (!producto.cantidad || producto.cantidad <= 0) {
          newErrors[`producto_cantidad_${index}`] = 'La cantidad debe ser mayor a 0.';
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [nuevaCompra]);

  const handleCreateCompra = useCallback(() => {
    if (!validarFormulario()) {
      showAlert('Por favor complete todos los campos requeridos correctamente', 'error');
      return;
    }
    const total = calcularTotal();
    const productosValidos = nuevaCompra.productos
      .filter(p => p.nombre.trim() !== '')
      .map(({ _tempKey, ...rest }) => rest);
    const nuevaCompraData = {
      id: `#${compras.length + 1}`,
      proveedor: nuevaCompra.proveedor,
      metodo: nuevaCompra.metodoPago,
      fecha: nuevaCompra.fecha,
      productos: productosValidos,
      total: total,
      estado: nuevaCompra.estado || 'Completada',
      isActive: nuevaCompra.estado !== 'Anulada',
      observaciones: nuevaCompra.observaciones
    };
    setCompras(prev => [...prev, nuevaCompraData]);
    showAlert(`Compra ${nuevaCompraData.id} creada exitosamente`, 'success');
    closeModal();
  }, [nuevaCompra, compras.length, validarFormulario, calcularTotal, showAlert, closeModal]);

  const handleEditCompra = useCallback(() => {
    if (!validarFormulario() || !modalState.compra) {
      showAlert('Por favor complete todos los campos requeridos correctamente', 'error');
      return;
    }
    const total = calcularTotal();
    const productosValidos = nuevaCompra.productos
      .filter(p => p.nombre.trim() !== '')
      .map(({ _tempKey, ...rest }) => rest);
    const compraActualizada = {
      ...modalState.compra,
      proveedor: nuevaCompra.proveedor,
      fecha: nuevaCompra.fecha,
      metodo: nuevaCompra.metodoPago,
      productos: productosValidos,
      total: total,
      estado: nuevaCompra.estado,
      isActive: nuevaCompra.estado !== 'Anulada',
      observaciones: nuevaCompra.observaciones
    };
    setCompras(prev => 
      prev.map(c => c.id === compraActualizada.id ? compraActualizada : c)
    );
    showAlert(`Compra ${modalState.compra.id} actualizada correctamente`, 'success');
    closeModal();
  }, [nuevaCompra, modalState.compra, validarFormulario, calcularTotal, showAlert, closeModal]);

  const handleAnularCompra = useCallback(() => {
    if (!anularModal.compra?.id) return;
    setCompras(prev =>
      prev.map(c =>
        c.id === anularModal.compra.id
          ? { 
              ...c, 
              estado: "Anulada", 
              isActive: false,
            }
          : c
      )
    );
    showAlert(`Compra ${anularModal.compra.id} anulada correctamente`, 'success');
    setAnularModal({ isOpen: false, compra: null });
  }, [anularModal.compra, showAlert]);

  const handleCustomActions = useCallback((compra, action) => {
    if (action === 'view') {
      openModal('view', compra);
    } else if (action === 'edit') {
      openModal('edit', compra);
    } else if (action === 'anular') {
      if (compra.estado !== "Anulada") {
        setAnularModal({ isOpen: true, compra });
      }
    }
  }, [openModal]);

  return (
    <>
      <AdminLayoutClean>
        {alert.show && (
          <Alert 
            message={alert.message} 
            type={alert.type} 
            onClose={() => setAlert({ show: false, message: '', type: 'success' })} 
          />
        )}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          padding: '0 12px 0 12px',
          flex: 1,
          overflow: 'hidden',
        }}>
          <div style={{ marginBottom: '8px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '6px'
            }}>
              <div>
                <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: '700', margin: 0 }}>Compras</h1>
                <p style={{ color: '#9CA3AF', fontSize: '15px', margin: 0 }}>Gestiona las compras a proveedores</p>
              </div>
              <button 
                onClick={() => openModal('create')} 
                style={{ 
                  padding: '6px 13px', 
                  backgroundColor: 'transparent', 
                  border: '1px solid #F5C81B', 
                  color: '#F5C81B', 
                  borderRadius: '4px', 
                  fontSize: '11px', 
                  cursor: 'pointer', 
                  whiteSpace: 'nowrap', 
                  minWidth: '100px', 
                  fontWeight: '600', 
                  display: 'flex', 
                  alignItems: 'center', 
                  height: '35px' 
                }}
                onMouseEnter={e => { e.target.style.backgroundColor = '#F5C81B'; e.target.style.color = '#000'; }}
                onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#F5C81B'; }}
              >
                Registrar Compra
              </button>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <SearchInput 
                value={searchTerm} 
                onChange={setSearchTerm} 
                placeholder="Buscar por proveedor, método o estado..." 
                onClear={clearSearch} 
                fullWidth={true} 
              />
              <StatusFilter 
                filterStatus={filterStatus} 
                onFilterSelect={handleFilterSelect} 
              />
            </div>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
            backgroundColor: '#151822',
            border: '1px solid #F5C81B',
            borderRadius: '6px',
            overflow: 'hidden',
            marginTop: '8px',
            width: '100%',
          }}>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <EntityTable
              entities={paginated}
              columns={columns}
              onView={compra => handleCustomActions(compra, 'view')}
              onEdit={compra => handleCustomActions(compra, 'edit')}
              onAnular={compra => handleCustomActions(compra, 'anular')}
              idField="id"
              isActiveField="isActive"
              showPagination={false}
              showSwitch={false}
              showAnularButton={true}
              anularIconOnly={true}
              moduleType="compras"
            />
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              backgroundColor: '#151822',
              borderTop: '1px solid #F5C81B',
              fontSize: '13px',
              color: '#e0e0e0',
              height: '50px',
            }}>
              <span style={{ fontWeight: '500' }}>
                Mostrando {showingStart}–{endIndex} de {filteredCompras.length} compras
              </span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    background: 'transparent',
                    border: '1px solid #F5C81B',
                    color: currentPage === 1 ? '#6B7280' : '#F5C81B',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    minWidth: '90px',
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage > 1) {
                      e.currentTarget.style.backgroundColor = '#F5C81B';
                      e.currentTarget.style.color = '#000';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage > 1) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#F5C81B';
                    }
                  }}
                >
                  ‹ Anterior
                </button>
                <span style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#F5C81B',
                  minWidth: '60px',
                  textAlign: 'center'
                }}>
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  style={{
                    background: 'transparent',
                    border: '1px solid #F5C81B',
                    color: currentPage >= totalPages ? '#6B7280' : '#F5C81B',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    minWidth: '90px',
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage < totalPages) {
                      e.currentTarget.style.backgroundColor = '#F5C81B';
                      e.currentTarget.style.color = '#000';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage < totalPages) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#F5C81B';
                    }
                  }}
                >
                  Siguiente ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </AdminLayoutClean>
      <UniversalModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={
          modalState.mode === 'create'
            ? 'Registrar Compra'
            : modalState.mode === 'edit'
            ? 'Editar Compra'
            : 'Detalles de la Compra'
        }
        subtitle={
          modalState.mode === 'create'
            ? 'Complete la información para registrar una nueva compra'
            : modalState.mode === 'edit'
            ? 'Modifique la información de la compra'
            : 'Información detallada de la compra'
        }
        showActions={false}
        customStyles={{
          content: { 
            padding: '20px',
            maxHeight: '90vh',
            width: '100%',
            maxWidth: '450px', 
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#000000',
            borderRadius: '8px',
            border: '1px solid #F5C81B'
          },
          overlay: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          }
        }}
      >
        <CompraFormFields 
          mode={modalState.mode}
          compra={modalState.compra}
          nuevaCompra={nuevaCompra}
          setNuevaCompra={setNuevaCompra}
          errors={errors}
          closeModal={closeModal}
          calcularTotal={calcularTotal}
          agregarProducto={agregarProducto}
          actualizarProducto={actualizarProducto}
          eliminarProducto={eliminarProducto}
          handleCreateCompra={handleCreateCompra}
          handleEditCompra={handleEditCompra}
          proveedoresActivos={proveedoresActivos}
          paymentMethods={paymentMethods}
        />
      </UniversalModal>
      <AnularOperacionModal
        isOpen={anularModal.isOpen}
        onClose={() => setAnularModal({ isOpen: false, compra: null })}
        onConfirm={handleAnularCompra}
        operationType="compra"
        operationData={anularModal.compra}
        customMessage="Al anular esta compra, el estado cambiará a 'Anulada' y será un registro histórico inmutable."
      />
    </>
  );
};

export default ComprasPage;