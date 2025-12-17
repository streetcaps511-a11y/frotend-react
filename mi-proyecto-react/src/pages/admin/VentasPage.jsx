// src/pages/admin/VentasPage.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import AdminLayoutClean from './AdminLayoutClean';
import { initialSales, paymentMethods, initialProducts, initialCustomers, initialSizes, initialColors } from '../../data';
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
// FUNCIÓN UTILIDAD: FORMATO DE FECHA
// =============================================
const formatDateToISO = (dateString) => {
    if (!dateString) return '';
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) return dateString;
    const parts = dateString.split('/');
    if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return '';
};
const dateObjectToISO = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// =============================================
// COMPONENTE StatusPill
// =============================================
const StatusPill = React.memo(({ status }) => {
  const displayStatus = status === "Cancelada" ? "Anulada" : status;
  const color = displayStatus === "Completada" ? "#10B981" : "#EF4444";
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
      {displayStatus}
    </span>
  );
});

// =============================================
// COMPONENTE StatusFilter
// =============================================
const StatusFilter = ({ filterStatus, onFilterSelect }) => {
  const [open, setOpen] = useState(false);
  const accentColor = '#F5C81B'; 
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
          border: `1px solid ${accentColor}`, 
          color: accentColor, 
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
          e.target.style.backgroundColor = accentColor; 
          e.target.style.color = '#000'; 
        }} 
        onMouseLeave={e => { 
          e.target.style.backgroundColor = 'transparent'; 
          e.target.style.color = accentColor; 
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
          border: `1px solid ${accentColor}`, 
          borderRadius: '6px', 
          padding: '6px 0', 
          minWidth: '120px', 
          zIndex: 1000, 
          boxShadow: `0 4px 12px rgba(245, 200, 27, 0.3)` 
        }}>
          {['Todos', 'Completadas', 'Anuladas'].map(status => (
            <button 
              key={status} 
              onClick={() => { onFilterSelect(status); setOpen(false); }} 
              style={{ 
                width: '100%', 
                padding: '6px 12px', 
                backgroundColor: filterStatus === status ? accentColor : 'transparent', 
                border: 'none', 
                color: filterStatus === status ? '#000' : accentColor, 
                fontSize: '13px', 
                textAlign: 'left', 
                cursor: 'pointer', 
                fontWeight: filterStatus === status ? '600' : '400' 
              }}
              onMouseEnter={e => filterStatus !== status && (
                e.target.style.backgroundColor = accentColor,
                e.target.style.color = '#000'
              )}
              onMouseLeave={e => filterStatus !== status && (
                e.target.style.backgroundColor = 'transparent',
                e.target.style.color = accentColor
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
// COMPONENTE ProductoVentaForm
// =============================================
const ProductoVentaForm = React.memo(
  ({
    producto,
    onChange,
    onRemove,
    index,
    isViewMode = false,
    error = false,
    isFirst = false,
  }) => {
    const subtotal =
      (producto.cantidad || 0) * (parseFloat(producto.precio) || 0);
    const baseStyle = {
      display: 'grid',
      gap: '6px',
      alignItems: 'center',
      marginBottom: '6px',
    };

    // Estilo común para inputs/selects
    const selectStyle = {
      backgroundColor: '#1e293b',
      border: `1px solid ${error ? '#ef4444' : '#334155'}`,
      borderRadius: '4px',
      color: '#ffffff',
      fontSize: '12px',
      fontWeight: '500',
      padding: '2px 8px', // ✅ Ajustado para evitar truncamiento
      width: '100%',
      height: '26px',
      outline: 'none',
      boxSizing: 'border-box',
      WebkitAppearance: 'none',
      MozAppearance: 'none',
      appearance: 'none',
      backgroundImage: `url("image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23F5C81B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6,9 12,15 18,9'%3E%3C/polyline%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 8px center',
      backgroundSize: '12px',
    };

    const gridTemplate = '2.5fr 1fr 1fr 0.8fr 1fr 1.2fr';
    const showRemoveButton = !isFirst;

    if (isViewMode) {
      return (
        <div style={{ ...baseStyle, gridTemplateColumns: gridTemplate }}>
          <div style={{ fontSize: '11px', color: '#fff' }}>
            {producto.nombre || '-'}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>
            {producto.color || '-'}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>
            {producto.talla || '-'}
          </div>
          <div style={{ fontSize: '11px', color: '#fff', textAlign: 'center' }}>
            {producto.cantidad || 0}
          </div>
          <div style={{ fontSize: '11px', color: '#F5C81B', textAlign: 'center' }}>
            ${(parseFloat(producto.precio) || 0).toLocaleString('es-CO')}
          </div>
          <div style={{ fontSize: '11px', color: '#F5C81B', textAlign: 'center' }}>
            ${subtotal.toLocaleString('es-CO')}
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          ...baseStyle,
          gridTemplateColumns: showRemoveButton
            ? `${gridTemplate} auto`
            : gridTemplate,
        }}
      >
        {/* PRODUCTO */}
        <select
          value={producto.id || ''}
          onChange={(e) => {
            const selectedId = e.target.value;
            const selected = initialProducts.find(p => String(p.id) === String(selectedId));
            if (selected) {
              onChange(index, 'id', selected.id);
              onChange(index, 'nombre', selected.nombre);
            } else {
              onChange(index, 'id', '');
              onChange(index, 'nombre', '');
            }
          }}
          style={selectStyle}
        >
          <option value="">Producto</option>
          {initialProducts.map((p) => (
            <option key={`product-${p.id}`} value={p.id}> {/* ✅ Clave única */}
              {p.nombre}
            </option>
          ))}
        </select>

        {/* COLOR */}
        <select
          value={producto.color || ''}
          onChange={(e) => onChange(index, 'color', e.target.value)}
          style={{
            ...selectStyle,
            textAlign: 'center',
          }}
        >
          <option value="">Color</option>
          {initialColors.map((c) => (
            <option key={`color-${c.value}`} value={c.value}> {/* ✅ Clave única */}
              {c.label}
            </option>
          ))}
        </select>

        {/* TALLA */}
        <select
          value={producto.talla || ''}
          onChange={(e) => onChange(index, 'talla', e.target.value)}
          style={{
            ...selectStyle,
            textAlign: 'center',
          }}
        >
          <option value="">Talla</option>
          {initialSizes.map((t) => (
            <option key={`size-${t.value}`} value={t.value}> {/* ✅ Clave única */}
              {t.label}
            </option>
          ))}
        </select>

        {/* CANTIDAD */}
        <input
          type="number"
          min="1"
          value={producto.cantidad || ''}
          onChange={(e) =>
            onChange(index, 'cantidad', parseInt(e.target.value) || 0)
          }
          style={{
            ...selectStyle,
            textAlign: 'center',
          }}
        />

        {/* PRECIO */}
        <input
          type="text"
          value={producto.precio}
          onChange={(e) =>
            onChange(index, 'precio', e.target.value.replace(/[^\d]/g, ''))
          }
          style={{
            ...selectStyle,
            textAlign: 'center',
            color: '#F5C81B',
            fontWeight: '600',
          }}
        />

        {/* SUBTOTAL */}
        <div
          style={{
            ...selectStyle,
            border: 'none',
            textAlign: 'center',
            color: '#F5C81B',
            fontWeight: '700',
            backgroundColor: 'transparent',
          }}
        >
          ${subtotal.toLocaleString('es-CO')}
        </div>

        {/* ELIMINAR */}
        {showRemoveButton && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            style={{
              width: '26px',
              height: '26px',
              border: '1px solid #ef4444',
              background: 'transparent',
              color: '#ef4444',
              cursor: 'pointer',
              borderRadius: '4px',
            }}
          >
            ×
          </button>
        )}
      </div>
    );
  },
  (prevProps, nextProps) =>
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

// =============================================
// COMPONENTES AUXILIARES
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
// VentaFormFields
// =============================================
const VentaFormFields = React.memo(({
  mode,
  venta,
  nuevaVenta,
  setNuevaVenta,
  errors,
  closeModal,
  calcularTotal,
  agregarProducto,
  actualizarProducto,
  eliminarProducto,
  handleCreateVenta,
  handleEditVenta,
  clientesActivos, 
  paymentMethods,
}) => {
  const isView = mode === 'view';
  const isCreateMode = mode === 'create';
  
  if (isView) {
    const total = venta?.productos?.reduce((sum, p) => sum + (p.cantidad * (parseFloat(p.precio) || 0)), 0) || 0;
    let clienteDisplay = 'N/A';
    if (typeof venta?.cliente === 'object' && venta.cliente?.nombre) {
        clienteDisplay = venta.cliente.nombre;
    } else if (typeof venta?.cliente === 'string') {
        clienteDisplay = venta.cliente;
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 2 }}>
            <DetailField label="Cliente" value={clienteDisplay} />
          </div>
          <div style={{ flex: 1 }}>
            <DetailField label="Estado" value={venta?.estado === 'Cancelada' ? 'Anulada' : venta?.estado || 'N/A'} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <DetailField label="Método de Pago" value={venta?.metodoPago} />
          </div>
          <div style={{ flex: 1 }}>
            <DetailField label="Fecha" value={venta?.fecha ? new Date(venta.fecha).toLocaleDateString('es-CO') : 'N/A'} />
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
            {venta?.productos?.map((p, i) => (
              <ProductoVentaForm 
                key={String(p.id || p._tempKey || `temp-${i}`)} 
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
        <FormField label="Cliente" name="cliente" required error={errors.cliente}>
          <select
            value={nuevaVenta.cliente}
            onChange={(e) => setNuevaVenta(prev => ({ ...prev, cliente: e.target.value }))}
            style={{
              width: '100%', 
              padding: '4px 8px', 
              borderRadius: '4px',
              border: `1px solid ${errors.cliente ? '#ef4444' : '#334155'}`, 
              backgroundColor: '#1e293b',
              color: '#fff', 
              fontSize: '12px', 
              height: '30px', 
              outline: 'none',
              backgroundImage: `url("image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23F5C81B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6,9 12,15 18,9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
              backgroundSize: '12px',
              paddingRight: '28px',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none',
            }}
          >
            <option value="">Seleccionar cliente</option>
            {clientesActivos.map(cliente => (
              <option key={cliente.id} value={cliente.nombre}>
                {cliente.nombre}
              </option>
            ))}
          </select>
        </FormField>
      </div>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        {/* MÉTODO DE PAGO */}
        <div style={{ flex: 1 }}>
          <FormField label="Método de Pago" name="metodoPago">
            <select
              value={nuevaVenta.metodoPago}
              onChange={(e) => setNuevaVenta(prev => ({ ...prev, metodoPago: e.target.value }))}
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
                backgroundImage: `url("image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23F5C81B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6,9 12,15 18,9'%3E%3C/polyline%3E%3C/svg%3E")`,
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
        
        {/* ESTADO - EDITABLE EN MODO EDITAR */}
        <div style={{ flex: 1 }}>
          <FormField label="Estado" name="estado" required error={errors.estado}>
            <select
              value={nuevaVenta.estado || 'Completada'}
              onChange={(e) => setNuevaVenta(prev => ({ 
                ...prev, 
                estado: e.target.value 
              }))}
              style={{
                width: '100%', 
                padding: '4px 8px', 
                borderRadius: '4px',
                border: `1px solid ${errors.estado ? '#ef4444' : nuevaVenta.estado === 'Anulada' ? '#ef4444' : '#334155'}`, 
                backgroundColor: '#1e293b',
                color: nuevaVenta.estado === 'Anulada' ? '#ef4444' : '#fff', 
                fontSize: '12px', 
                height: '30px', 
                outline: 'none',
                backgroundImage: `url("image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='${nuevaVenta.estado === 'Anulada' ? '%23ef4444' : '%23F5C81B'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6,9 12,15 18,9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
                backgroundSize: '12px',
                paddingRight: '28px',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="Completada">Completada</option>
              <option value="Anulada">Anulada</option>
            </select>
          </FormField>
        </div>

        {/* FECHA */}
        <div style={{ flex: 1 }}>
          <FormField label="Fecha" name="fecha" required error={errors.fecha}>
            <DateInputWithCalendar
              value={nuevaVenta.fecha ? new Date(nuevaVenta.fecha + 'T00:00:00').toLocaleDateString('es-CO') : ''} 
              onChange={(ddmmyyyy) => {
                const parts = ddmmyyyy.split('/');
                if (parts.length === 3) {
                    const [day, month, year] = parts;
                    const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                    setNuevaVenta(prev => ({ ...prev, fecha: isoDate }));
                }
              }}
              error={errors.fecha}
            />
          </FormField>
        </div>
      </div>
      
      {/* PRODUCTOS */}
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2.5fr 1fr 1fr 0.8fr 1fr 1.2fr auto',
            gap: '6px',
            fontSize: '10px',
            color: '#94a3b8',
            marginBottom: '4px',
            padding: '0 4px',
            fontWeight: '600',
            borderBottom: '1px solid #334155',
            paddingBottom: '4px',
          }}
        >
          <div>Producto</div>
          <div style={{ textAlign: 'center' }}>Color</div>
          <div style={{ textAlign: 'center' }}>Talla</div>
          <div style={{ textAlign: 'center' }}>Cant</div>
          <div style={{ textAlign: 'center' }}>Precio</div>
          <div style={{ textAlign: 'center' }}>Subtotal</div>
          <div /> 
        </div>
        <div
          style={{
            maxHeight: '120px',
            overflowY: 'auto',
            overflowX: 'visible',
            paddingRight: '2px',
            position: 'relative', 
          }}
        >
          {nuevaVenta.productos.map((producto, index) => {
            const productoErrors = [];
            if (errors[`producto_precio_${index}`])
              productoErrors.push(errors[`producto_precio_${index}`]);
            if (errors[`producto_cantidad_${index}`])
              productoErrors.push(errors[`producto_cantidad_${index}`]);
            const hasError = productoErrors.length > 0 || errors.productos;
            return (
              <div
                key={producto._tempKey || `product-${index}`}
                style={{
                  marginBottom: '4px',
                  position: 'relative', 
                }}
              >
                <ProductoVentaForm
                  producto={producto}
                  index={index}
                  onChange={actualizarProducto}
                  onRemove={eliminarProducto}
                  error={!!hasError}
                  isFirst={index === 0}
                />
                {(productoErrors.length > 0 || (errors.productos && index === nuevaVenta.productos.length - 1)) && (
                  <div
                    style={{
                      color: '#f87171',
                      fontSize: '10px',
                      marginTop: '2px',
                      marginLeft: '4px',
                      lineHeight: '1.2',
                    }}
                  >
                    {productoErrors.length > 0
                        ? productoErrors.join(' • ')
                        : errors.productos}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* TOTAL Y BOTONES */}
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
            onClick={isCreateMode ? handleCreateVenta : handleEditVenta}
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
            {isCreateMode ? 'Guardar Venta' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
    return (
        prevProps.mode === nextProps.mode &&
        prevProps.venta === nextProps.venta && 
        prevProps.nuevaVenta === nextProps.nuevaVenta &&
        prevProps.errors === nextProps.errors &&
        prevProps.clientesActivos === nextProps.clientesActivos 
    );
});

// =============================================
// PÁGINA PRINCIPAL
// =============================================
const VentasPage = () => {
  const [ventas, setVentas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [errors, setErrors] = useState({});
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'view',
    venta: null
  });
  const [anularModal, setAnularModal] = useState({ isOpen: false, venta: null });
  const [nuevaVenta, setNuevaVenta] = useState({
    cliente: '',
    metodoPago: 'Efectivo',
    fecha: dateObjectToISO(new Date()), 
    productos: [{ id: '', nombre: '', color: '', talla: '', cantidad: 1, precio: '', _tempKey: Date.now() + Math.random() }], 
    observaciones: '',
    estado: 'Completada'
  });
  
  const clientesActivos = useMemo(() => {
    return initialCustomers
      ? initialCustomers
          .filter(cliente => cliente.Estado)
          .map(cliente => ({
            id: cliente.IdCliente,
            nombre: cliente.Nombre,
            tipoDocumento: cliente.TipoDocumento,
            numeroDocumento: cliente.NumeroDocumento,
            telefono: cliente.Telefono,
            direccion: cliente.Direccion,
            correo: cliente.Correo,
            estado: cliente.Estado
          }))
      : [];
  }, []);
  
  const columns = [
    { 
      header: 'Cliente', 
      field: 'cliente',
      width: '180px',
      render: (item) => (
        <span style={{ color: '#fff', fontSize: '13px', fontWeight: '500' }}>
          {typeof item.cliente === 'object'
            ? item.cliente?.nombre || 'N/A'
            : item.cliente || 'N/A'}
        </span>
      )
    },
    { 
      header: 'Fecha', 
      field: 'fecha', 
      width: '100px',
      render: (item) => (
        <span style={{ color: '#fff', fontSize: '13px' }}>
          {item.fecha ? new Date(item.fecha).toLocaleDateString('es-CO') : 'N/A'}
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
          color: '#F58A0F'
        }}>
          ${Number(item.total).toLocaleString('es-CO')}
        </span>
      )
    },
    { 
      header: 'Método', 
      field: 'metodoPago',
      width: '120px',
      render: (item) => (
        <span style={{ color: '#fff', fontSize: '13px' }}>
          {item.metodoPago}
        </span>
      )
    },
    { 
      header: 'Estado', 
      field: 'estado',
      width: '120px',
      render: (item) => <StatusPill status={item.estado} />
    }
  ];
  
  useEffect(() => {
    const todasLasVentas = initialSales.map(venta => ({
      id: `#${venta.IdVenta || venta.id || Date.now() + Math.random()}`, 
      cliente: venta.cliente,
      fecha: venta.fecha ? formatDateToISO(new Date(venta.fecha).toLocaleDateString('es-CO')) : dateObjectToISO(new Date()), 
      total: venta.total || 0,
      metodoPago: venta.metodoPago,
      estado: venta.estado === 'Cancelada' ? 'Anulada' : 'Completada', 
      isActive: venta.estado !== 'Cancelada',
      observaciones: venta.observaciones || '',
      productos: venta.productos || []
    }));
    setVentas(todasLasVentas);
  }, []);
  
  const filteredVentas = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    let filtered = ventas;
    const statusFilters = {
      'Todos': venta => true,
      'Completadas': venta => venta.estado === 'Completada',
      'Anuladas': venta => venta.estado === 'Anulada',
    };
    if (statusFilters[filterStatus]) {
      filtered = filtered.filter(statusFilters[filterStatus]);
    }
    if (term) {
      filtered = filtered.filter(venta => {
        const clienteName = typeof venta.cliente === 'object' ? venta.cliente?.nombre : venta.cliente;
        const searchFields = [
          (clienteName || '').toLowerCase(),
          (venta.estado || '').toLowerCase(),
          (venta.metodoPago || '').toLowerCase(),
          (venta.id || '').toLowerCase(),
        ];
        return searchFields.some(field => field.includes(term));
      });
    }
    return filtered;
  }, [ventas, searchTerm, filterStatus]);
  
  const totalPages = Math.ceil(filteredVentas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredVentas.length);
  const paginated = filteredVentas.slice(startIndex, endIndex);
  const showingStart = filteredVentas.length > 0 ? startIndex + 1 : 0;
  
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
  
  const openModal = useCallback((mode = 'create', venta = null) => {
    if (venta && venta.estado === 'Anulada' && mode !== 'view') {
      showAlert('Las ventas anuladas solo pueden ser vistas en detalle.', 'error');
      return;
    }
    setModalState({ isOpen: true, mode, venta });
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
    
    if (mode === 'edit' && venta) {
      const clienteValue = typeof venta.cliente === 'object' ? venta.cliente?.nombre : venta.cliente;
      setNuevaVenta({
        cliente: clienteValue || '',
        metodoPago: venta.metodoPago,
        fecha: venta.fecha,
        productos: mapProductos(venta.productos),
        observaciones: venta.observaciones || '',
        estado: venta.estado || 'Completada'
      });
    } else if (mode === 'view' && venta) {
       const clienteValue = typeof venta.cliente === 'object' ? venta.cliente?.nombre : venta.cliente;
      setNuevaVenta({
        cliente: clienteValue || '',
        metodoPago: venta.metodoPago,
        fecha: venta.fecha,
        productos: mapProductos(venta.productos),
        observaciones: venta.observaciones || '',
        estado: venta.estado 
      });
    } else {
      setNuevaVenta({
        cliente: '',
        metodoPago: 'Efectivo',
        fecha: dateObjectToISO(new Date()),
        productos: [{ id: '', nombre: '', color: '', talla: '', cantidad: 1, precio: '', _tempKey: Date.now() + Math.random() }], 
        observaciones: '',
        estado: 'Completada' 
      });
    }
  }, [showAlert]);
  
  const closeModal = useCallback(() => {
    setModalState({ isOpen: false, mode: 'view', venta: null });
    setErrors({});
    setNuevaVenta({
      cliente: '',
      metodoPago: 'Efectivo',
      fecha: dateObjectToISO(new Date()),
      productos: [{ id: '', nombre: '', color: '', talla: '', cantidad: 1, precio: '', _tempKey: Date.now() + Math.random() }], 
      observaciones: '',
      estado: 'Completada'
    });
  }, []);
  
  const agregarProducto = useCallback(() => {
    setNuevaVenta(prev => ({
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
    if (nuevaVenta.productos.length > 1) {
      setNuevaVenta(prev => ({
        ...prev,
        productos: prev.productos.filter((_, i) => i !== index)
      }));
    }
  }, [nuevaVenta.productos.length]);
  
  const actualizarProducto = useCallback((index, campo, valor) => {
    setNuevaVenta(prev => {
      const nuevosProductos = [...prev.productos];
      if (nuevosProductos[index]) {
        if (campo === 'nombre') {
            const selectedProduct = initialProducts.find(p => p.id === valor);
            if (selectedProduct) {
                nuevosProductos[index].nombre = selectedProduct.nombre;
            } else {
                nuevosProductos[index].nombre = '';
            }
        }
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
    return nuevaVenta.productos.reduce((total, producto) => {
      const precio = parseFloat(producto.precio) || 0;
      return total + (producto.cantidad || 0) * precio;
    }, 0);
  }, [nuevaVenta.productos]);
  
  const validarFormulario = useCallback(() => {
    const newErrors = {};
    if (!nuevaVenta.cliente.trim()) newErrors.cliente = 'El cliente es requerido.';
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!nuevaVenta.fecha.trim() || !dateRegex.test(nuevaVenta.fecha)) {
      newErrors.fecha = 'La fecha es requerida o inválida.';
    }
    if (!nuevaVenta.estado) {
      newErrors.estado = 'El estado es requerido.';
    }
    const productosValidos = nuevaVenta.productos.filter(p => p.nombre.trim() !== '');
    if (productosValidos.length === 0) newErrors.productos = 'Agregue al menos un producto válido.';
    nuevaVenta.productos.forEach((producto, index) => {
      if (producto.nombre.trim()) {
        const precioNum = parseFloat(producto.precio);
        const productoExiste = initialProducts.some(p => p.id === producto.id);
        if (!productoExiste) {
             newErrors[`producto_nombre_${index}`] = 'El producto seleccionado no es válido.';
        }
        if (!producto.precio || precioNum <= 0 || isNaN(precioNum)) {
          newErrors[`producto_precio_${index}`] = 'El precio debe ser > 0.';
        }
        if (!producto.cantidad || producto.cantidad <= 0) {
          newErrors[`producto_cantidad_${index}`] = 'La cant. debe ser > 0.';
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [nuevaVenta]);
  
  const handleCreateVenta = useCallback(() => {
    if (!validarFormulario()) {
      showAlert('Por favor complete todos los campos requeridos correctamente', 'error');
      return;
    }
    const total = calcularTotal();
    const productosValidos = nuevaVenta.productos
      .filter(p => p.nombre.trim() !== '')
      .map(({ _tempKey, ...rest }) => rest);
    const nuevaVentaData = {
      id: `#${ventas.length + 1}`,
      cliente: nuevaVenta.cliente,
      metodoPago: nuevaVenta.metodoPago,
      fecha: nuevaVenta.fecha,
      productos: productosValidos,
      total: total,
      estado: nuevaVenta.estado || 'Completada', 
      isActive: nuevaVenta.estado !== 'Anulada',
      observaciones: nuevaVenta.observaciones 
    };
    setVentas(prev => [...prev, nuevaVentaData]);
    showAlert(`Venta ${nuevaVentaData.id} creada exitosamente`, 'success');
    closeModal();
  }, [nuevaVenta, ventas.length, validarFormulario, calcularTotal, showAlert, closeModal]);
  
  const handleEditVenta = useCallback(() => {
    if (!validarFormulario() || !modalState.venta) {
      showAlert('Por favor complete todos los campos requeridos correctamente', 'error');
      return;
    }
    const total = calcularTotal();
    const productosValidos = nuevaVenta.productos
      .filter(p => p.nombre.trim() !== '')
      .map(({ _tempKey, ...rest }) => rest);
    
    const ventaActualizada = {
      ...modalState.venta,
      cliente: nuevaVenta.cliente,
      fecha: nuevaVenta.fecha,
      metodoPago: nuevaVenta.metodoPago,
      productos: productosValidos,
      total: total,
      estado: nuevaVenta.estado,
      isActive: nuevaVenta.estado !== 'Anulada', 
      observaciones: nuevaVenta.observaciones 
    };
    
    setVentas(prev => 
      prev.map(c => c.id === ventaActualizada.id ? ventaActualizada : c)
    );
    showAlert(`Venta ${modalState.venta.id} actualizada correctamente`, 'success');
    closeModal();
  }, [nuevaVenta, modalState.venta, validarFormulario, calcularTotal, showAlert, closeModal]);
  
  const handleAnularVenta = useCallback(() => {
    if (!anularModal.venta?.id) return;
    setVentas(prev =>
      prev.map(v =>
        v.id === anularModal.venta.id
          ? { ...v, estado: "Anulada", isActive: false }
          : v
      )
    );
    showAlert(`Venta ${anularModal.venta.id} anulada correctamente`, 'success');
    setAnularModal({ isOpen: false, venta: null });
  }, [anularModal.venta, showAlert]);
  
  const openAnularModal = useCallback((venta) => {
    if (venta.estado !== "Anulada") {
      setAnularModal({ isOpen: true, venta });
    }
  }, []);
  
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
                <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: '700', margin: 0 }}>Ventas</h1>
                <p style={{ color: '#9CA3AF', fontSize: '15px', margin: 0 }}>Gestiona las ventas a clientes</p>
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
                Registrar Venta
              </button>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <SearchInput 
                value={searchTerm} 
                onChange={setSearchTerm} 
                placeholder="Buscar por cliente, método o estado..." 
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
              {/* Línea aproximadamente 974 */}
          <EntityTable
            entities={paginated}
            columns={columns}
            onView={venta => openModal('view', venta)}
            onEdit={venta => openModal('edit', venta)} // Mantén la función
            onAnular={openAnularModal}
            idField="id"
            isActiveField="isActive"
            showPagination={false}
            moduleType="ventas"
            hideActionsForCanceled={true}
            showEditButton={false} // ✅ Alternativa si EntityTable usa esta prop
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
                Mostrando {showingStart}–{endIndex} de {filteredVentas.length} ventas
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
            ? 'Registrar Venta'
            : modalState.mode === 'edit'
            ? 'Editar Venta'
            : 'Detalles de la Venta'
        }
        subtitle={
          modalState.mode === 'create'
            ? 'Complete la información para registrar una nueva venta'
            : modalState.mode === 'edit'
            ? 'Modifique la información de la venta'
            : 'Información detallada de la venta'
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
        <VentaFormFields 
          mode={modalState.mode}
          venta={modalState.venta}
          nuevaVenta={nuevaVenta}
          setNuevaVenta={setNuevaVenta}
          errors={errors}
          closeModal={closeModal}
          calcularTotal={calcularTotal}
          agregarProducto={agregarProducto}
          actualizarProducto={actualizarProducto}
          eliminarProducto={eliminarProducto}
          handleCreateVenta={handleCreateVenta}
          handleEditVenta={handleEditVenta}
          clientesActivos={clientesActivos}
          paymentMethods={paymentMethods}
        />
      </UniversalModal>
      <AnularOperacionModal
        isOpen={anularModal.isOpen}
        onClose={() => setAnularModal({ isOpen: false, venta: null })}
        onConfirm={handleAnularVenta}
        operationType="venta"
        operationData={anularModal.venta}
        customMessage="Al anular esta venta, el estado cambiará a 'Anulada' y será un registro histórico inmutable."
      />
    </>
  );
};
export default VentasPage;