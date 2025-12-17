// src/pages/admin/RolesPage.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import AdminLayoutClean from "./AdminLayoutClean";
import { initialRoles, availablePermissions } from "../../data";

// Componentes
import SearchInput from "../../components/SearchInput";
import EntityTable from "../../components/EntityTable";
import UniversalModal from "../../components/UniversalModal";
import Alert from "../../components/Alert";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";

// ─────────────────────────────────────────────────────────────────────
// Componente Principal
// ─────────────────────────────────────────────────────────────────────
const RolesPage = () => {
  // ── Estados
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);

  const [currentRole, setCurrentRole] = useState({
    name: "",
    description: "",
    permissions: [],
    isActive: true,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit" | "details"

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const [selectedRole, setSelectedRole] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    name: false,
    permissions: false
  });

  // ── Ref para el contenedor de la tabla
  const tableContainerRef = useRef(null);

  // ── Helpers
  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 2500);
  };

  const isAdministrador = (role) => (role?.name || "").toLowerCase() === "administrador";

  // ── Validación de campos
  const validateFields = () => {
    const errors = {
      name: !currentRole.name?.trim(),
      permissions: currentRole.permissions.length === 0 && !isAdministrador(currentRole)
    };
    
    setFieldErrors(errors);
    return !errors.name && !errors.permissions;
  };

  // ── Efecto: Inicializar roles
  useEffect(() => {
    const mappedRoles = initialRoles.map((role) => ({
      id: role.IdRol,
      name: role.Nombre,
      description: role.Descripcion || "",
      permissions: role.Permisos || [],
      isActive: role.Estado,
    }));

    const updatedRoles = mappedRoles.map((role) =>
      isAdministrador(role)
        ? { ...role, description: "Acceso de solo lectura" }
        : role
    );

    setRoles(updatedRoles);
  }, []);

  // ── Datos derivados
  const filteredRoles = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return roles.filter((r) => {
      if (filterStatus === "Activos" && !r.isActive) return false;
      if (filterStatus === "Inactivos" && r.isActive) return false;

      if (term) {
        return (
          (r.name || "").toLowerCase().includes(term) ||
          (r.description || "").toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [roles, searchTerm, filterStatus]);

  // ── Paginación
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredRoles.length);
  const paginatedRoles = filteredRoles.slice(startIndex, endIndex);
  const showingStart = filteredRoles.length > 0 ? startIndex + 1 : 0;

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
    else if (totalPages === 0) setCurrentPage(1);
  }, [totalPages, currentPage]);

  // ── Columnas de la tabla (Corregida la descripción)
  const roleColumns = [
    { 
      header: "Rol", 
      field: "name", 
      width: "200px", 
      render: (item) => (
        <span style={{ 
          color: '#fff', 
          fontSize: '13px', 
          fontWeight: '500',
          display: 'block',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {item.name || 'N/A'}
        </span>
      )
    },
    { 
      header: "Descripción", 
      field: "description", 
      width: "300px", 
      render: (item) => (
        <span style={{ 
          color: '#fff', 
          fontSize: '13px',
          display: 'block',
          whiteSpace: 'normal', 
          wordBreak: 'break-word',
          maxHeight: '3em',
          overflow: 'hidden',
        }}>
          {item.description}
        </span>
      )
    },
    { 
      header: "Estado", 
      field: "estado",
      width: "120px",
      render: (r) => (
        <span style={{
          color: r.isActive ? "#10b981" : "#ef4444",
          fontWeight: 600,
          fontSize: "13px",
          display: 'block',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {r.isActive ? "Activo" : "Inactivo"}
        </span>
      )
    }
  ];

  // ── Handlers para EntityTable
  const handleView = (role) => {
    setSelectedRole(role);
    setModalMode("details");
    setIsModalOpen(true);
  };

  const handleEdit = (role) => {
    if (isAdministrador(role)) {
      showAlert('El rol "Administrador" no se puede editar', "error");
      return;
    }
    setCurrentRole({ ...role });
    setModalMode("edit");
    setFieldErrors({ name: false, permissions: false });
    setIsModalOpen(true);
  };

  const handleDelete = (role) => {
    if (isAdministrador(role)) {
      showAlert('El rol "Administrador" no se puede eliminar', "error");
      return;
    }
    
    // Verificar si el rol está activo
    if (role.isActive) {
      showAlert('No se puede eliminar un rol activo. Primero desactívelo.', "error");
      return;
    }
    
    setRoleToDelete(role);
    setIsConfirmOpen(true);
  };

  const handleToggleStatus = (role) => {
    if (isAdministrador(role)) {
      showAlert('El rol "Administrador" siempre está activo', "error");
      return;
    }
    
    setRoles((prev) =>
      prev.map((r) => (r.id === role.id ? { ...r, isActive: !r.isActive } : r))
    );
    
    showAlert(
      `Rol "${role.name}" ${!role.isActive ? 'activado' : 'desactivado'} correctamente`,
      !role.isActive ? 'add' : 'delete'
    );
  };

  const openModal = () => {
    setCurrentRole({ name: "", description: "", permissions: [], isActive: true });
    setModalMode("create");
    setFieldErrors({ name: false, permissions: false });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentRole({ name: "", description: "", permissions: [], isActive: true });
    setModalMode("create");
    setFieldErrors({ name: false, permissions: false });
    setIsModalOpen(false);
  };

  const handleSave = () => {
    if (!validateFields()) {
      showAlert("Complete todos los campos requeridos", "error");
      return;
    }

    const updatedData = {
      ...currentRole,
      name: currentRole.name.trim(),
      description: currentRole.description?.trim() || "",
      permissions: currentRole.permissions || [],
      isActive: Boolean(currentRole.isActive),
    };

    if (updatedData.id) {
      setRoles((prev) => prev.map((r) => (r.id === updatedData.id ? updatedData : r)));
      showAlert("Rol actualizado correctamente");
    } else {
      const newId = roles.length > 0 ? Math.max(...roles.map((r) => r.id)) + 1 : 1;
      setRoles((prev) => [...prev, { ...updatedData, id: newId }]);
      showAlert("Rol creado correctamente");
    }
    closeModal();
  };

  const confirmDelete = () => {
    const roleName = roleToDelete?.name || "Rol";
    setRoles((prev) => prev.filter((r) => r.id !== roleToDelete.id));
    setIsConfirmOpen(false);
    setRoleToDelete(null);
    showAlert(`Rol "${roleName}" eliminado correctamente`, "delete");
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleFilterSelect = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  // ── Componente interno: Filtro de Estado
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
            height: '36px',
            transition: 'all 0.2s'
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
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            style={{ 
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)', 
              transition: 'transform 0.2s' 
            }}
          >
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
                  fontWeight: filterStatus === status ? '600' : '400',
                  transition: 'all 0.2s'
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

  // ── Función para renderizar permisos en 3 o 2 columnas verticales, sin fondo (Mismos estilos que antes)
  const renderPermissionsColumns = (permissions, readOnly = false, isAdmin = false) => {
    // Si es administrador, mostramos en 2 columnas para ahorrar espacio vertical
    const numColumns = isAdmin ? 2 : 3;
    const permissionsPerColumn = Math.ceil(availablePermissions.length / numColumns);
    
    // Crear las columnas
    return [0, 1, 2].slice(0, numColumns).map((colIndex) => {
      const start = colIndex * permissionsPerColumn;
      const end = start + permissionsPerColumn;
      const columnPermissions = availablePermissions.slice(start, end);
      
      return (
        <div 
          key={colIndex} 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px',
            flex: 1,
            padding: '8px 0',
          }}
        >
          {columnPermissions.map((p) => {
            const isChecked = isAdmin || (permissions || []).includes(p.id);
            
            return (
              <label
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#cbd5e1',
                  cursor: readOnly ? 'default' : 'pointer',
                  fontSize: '12px',
                  padding: '2px 0',
                  minHeight: '22px',
                  width: '100%',
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => {
                    if (!readOnly) {
                      const list = permissions || [];
                      const newPermissions = e.target.checked
                        ? [...list, p.id]
                        : list.filter((x) => x !== p.id);

                      setCurrentRole({ ...currentRole, permissions: newPermissions });

                      if (newPermissions.length > 0 && fieldErrors.permissions) {
                        setFieldErrors({ ...fieldErrors, permissions: false });
                      }
                    }
                  }}
                  disabled={readOnly || isAdmin}
                  style={{
                    accentColor: isChecked ? '#F5C81B' : '#64748b',
                    width: '14px',
                    height: '14px',
                    cursor: readOnly || isAdmin ? 'default' : 'pointer',
                    flexShrink: 0,
                    opacity: isChecked ? 1 : 0.6
                  }}
                />

                <span
                  style={{
                    color: isAdmin ? '#F5C81B' : '#cbd5e1',
                    fontWeight: isAdmin ? '600' : '400',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    flex: 1
                  }}
                >
                  {p.label}
                </span>

                {isAdmin && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontSize: '10px',
                      color: '#10b981',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      padding: '1px 4px',
                      borderRadius: '3px',
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>
                )}
              </label>
            );
          })}
        </div>
      );
    });
  };

  // ── Render
  return (
    <AdminLayoutClean>
      {/* Alerta global */}
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
                Roles
              </h1>
              <p style={{ color: '#9CA3AF', fontSize: '15px', margin: 0, lineHeight: '1.3' }}>
                Gestiona los roles y permisos del sistema
              </p>
            </div>
            <button 
              onClick={openModal} 
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
              Registrar Rol
            </button>
          </div>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <SearchInput 
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por nombre o descripción..."
              onClear={clearSearch}
              fullWidth={true}
            />
            <StatusFilter />
          </div>
        </div>
        

        {/* TABLA + PAGINACIÓN */}
        <div 
          ref={tableContainerRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
            
            border: '1px solid #F5C81B',
            borderRadius: '6px',
            overflow: 'hidden',
            marginTop: '8px',
          }}
        >
          <div style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}>
            {/* 🔽 AQUÍ ESTÁ LA LLAMADA MODIFICADA A EntityTable */}
            <EntityTable
              entities={paginatedRoles}
              columns={roleColumns}
              itemsPerPage={itemsPerPage}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              // 🔽 AGREGAR TOGGLE PARA ROLES
              onAnular={(role) => handleToggleStatus(role)}
              onReactivar={(role) => handleToggleStatus(role)}
              idField="id"
              // 🔽 IMPORTANTE: Usar 'isActive' como campo de estado
              estadoField="isActive"
              isActiveField="isActive"
              moduleType="generic"
              showPagination={false}
              containerRef={tableContainerRef}
              // 🔽 FUNCIÓN PARA DETECTAR ADMINISTRADOR
              isAdministradorCheck={isAdministrador}
              // 🔽 PERSONALIZAR ACCIONES PARA ADMINISTRADOR
              hideActionsForCanceled={false}
            />
          </div>

          {/* PAGINACIÓN */}
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
              Mostrando {showingStart}–{endIndex} de {filteredRoles.length} roles
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

      <UniversalModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalMode === 'create' ? 'Registrar Rol' : modalMode === 'edit' ? 'Editar Rol' : 'Detalles del Rol'}
        subtitle={modalMode === 'create' ? 'Complete la información para registrar un nuevo rol' : modalMode === 'edit' ? 'Modifique la información del rol' : 'Información detallada del rol'}
        showActions={false}
        actionLabel={modalMode === 'create' ? 'Guardar' : 'Guardar Cambios'}
        onSave={handleSave}
        customStyles={{ 
          content: { 
            padding: '12px 16px',
            maxWidth: '400px',
            width: '100%',
          },
        }}
      >
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '10px', 
          padding: '0px',
        }}>
          {/* PRIMERA FILA: NOMBRE Y ESTADO UNO AL LADO DEL OTRO */}
          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            {/* NOMBRE DEL ROL */}
            <div style={{ flex: 2 }}>
              <label style={{ fontSize: '12px', color: '#e2e8f0', fontWeight: '500', marginBottom: '2px', display: 'block' }}>
                Nombre: {modalMode !== 'details' && <span style={{ color: '#ef4444' }}>*</span>}
              </label>
              {modalMode === 'details' ? (
                <div style={{
                  padding: '6px 10px', 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155', 
                  borderRadius: '4px',
                  color: '#F5C81B',
                  fontSize: '13px', 
                  minHeight: '32px', 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: '600'
                }}>
                  {selectedRole?.name}
                </div>
              ) : (
                <input
                  type="text"
                  value={currentRole.name}
                  placeholder="Ej: Vendedor"
                  onChange={(e) => {
                    setCurrentRole({ ...currentRole, name: e.target.value });
                    if (e.target.value.trim() && fieldErrors.name) {
                      setFieldErrors({ ...fieldErrors, name: false });
                    }
                  }}
                  style={{
                    width: '100%', 
                    padding: '6px 10px', 
                    borderRadius: '4px',
                    border: `1px solid ${fieldErrors.name ? '#ef4444' : '#334155'}`, 
                    backgroundColor: '#1e293b',
                    color: '#fff', 
                    fontSize: '12px', 
                    height: '32px', 
                    outline: 'none'
                  }}
                />
              )}
              {modalMode !== 'details' && fieldErrors.name && (
                <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                  El nombre del rol es obligatorio
                </span>
              )}
            </div>

            {/* ESTADO - SOLO EN DETALLES */}
            {modalMode === 'details' && (
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: '#e2e8f0', fontWeight: '500', marginBottom: '2px', display: 'block' }}>
                  Estado:
                </label>
                <div style={{
                  padding: '6px 10px', 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155', 
                  borderRadius: '4px',
                  color: selectedRole?.isActive ? '#10b981' : '#ef4444', 
                  fontSize: '13px', 
                  minHeight: '32px', 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: '600'
                }}>
                  {selectedRole?.isActive ? 'Activo' : 'Inactivo'}
                </div>
              </div>
            )}
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <label style={{ fontSize: '12px', color: '#e2e8f0', fontWeight: '500', marginBottom: '2px', display: 'block' }}>
              Descripción:
            </label>
            {modalMode === 'details' ? (
              <div style={{
                padding: '6px 10px', 
                backgroundColor: '#1e293b', 
                border: '1px solid #334155', 
                borderRadius: '4px',
                color: '#fff', 
                fontSize: '13px', 
                minHeight: '32px', 
                display: 'flex', 
                alignItems: 'center'
              }}>
                {selectedRole?.description || 'Sin descripción'}
              </div>
            ) : (
              <input
                type="text"
                value={currentRole.description || ""}
                placeholder="Breve descripción"
                onChange={(e) => setCurrentRole({ ...currentRole, description: e.target.value })}
                style={{
                  width: '100%', 
                  padding: '6px 10px', 
                  borderRadius: '4px',
                  border: '1px solid #334155', 
                  backgroundColor: '#1e293b',
                  color: '#fff', 
                  fontSize: '12px', 
                  height: '32px', 
                  outline: 'none'
                }}
              />
            )}
          </div>

          {/* PERMISOS */}
          <div>
            <label style={{ fontSize: '12px', color: '#ffffff', fontWeight: '600', marginBottom: '4px', display: 'block' }}>
              Permisos: {modalMode !== 'details' && <span style={{ color: '#ef4444' }}>*</span>}
            </label>
            
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'space-between',
              padding: '8px 0',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              minHeight: '140px',
            }}>
              {renderPermissionsColumns(
                modalMode === 'details' ? selectedRole?.permissions : currentRole.permissions,
                modalMode === 'details',
                modalMode === 'details' && isAdministrador(selectedRole)
              )}
            </div>
            
            {modalMode !== 'details' && fieldErrors.permissions && (
              <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                Debe seleccionar al menos un permiso
              </span>
            )}
            
            {modalMode === 'details' && isAdministrador(selectedRole) && (
              <div style={{
                marginTop: '10px',
                padding: '6px 10px',
                backgroundColor: 'rgba(245, 200, 27, 0.1)',
                border: '1px solid rgba(245, 200, 27, 0.3)',
                borderRadius: '4px',
                fontSize: '11px',
                color: '#F5C81B',
              }}>
                ⓘ El rol Administrador tiene todos los permisos del sistema.
              </div>
            )}
          </div>

          {/* BOTONES DE ACCIÓN */}
          {(modalMode === 'create' || modalMode === 'edit') && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: '8px',
              marginTop: '4px',
              paddingTop: '6px',
              borderTop: '1px solid #334155'
            }}>
              <button
                onClick={closeModal}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #94a3b8',
                  color: '#94a3b8',
                  padding: '6px 16px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  minWidth: '80px',
                  height: '30px',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  e.target.style.backgroundColor = '#94a3b8';
                  e.target.style.color = '#000';
                }}
                onMouseLeave={e => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#94a3b8';
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
                  padding: '6px 16px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  minWidth: '90px',
                  height: '30px',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  e.target.style.backgroundColor = '#ffd950';
                }}
                onMouseLeave={e => {
                  e.target.style.backgroundColor = '#F5C81B';
                }}
              >
                {modalMode === 'create' ? 'Guardar' : 'Guardar Cambios'}
              </button>
            </div>
          )}
        </div>
      </UniversalModal>

      {/* Confirmar eliminación */}
      <ConfirmDeleteModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        entityName="rol"
        entityData={roleToDelete}
      />
    </AdminLayoutClean>
  );
};

export default RolesPage;