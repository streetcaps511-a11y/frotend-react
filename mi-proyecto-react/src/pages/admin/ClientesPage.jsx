import React, { useState, useEffect, useRef } from 'react';
import AdminLayoutClean from './AdminLayoutClean';
import { initialCustomers } from '../../data';
import EntityTable from '../../components/EntityTable';
import Alert from '../../components/Alert';
import SearchInput from '../../components/SearchInput';
import UniversalModal from '../../components/UniversalModal';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';

const ClientesPage = () => {
  // =========================
  // ESTADOS
  // =========================
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [modalState, setModalState] = useState({ 
    isOpen: false, 
    mode: 'view', 
    cliente: null 
  });

  const [formData, setFormData] = useState({
    documentType: 'Cédula de Identidad',
    documentNumber: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    department: '',
    balance: '0',
    isActive: true
  });

  const [errors, setErrors] = useState({});
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, cliente: null, customMessage: '' });

  const firstInputRef = useRef(null);

  // =========================
  // FILTRADO Y PAGINACIÓN (MOVIDO ARRIBA)
  // =========================

  const filteredClientes = (() => {
    const term = searchTerm.toLowerCase().trim();
    let filtered = clientes;
    
    const statusFilters = {
      'Activos': cliente => cliente.isActive,
      'Inactivos': cliente => !cliente.isActive
    };
    
    if (statusFilters[filterStatus]) {
      filtered = filtered.filter(statusFilters[filterStatus]);
    }
    
    if (term) {
      filtered = filtered.filter(cliente => {
        const searchFields = [
          cliente.nombreCompleto?.toLowerCase() || '',
          cliente.email?.toLowerCase() || '',
          cliente.telefono?.toLowerCase() || '',
          cliente.ciudad?.toLowerCase() || '',
          cliente.departamento?.toLowerCase() || '',
          cliente.tipoDocumento?.toLowerCase() || ''
        ];
        return searchFields.some(field => field.includes(term));
      });
    }
    return filtered;
  })();

  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredClientes.length);
  const paginatedClientes = filteredClientes.slice(startIndex, endIndex);
  const showingStart = filteredClientes.length > 0 ? startIndex + 1 : 0;

  // =========================
  // EFFECTS
  // =========================

  // Cargar departamentos
  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const res = await fetch('https://api-colombia.com/api/v1/Department  ');
        const data = await res.json();
        setDepartamentos(data.sort((a, b) => a.name.localeCompare(b.name)));
      } catch {
        showAlert('Error cargando departamentos', 'error');
      }
    };
    fetchDepartamentos();
  }, []);

  // Inicializar clientes
  useEffect(() => {
    const mapped = initialCustomers.map((c, i) => ({
      id: c.Correo || `cliente-${i}`,
      tipoDocumento: 'Cédula de Identidad',
      numeroDocumento: `${i + 10000000}`,
      nombreCompleto: c.Nombre,
      email: c.Correo,
      telefono: c.Telefono,
      direccion: c.Direccion,
      ciudad: c.Ciudad,
      departamento: c.Departamento,
      saldoFavor: c.SaldoaFavor || '0',
      isActive: i % 3 !== 0, // 1 de cada 3 inactivo
    }));
    setClientes(mapped);
  }, []);

  // Ajustar paginación
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Enfocar primer campo en modal
  useEffect(() => {
    if (modalState.isOpen && (modalState.mode === 'create' || modalState.mode === 'edit')) {
      const timer = setTimeout(() => {
        if (firstInputRef.current) {
          firstInputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [modalState.isOpen, modalState.mode]);

  // =========================
  // FUNCIONES DE UTILIDAD
  // =========================

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleFilterSelect = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  // =========================
  // FUNCIONES DE CIUDADES Y DEPARTAMENTOS
  // =========================

  const loadCitiesByDepartment = async (deptId) => {
    if (!deptId) {
      setCiudades([]);
      return;
    }
    setLoadingCities(true);
    try {
      const res = await fetch(`https://api-colombia.com/api/v1/City?departmentId=  ${deptId}`);
      const data = await res.json();
      setCiudades(data.sort((a, b) => a.name.localeCompare(b.name)));
    } catch {
      showAlert('Error cargando ciudades', 'error');
    }
    setLoadingCities(false);
  };

  // =========================
  // FUNCIONES DE MODAL
  // =========================

  const openModal = (mode = 'create', cliente = null) => {
    setModalState({ isOpen: true, mode, cliente });
    setErrors({});

    if (cliente && (mode === 'edit' || mode === 'view')) {
      const dept = departamentos.find(d => d.name === cliente.departamento);
      if (dept) loadCitiesByDepartment(dept.id);

      const saldo = cliente.saldoFavor || '0';
      setFormData({
        documentType: cliente.tipoDocumento,
        documentNumber: cliente.numeroDocumento,
        fullName: cliente.nombreCompleto,
        email: cliente.email,
        phone: cliente.telefono,
        address: cliente.direccion,
        city: cliente.ciudad,
        department: dept?.id || '',
        balance: saldo,
        isActive: cliente.isActive
      });
    } else {
      setFormData({
        documentType: 'Cédula de Identidad',
        documentNumber: '',
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        department: '',
        balance: '0',
        isActive: true
      });
      setCiudades([]);
    }
  };

  const closeModal = () => {
    setModalState({ isOpen: false, mode: 'view', cliente: null });
    setFormData({
      documentType: 'Cédula de Identidad',
      documentNumber: '',
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      department: '',
      balance: '0',
      isActive: true
    });
    setErrors({});
    setCiudades([]);
  };

  // =========================
  // MANEJO DE FORMULARIO
  // =========================

  const handleInputChange = (field, value) => {
    if (errors[field]) {
      const newErr = { ...errors };
      delete newErr[field];
      setErrors(newErr);
    }

    if (field === 'department') {
      loadCitiesByDepartment(value);
      setFormData(prev => ({ ...prev, department: value, city: '' }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = () => {
    const required = [
      ['documentNumber', 'Número de documento'],
      ['fullName', 'Nombre completo'],
      ['email', 'Email'],
      ['phone', 'Teléfono'],
      ['address', 'Dirección'],
      ['department', 'Departamento'],
      ['city', 'Ciudad'],
    ];

    const newErrors = {};
    required.forEach(([field, label]) => {
      if (!String(formData[field] || '').trim()) newErrors[field] = `${label} es obligatorio`;
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (formData.balance && !/^\d*$/.test(formData.balance)) {
      newErrors.balance = 'El saldo debe ser un número entero válido';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      showAlert('Complete los campos obligatorios correctamente', 'error');
      return;
    }

    const deptObj = departamentos.find(d => d.id.toString() === formData.department);
    const cityObj = ciudades.find(c => c.id.toString() === formData.city);

    let saldoFormateado = '0';
    if (formData.balance) {
      const saldoNum = parseInt(formData.balance, 10);
      saldoFormateado = isNaN(saldoNum) ? '0' : saldoNum.toString();
    }

    const updatedCliente = {
      tipoDocumento: formData.documentType,
      numeroDocumento: formData.documentNumber,
      nombreCompleto: formData.fullName,
      email: formData.email,
      telefono: formData.phone,
      direccion: formData.address,
      ciudad: cityObj?.name || formData.city,
      departamento: deptObj?.name || formData.department,
      saldoFavor: saldoFormateado,
      isActive: formData.isActive
    };

    if (modalState.mode === 'edit') {
      setClientes(prev =>
        prev.map(c => (String(c.id) === String(modalState.cliente.id) ? { ...c, ...updatedCliente } : c))
      );
      showAlert(`Cliente ${updatedCliente.nombreCompleto} actualizado correctamente`);
    } else {
      const newCliente = { 
        ...updatedCliente, 
        id: `cliente-${Date.now()}` 
      };
      setClientes(prev => [...prev, newCliente]);
      showAlert(`Cliente ${updatedCliente.nombreCompleto} registrado correctamente`);
    }
    closeModal();
  };

  // =========================
  // FUNCIONES DE ACCIONES
  // =========================

  const openDeleteModal = (cliente) => {
    // NO PERMITIR ELIMINAR SI ESTÁ ACTIVO
    if (cliente.isActive) {
      showAlert(`No se puede eliminar el cliente "${cliente.nombreCompleto}" porque está activo. Desactívelo primero.`, 'error');
      return;
    }
    
    const mensaje = `¿Estás seguro que deseas eliminar permanentemente al cliente "${cliente.nombreCompleto}"?`;
    setDeleteModal({ 
      isOpen: true, 
      cliente,
      customMessage: mensaje
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, cliente: null, customMessage: '' });
  };

  const handleDelete = () => {
    setClientes(prev => prev.filter(c => String(c.id) !== String(deleteModal.cliente.id)));
    showAlert('Cliente eliminado permanentemente', 'delete');
    closeDeleteModal();
  };

  const handleReactivar = (cliente) => {
    setClientes(prev =>
      prev.map(c =>
        String(c.id) === String(cliente.id) ? { ...c, isActive: true } : c
      )
    );
    showAlert(`Cliente "${cliente.nombreCompleto}" reactivado correctamente`, 'success');
  };

  const handleDesactivar = (cliente) => {
    setClientes(prev =>
      prev.map(c => 
        String(c.id) === String(cliente.id) ? { ...c, isActive: false } : c
      )
    );
    showAlert(`Cliente "${cliente.nombreCompleto}" desactivado`, 'error');
  };

  // =========================
  // COMPONENTES INTERNOS
  // =========================

  // Filtro de estado
  const StatusFilter = () => {
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
            {['Todos', 'Activos', 'Inactivos'].map(status => (
              <button 
                key={status} 
                onClick={() => { handleFilterSelect(status); setOpen(false); }} 
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

  // Renderizado de campos
  const renderField = (label, fieldName, type = "text", options = []) => {
    const isError = errors[fieldName];
    const borderColor = isError ? "#ef4444" : "#334155";
    const backgroundColor = isError ? "#451a1a" : "#1e293b";

    const labelStyle = {
      fontSize: "12px",
      color: "#e2e8f0",
      fontWeight: "500",
      marginBottom: "2px",
      display: "block",
    };

    const inputStyle = {
      backgroundColor,
      border: `1px solid ${borderColor}`,
      borderRadius: "6px",
      padding: "4px 8px",
      color: "#f1f5f9",
      fontSize: "13px",
      height: "30px",
      width: "100%",
      outline: "none",
      boxSizing: "border-box",
      fontFamily: "inherit",
    };

    const errorStyle = {
      color: "#f87171",
      fontSize: "11px",
      fontWeight: "500",
      marginTop: "1px",
      height: "14px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      visibility: isError ? "visible" : "hidden",
    };

    if (modalState.mode === "view") {
      const fieldMap = {
        documentType: "tipoDocumento",
        documentNumber: "numeroDocumento",
        fullName: "nombreCompleto",
        email: "email",
        phone: "telefono",
        address: "direccion",
        department: "departamento",
        city: "ciudad",
        balance: "saldoFavor",
        isActive: "isActive",
      };

      const key = fieldMap[fieldName];
      let displayValue = modalState.cliente?.[key] || "N/A";

      if (fieldName === "isActive") {
        displayValue = modalState.cliente.isActive ? "Activo" : "Inactivo";
      }

      if (fieldName === "balance") {
        displayValue = `$${parseInt(displayValue || 0).toLocaleString("es-CO")}`;
      }

      return (
        <div>
          <label style={labelStyle}>{label}:</label>
          <div
            style={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "6px",
              padding: "4px 8px",
              color: "#f1f5f9",
              fontSize: "13px",
              minHeight: "30px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {displayValue}
          </div>
        </div>
      );
    }

    const [localValue, setLocalValue] = useState(formData[fieldName] || "");

    useEffect(() => {
      setLocalValue(formData[fieldName] || "");
    }, [formData[fieldName]]);

    const handleChange = (e) => {
      setLocalValue(e.target.value);
    };

    const handleBlur = () => {
      handleInputChange(fieldName, localValue);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleBlur();
      }
    };

    if (["documentType", "department", "city"].includes(fieldName)) {
      let fieldOptions = options;
      if (fieldName === "department") {
        fieldOptions = departamentos.map((d) => ({ value: d.id, label: d.name }));
      } else if (fieldName === "city") {
        fieldOptions = ciudades.map((c) => ({ value: c.id, label: c.name }));
      } else if (fieldName === "documentType") {
        fieldOptions = [
          { value: "Cédula de Identidad", label: "Cédula de Identidad" },
          { value: "Pasaporte", label: "Pasaporte" },
          { value: "RUC", label: "RUC" },
        ];
      }

      return (
        <div>
          <label style={labelStyle}>
            {label}: <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <select
            key={fieldName}
            value={localValue}
            onChange={(e) => {
              setLocalValue(e.target.value);
              handleInputChange(fieldName, e.target.value);
            }}
            disabled={fieldName === "city" && loadingCities}
            style={{
              ...inputStyle,
              cursor: fieldName === "city" && loadingCities ? "wait" : "pointer",
            }}
          >
            <option value="">Seleccionar...</option>
            {fieldOptions.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>
          <div style={errorStyle}>
            {isError && (
              <>
                <span style={{ color: "#f87171", fontSize: "14px" }}>●</span>
                {isError}
              </>
            )}
          </div>
        </div>
      );
    }

    return (
      <div>
        <label style={labelStyle}>
          {label}: <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <input
          key={fieldName}
          type="text"
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          ref={fieldName === "documentNumber" ? firstInputRef : null}
          style={inputStyle}
        />
        <div style={errorStyle}>
          {isError && (
            <>
              <span style={{ color: "#f87171", fontSize: "14px" }}>●</span>
              {isError}
            </>
          )}
        </div>
      </div>
    );
  };

  // Componente de campos del formulario
  const ClienteFormFields = () => {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '6px',
        maxWidth: '100%',
      }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ flex: 1 }}>
            {renderField('Tipo Documento', 'documentType', 'select')}
          </div>
          <div style={{ flex: 1 }}>
            {renderField('Número Documento', 'documentNumber', 'text')}
          </div>
        </div>

        <div>{renderField('Nombre Completo', 'fullName', 'text')}</div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ flex: 1 }}>{renderField('Email', 'email', 'text')}</div>
          <div style={{ flex: 1 }}>{renderField('Teléfono', 'phone', 'text')}</div>
        </div>

        <div>{renderField('Dirección', 'address', 'text')}</div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ flex: 1 }}>{renderField('Departamento', 'department', 'select')}</div>
          <div style={{ flex: 1 }}>{renderField('Ciudad', 'city', 'select')}</div>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '6px',
          alignItems: 'flex-end'
        }}>
          <div style={{ flex: 2 }}>
            {renderField('Saldo a Favor', 'balance', 'text')}
          </div>
          
          {/* ✅ Muestra el campo Estado solo en modo 'view' */}
          {modalState.mode === 'view' && (
            <div style={{ flex: 3 }}>
              {renderField('Estado', 'isActive', 'text')}
            </div>
          )}

          {(modalState.mode === 'create' || modalState.mode === 'edit') && (
            <div style={{ 
              flex: 3,
              display: 'flex', 
              justifyContent: 'flex-end', 
              alignItems: 'center', 
              gap: '6px',
            }}>
              <button
                onClick={closeModal}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #94a3b8',
                  color: '#94a3b8',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  minWidth: '70px',
                  height: '28px',
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
                onClick={handleSave}
                style={{
                  backgroundColor: '#F5C81B',
                  border: 'none',
                  color: '#0f172a',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  minWidth: '80px',
                  height: '28px',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5d33c';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F5C81B';
                }}
              >
                {modalState.mode === 'create' ? 'Guardar' : 'Guardar Cambios'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

// =========================
// DEFINICIÓN DE COLUMNAS
// =========================

const columns = [
  { 
    header: 'Tipo Documento', 
    field: 'tipoDocumento',
    render: (item) => <span style={{ color: '#fff', fontSize: '13px', fontWeight: '400' }}>{item.tipoDocumento || 'N/A'}</span>
  },
  { 
    header: 'N° Documento', 
    field: 'numeroDocumento',
    render: (item) => <span style={{ color: '#fff', fontSize: '13px', fontWeight: '500' }}>{item.numeroDocumento || 'N/A'}</span>
  },
  { 
    header: 'Nombre', 
    field: 'nombreCompleto',
    render: (item) => <span style={{ color: '#fff', fontSize: '13px', fontWeight: '500', }}>{item.nombreCompleto || 'N/A'}</span>
  },
  { 
    header: 'Correo', 
    field: 'email',
    render: (item) => (
      <span style={{ 
        color: '#fff', 
        fontSize: '12px', 
        fontWeight: '400',
        display: 'inline-block',
        overflow: 'visible',
        textOverflow: 'clip', 
        whiteSpace: 'nowrap'
      }}>
        {item.email || 'N/A'}
      </span>
    )
  },
  { 
    header: 'Teléfono', 
    field: 'telefono',
    // Alineación a la derecha y ancho fijo
    style: { width: '120px', minWidth: '120px', textAlign: 'right' },
    render: (item) => (
      <span style={{ 
        color: '#fff', 
        fontSize: '13px', 
        fontWeight: '400',
        display: 'block', 
        textAlign: 'right', // Alineación a la derecha
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}>
        {item.telefono || 'N/A'}
      </span>
    )
  }
];

  // =========================
  // RENDER PRINCIPAL
  // =========================

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
          width: '100%',
        }}>
          {/* HEADER */}
          <div style={{ marginBottom: '8px', width: '100%' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '6px',
              width: '100%',
            }}>
              <div>
                <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: '700', margin: 0 }}>Clientes</h1>
                <p style={{ color: '#9CA3AF', fontSize: '15px', margin: 0 }}>Gestiona los clientes registrados</p>
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
                Registrar Cliente
              </button>
            </div>

            {/* BARRA DE BÚSQUEDA Y FILTROS */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', width: '100%' }}>
              <SearchInput 
                value={searchTerm} 
                onChange={setSearchTerm} 
                placeholder="Buscar por nombre, email, teléfono o ciudad..." 
                onClear={clearSearch} 
                fullWidth={true} 
              />
              <StatusFilter />
            </div>
          </div>

          {/* TABLA DE CLIENTES */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
            border: '1px solid #F5C81B',
            borderRadius: '6px',
            overflow: 'hidden',
            marginTop: '8px',
            width: '100%',
            maxWidth: '100%',
            paddingRight: '1px', 
          }}>
            <div style={{ 
              flex: 1, 
              overflowY: 'auto',
              overflowX: 'hidden',
              width: '100%',
              marginLeft: '-5px', 
            }}>
              <EntityTable
                key={clientes.length}
                entities={paginatedClientes}
                columns={columns}
                idField="id"
                estadoField="isActive"
                onEdit={cliente => openModal('edit', cliente)}
                onAnular={handleDesactivar} // Toggle Desactivar
                onReactivar={handleReactivar} // Toggle Activar
                onView={cliente => openModal('view', cliente)} // MOVIDO DESPUÉS DEL TOGGLE
                onDelete={openDeleteModal}
                moduleType="generic"
              />
            </div>

            {/* PIE DE PÁGINA CON PAGINACIÓN */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px 8px 17px', // AJUSTADO PADDING IZQUIERDO
              backgroundColor: '#151822',
              borderTop: '1px solid #F5C81B',
              fontSize: '13px',
              color: '#e0e0e0',
              height: '50px',
              width: '100%',
            }}>
              <span style={{ fontWeight: '500' }}>
                Mostrando {showingStart}–{endIndex} de {filteredClientes.length} clientes
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

      {/* MODAL PARA CREAR/EDITAR/VER CLIENTES */}
      <UniversalModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={
          modalState.mode === 'create'
            ? 'Registrar Cliente'
            : modalState.mode === 'edit'
            ? 'Editar Cliente'
            : 'Detalles del Cliente'
        }
        subtitle={
          modalState.mode === 'create'
            ? 'Complete la información para registrar un nuevo cliente'
            : modalState.mode === 'edit'
            ? 'Modifique la información del cliente'
            : 'Información detallada del cliente'
        }
        showActions={false}
        customStyles={{
          content: { 
            padding: '16px',
            backgroundColor: '#000000',
            border: '1px solid rgba(255,215,0,0.25)',
            borderRadius: '12px',
            maxWidth: '400px',
            width: '100%',
          }
        }}
      >
        <ClienteFormFields />
      </UniversalModal>

      {/* MODAL DE CONFIRMACIÓN PARA ELIMINAR */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        entityName="cliente"
        entityData={deleteModal.cliente}
        customMessage={deleteModal.customMessage}
      />
    </>
  );
};

export default ClientesPage;