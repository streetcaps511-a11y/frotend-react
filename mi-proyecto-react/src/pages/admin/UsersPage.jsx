// src/pages/admin/UsersPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import AdminLayoutClean from "./AdminLayoutClean";

// Componentes
import SearchInput from "../../components/SearchInput";
import EntityTable from "../../components/EntityTable";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import Alert from "../../components/Alert";
import UniversalModal from "../../components/UniversalModal";

// Datos
import { initialUsers as usersData, initialRoles } from "../../data";

const UsersPage = () => {
  // ─── Estados
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // ─── Inicializar datos
  useEffect(() => {
    const mapped = usersData.map((u) => {
      const role = initialRoles.find((r) => r.IdRol === u.IdRol);
      const [nombre, ...apellidos] = u.Nombre.trim().split(/\s+/);
      const apellido = apellidos.join(" ") || "";
      return {
        id: u.IdUsuario,
        nombre,
        apellido,
        email: u.Correo || "",
        rol: role?.Nombre || "Sin rol",
        isActive: u.Estado,
        tipoDocumento: u.TipoDocumento || 'CC',
        numeroDocumento: u.NumeroDocumento || '',
        estado: u.Estado ? "Activo" : "Inactivo" // Agregar campo estado para EntityTable
      };
    });
    setUsers(mapped);
  }, []);

  // ─── Alertas
  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 2500);
  };

  // ─── Helper para verificar si es administrador
  const isAdministrador = (user) => (user?.rol || "").toLowerCase() === "administrador";

  // ─── Modal
  const openModal = (user = null) => {
    // Si el usuario es administrador, solo permitir ver detalles
    if (user && isAdministrador(user)) {
      viewUserDetails(user);
      return;
    }

    setEditingUser(user);
    setErrors({});

    if (user) {
      // Modo editar/ver
      setFormData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || '',
        tipoDocumento: user.tipoDocumento || 'CC',
        numeroDocumento: user.numeroDocumento || '',
        rol: user.rol || '',
        isActive: user.isActive !== undefined ? user.isActive : true
      });
    } else {
      // Modo crear
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        tipoDocumento: 'CC',
        numeroDocumento: '',
        rol: '',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingUser(null);
    setIsModalOpen(false);
    setFormData({});
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    const requiredFields = [
      { name: 'nombre', label: 'Nombre' },
      { name: 'email', label: 'Email' },
      { name: 'rol', label: 'Rol' },
    ];

    const newErrors = {};
    requiredFields.forEach(field => {
      const value = formData[field.name];
      const stringValue = value !== null && value !== undefined ? String(value) : '';
      if (!stringValue.trim()) {
        newErrors[field.name] = `${field.label} es obligatorio`;
      }
    });

    // Validación de email
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email no válido';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showAlert('Complete los campos obligatorios correctamente', 'delete');
      return;
    }

    const updatedData = {
      nombre: formData.nombre.trim(),
      apellido: (formData.apellido || '').trim(),
      email: formData.email.trim(),
      tipoDocumento: formData.tipoDocumento || 'CC',
      numeroDocumento: formData.numeroDocumento || '',
      rol: formData.rol,
      isActive: Boolean(formData.isActive),
      estado: formData.isActive ? "Activo" : "Inactivo" // Agregar campo estado
    };

    if (editingUser?.id) {
      setUsers(prev => prev.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...updatedData }
          : u
      ));
      showAlert(`Usuario "${updatedData.nombre}" actualizado correctamente`, 'edit');
    } else {
      const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      setUsers(prev => [...prev, { ...updatedData, id: newId }]);
      showAlert(`Usuario "${updatedData.nombre}" creado correctamente`, 'add');
    }

    closeModal();
  };

  // ─── Eliminar - No permitir eliminar usuarios activos
  const handleDeleteClick = (user) => {
    // Si el usuario es administrador, no permitir eliminar
    if (isAdministrador(user)) {
      showAlert('El usuario "Administrador" no se puede eliminar', "error");
      return;
    }
    
    // Si el usuario está activo, no permitir eliminar
    if (user.isActive) {
      showAlert('No se puede eliminar un usuario activo. Debe desactivarlo primero.', 'delete');
      return;
    }
    
    setUserToDelete(user);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
    setIsConfirmOpen(false);
    setUserToDelete(null);
    showAlert("Usuario eliminado correctamente");
  };

  // ─── Toggle de estado - FUNCIÓN PARA EL SWITCH
  const handleToggleStatus = (user) => {
    // Si el usuario es administrador, no permitir cambiar estado
    if (isAdministrador(user)) {
      showAlert('El usuario "Administrador" siempre está activo', "error");
      return;
    }
    
    const newStatus = !user.isActive;
    
    setUsers((prev) =>
      prev.map((u) => 
        u.id === user.id 
          ? { 
              ...u, 
              isActive: newStatus,
              estado: newStatus ? "Activo" : "Inactivo" // Actualizar campo estado
            } 
          : u
      )
    );
    
    showAlert(
      `Usuario "${user.nombre}" ${newStatus ? 'activado' : 'desactivado'} correctamente`,
      newStatus ? 'add' : 'delete'
    );
  };

  // ─── Ver detalles
  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  // ─── Utilidades de búsqueda y filtrado
  const clearSearch = () => { 
    setSearchTerm(''); 
    setCurrentPage(1); 
  };

  const handleFilterSelect = (status) => { 
    setFilterStatus(status); 
    setCurrentPage(1); 
  };

  // ─── Filtrado y paginación
  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    
    return users.filter((user) => {
      // Filtro por estado
      if (filterStatus === 'Activos' && !user.isActive) return false;
      if (filterStatus === 'Inactivos' && user.isActive) return false;
      
      // Filtro por búsqueda
      if (term) {
        const fullName = `${user.nombre} ${user.apellido}`.toLowerCase();
        return (
          fullName.includes(term) ||
          user.email.toLowerCase().includes(term) ||
          (user.rol?.toLowerCase() || "").includes(term) ||
          (user.numeroDocumento || "").toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [users, searchTerm, filterStatus]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredUsers.length);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  const showingStart = filteredUsers.length > 0 ? startIndex + 1 : 0;

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
    else if (totalPages === 0) setCurrentPage(1);
  }, [totalPages, currentPage]);

  // ─── Componente Filtro de Estado
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

  // ─── Render Field para el Modal
  const renderField = (label, fieldName, type = 'text', options = []) => {
    const isError = errors[fieldName];
    const borderColor = isError ? '#ef4444' : '#334155';
    const backgroundColor = isError ? '#451a1a' : '#1e293b';

    const labelStyle = {
      fontSize: '12px',
      color: '#e2e8f0',
      fontWeight: '500',
      marginBottom: '2px',
      display: 'block'
    };

    const inputStyle = {
      backgroundColor,
      border: `1px solid ${borderColor}`,
      borderRadius: '6px',
      padding: '4px 8px',
      color: '#f1f5f9',
      fontSize: '13px',
      height: '30px',
      width: '100%',
      outline: 'none',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
    };

    const errorStyle = {
      color: '#f87171',
      fontSize: '11px',
      fontWeight: '500',
      marginTop: '1px',
      height: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      visibility: isError ? 'visible' : 'hidden',
    };

    const value = formData[fieldName] || '';
    const isSelectField = ['tipoDocumento', 'rol'].includes(fieldName);

    if (isSelectField) {
      let fieldOptions = options;
      if (fieldName === 'rol') {
        fieldOptions = initialRoles.filter(r => r.Estado).map(r => ({ value: r.Nombre, label: r.Nombre }));
      }

      return (
        <div>
          <label style={labelStyle}>
            {label}: <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            name={fieldName}
            value={value}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            style={inputStyle}
          >
            <option value="">Seleccionar...</option>
            {fieldOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <div style={errorStyle}>
            {isError && (
              <>
                <span style={{ color: '#f87171', fontSize: '14px', fontWeight: 'bold' }}>●</span>
                {isError}
              </>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <label style={labelStyle}>
            {label}: <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            name={fieldName}
            type={type}
            value={value}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            style={inputStyle}
          />
          <div style={errorStyle}>
            {isError && (
              <>
                <span style={{ color: '#f87171', fontSize: '14px', fontWeight: 'bold' }}>●</span>
                {isError}
              </>
            )}
          </div>
        </div>
      );
    }
  };

  // ─── Columnas optimizadas
  const userColumns = [
    { 
      header: "Nombre", 
      field: "nombreCompleto",
      width: '180px',
      render: (u) => (
        <span style={{ 
          color: u.isActive ? '#fff' : '#9CA3AF',
          fontSize: '13px', 
          fontWeight: '600',
          display: 'block',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {u.nombre} {u.apellido}
        </span>
      )
    },
    { 
      header: "Email",
      field: "email",
      width: '260px',
      render: (u) => (
        <span style={{ 
          color: u.isActive ? '#fff' : '#9CA3AF',
          fontSize: '13px',
          fontWeight: '400',
          display: 'block',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {u.email}
        </span>
      )
    },
    { 
      header: "Rol", 
      field: "rol",
      width: '180px',
      render: (u) => (
        <span style={{ 
          color: u.isActive ? '#fff' : '#9CA3AF',
          fontSize: '13px', 
          fontWeight: '500',
          display: 'block',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {u.rol}
        </span>
      )
    },
    { 
      header: "Estado", 
      field: "estado",
      width: '100px',
      render: (u) => (
        <span style={{ 
          color: u.isActive ? '#10b981' : '#ef4444',
          fontSize: '13px', 
          fontWeight: '600',
          display: 'block',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {u.isActive ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
  ];

  // ─── Render
  return (
    <AdminLayoutClean>
      {alert.show && <Alert message={alert.message} type={alert.type} />}

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        padding: '0 12px 0 12px',
        flex: 1,
      }}>
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '6px'
          }}>
            <div>
              <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: '700', margin: 0, lineHeight: '1.2' }}>
                Usuarios
              </h1>
              <p style={{ color: '#9CA3AF', fontSize: '15px', margin: 0, lineHeight: '1.3' }}>
                Gestiona los usuarios del sistema
              </p>
            </div>
            <button 
              onClick={() => openModal()} 
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
                gap: '3px', 
                height: '35px' 
              }} 
              onMouseEnter={e => { e.target.style.backgroundColor = '#F5C81B'; e.target.style.color = '#000'; }}
              onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#F5C81B'; }}
            >
              Registrar Usuario
            </button>
          </div>

          {/* BÚSQUEDA Y FILTROS */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <SearchInput 
              value={searchTerm} 
              onChange={setSearchTerm} 
              placeholder="Buscar por nombre, email, documento o rol..." 
              onClear={clearSearch} 
              fullWidth={true} 
            />
            <StatusFilter />
          </div>
        </div>

        {/* TABLA + PAGINACIÓN */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          border: '1px solid #F5C81B',
          borderRadius: '6px',
          overflow: 'hidden',
          marginTop: '8px',
        }}>
          <div style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}>
            {/* ✅ ENTITYTABLE CON TOGGLE */}
            <EntityTable
              entities={paginatedUsers}
              columns={userColumns}
              onView={viewUserDetails}
              onEdit={openModal} 
              onDelete={handleDeleteClick}
              // ✅ TOGGLE: onAnular para desactivar, onReactivar para activar
              onAnular={(row) => handleToggleStatus(row)}
              onReactivar={(row) => handleToggleStatus(row)}
              idField="id"
              estadoField="estado" // Campo que contiene "Activo"/"Inactivo"
              moduleType="generic" // IMPORTANTE: Para mostrar el switch
              isAdministradorCheck={isAdministrador}
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
            boxSizing: 'border-box',
            flexShrink: 0
          }}>
            <span style={{ fontWeight: '500' }}>
              Mostrando {showingStart}–{endIndex} de {filteredUsers.length} usuarios
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
                  transition: 'all 0.2s ease',
                  outline: 'none',
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
                  transition: 'all 0.2s ease',
                  outline: 'none',
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

      {/* Modal: Crear/Editar Usuario */}
      <UniversalModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingUser?.id ? 'Editar Usuario' : 'Registrar Usuario'}
        subtitle={editingUser?.id ? 'Modifica los datos del usuario' : 'Agrega un nuevo usuario al sistema'}
        showActions={true}
        onCancel={closeModal}
        onConfirm={handleSave}
        confirmText={editingUser?.id ? 'Guardar Cambios' : 'Crear Usuario'}
        contentStyle={{ 
          padding: '0',
          maxHeight: 'none',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '100%' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <div style={{ flex: 1 }}>
              {renderField('Nombre', 'nombre', 'text')}
            </div>
            <div style={{ flex: 1 }}>
              {renderField('Apellido', 'apellido', 'text')}
            </div>
          </div>

          <div>
            {renderField('Email', 'email', 'email')}
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <div style={{ flex: 1 }}>
              {renderField('Tipo de Documento', 'tipoDocumento', 'select', [
                { value: 'CC', label: 'Cédula' },
                { value: 'CE', label: 'Extranjería' },
                { value: 'NIT', label: 'NIT' },
                { value: 'Pasaporte', label: 'Pasaporte' }
              ])}
            </div>
            <div style={{ flex: 1 }}>
              {renderField('Número de Documento', 'numeroDocumento', 'text')}
            </div>
          </div>

          <div>
            {renderField('Rol', 'rol', 'select')}
          </div>
        </div>
      </UniversalModal>

      {/* Modal Confirm Delete */}
      <ConfirmDeleteModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        entityName="usuario"
        entityData={userToDelete}
      />

      {/* Modal Detalles */}
      <UniversalModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Detalles del Usuario"
        subtitle="Información detallada del usuario"
        showActions={false}
        contentStyle={{
          padding: '0',
          maxHeight: 'none',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#e2e8f0', marginBottom: '4px', display: 'block' }}>
                  Nombre
                </label>
                <div style={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#F5C81B',
                  fontSize: '14px',
                  fontWeight: '600',
                  minHeight: '36px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {selectedUser?.nombre || 'N/A'}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#e2e8f0', marginBottom: '4px', display: 'block' }}>
                  Apellido
                </label>
                <div style={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#F5C81B',
                  fontSize: '14px',
                  fontWeight: '600',
                  minHeight: '36px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {selectedUser?.apellido || 'N/A'}
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: '600', color: '#e2e8f0', marginBottom: '4px', display: 'block' }}>
                Email
              </label>
              <div style={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '6px',
                padding: '8px 12px',
                color: '#f1f5f9',
                fontSize: '14px',
                minHeight: '36px',
                display: 'flex',
                alignItems: 'center'
              }}>
                {selectedUser?.email || 'Sin email'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#e2e8f0', marginBottom: '4px', display: 'block' }}>
                  Tipo de Documento
                </label>
                <div style={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#f1f5f9',
                  fontSize: '14px',
                  fontWeight: '600',
                  minHeight: '36px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {selectedUser?.tipoDocumento || 'N/A'}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#e2e8f0', marginBottom: '4px', display: 'block' }}>
                  Número de Documento
                </label>
                <div style={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#f1f5f9',
                  fontSize: '14px',
                  fontWeight: '600',
                  minHeight: '36px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {selectedUser?.numeroDocumento || 'N/A'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#e2e8f0', marginBottom: '4px', display: 'block' }}>
                  Rol
                </label>
                <div style={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#F5C81B',
                  fontSize: '14px',
                  fontWeight: '600',
                  minHeight: '36px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {selectedUser?.rol || 'Sin rol'}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#e2e8f0', marginBottom: '4px', display: 'block' }}>
                  Estado
                </label>
                <div style={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: selectedUser?.isActive ? '#10b981' : '#ef4444',
                  fontSize: '14px',
                  fontWeight: '600',
                  minHeight: '36px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {selectedUser?.isActive ? 'Activo' : 'Inactivo'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </UniversalModal>
    </AdminLayoutClean>
  );
};

export default UsersPage;