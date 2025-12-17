// src/pages/admin/AdminLayoutClean.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { sidebarItems } from "../../data";

const AdminLayoutClean = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowUserMenu(false);
    navigate('/login');
  };

  return (
    <div
      style={{
        backgroundColor: "#000000",
        minHeight: "100vh",
        display: "flex",
        fontFamily: "Segoe UI, system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: "205px", // 🔴 Un poquito más grande (200px → 205px)
          background: "#000000",
          padding: "14px 10px 10px 10px", // 🔴 Un poco más de padding
          display: "flex",
          flexDirection: "column",
          gap: "4px", // 🔴 Un poco más de espacio
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          overflow: "hidden",
          boxShadow: "2px 0 8px rgba(0,0,0,0.5)",
          borderRight: "1px solid rgba(245, 200, 27, 0.15)",
          zIndex: 10,
        }}
      >
        {/* TÍTULO */}
        <div style={{ 
          marginBottom: "14px", // 🔴 Un poco más de margen
          padding: "0 8px" 
        }}>
          <h2
            style={{
              color: "#F5C81B",
              fontSize: "1.05rem", // 🔴 Un poquito más grande
              fontWeight: "800",
              margin: "0",
              lineHeight: "1.2",
              paddingBottom: "4px",
            }}
          >
            Administración
          </h2>
        </div>

        {/* MENÚ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px", // 🔴 Un poco más de espacio
            flex: 1,
            overflow: "hidden",
          }}
        >
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === `/admin/${item.id}` ||
              (item.id === "dashboard" && location.pathname === "/admin");

            return (
              <Link
                key={item.id}
                to={item.id === "dashboard" ? "/admin" : `/admin/${item.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px", // 🔴 Un poco más de espacio
                  padding: "9px 12px", // 🔴 Un poco más de padding
                  borderRadius: "7px",
                  textDecoration: "none",
                  fontSize: "13.5px", // 🔴 Un poquito más grande
                  fontWeight: "600",
                  backgroundColor: isActive ? "rgba(245, 200, 27, 0.1)" : "transparent",
                  
                  border: isActive
                    ? "1px solid rgba(245, 200, 27, 0.4)"
                    : "1px solid transparent",
                  transition: "all 0.2s ease",
                  height: "38px", // 🔴 Un poco más alto
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "rgba(245, 200, 27, 0.05)";
                    e.currentTarget.style.color = "#F5C81B";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#CDCCC9";
                  }
                }}
              >
                <Icon size={14.5} color={isActive ? "#ffffff" : "#F5C81B"} /> {/* 🔴 Un poco más grande */}
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* MUÑEQUITO ADMIN - Un poco más grande */}
        {user && user.role === 'admin' && (
          <div
            style={{
              marginTop: "auto",
              position: "relative",
              paddingTop: "16px", // 🔴 Un poco más
              borderTop: "1px solid rgba(245, 200, 27, 0.15)"
            }}
            ref={menuRef}
          >
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px", // 🔴 Un poco más
                width: "100%",
                padding: "11px", // 🔴 Un poco más
                backgroundColor: "transparent",
                border: "1px solid rgba(245, 200, 27, 0.3)",
                borderRadius: "7px",
                cursor: "pointer",
                color: "#F5C81B",
                fontWeight: "600",
                fontSize: "12.5px", // 🔴 Un poquito más grande
                transition: "all 0.2s ease",
                height: "50px", // 🔴 Un poco más alto
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(245, 200, 27, 0.1)";
              }}
              onMouseLeave={(e) => {
                if (!showUserMenu) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <div
                style={{
                  width: "30px", // 🔴 Un poco más grande
                  height: "30px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(245, 200, 27, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(245, 200, 27, 0.4)",
                  flexShrink: 0,
                }}
              >
                <FaUser size={14} color="#F5C81B" /> {/* 🔴 Un poco más grande */}
              </div>

              <div
                style={{
                  flex: 1,
                  textAlign: "left",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  lineHeight: "1.3",
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "12.5px", // 🔴 Un poquito más grande
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user.name || "Admin"}
                </span>

                <span
                  style={{
                    display: "block",
                    fontSize: "10.5px", // 🔴 Un poquito más grande
                    color: "#888",
                    marginTop: "2px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user.email || "admin@gmail.com"}
                </span>
              </div>
            </button>

            {/* MENÚ DESPLEGABLE - Un poco más grande */}
            {showUserMenu && (
              <div
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 8px)",
                  left: 0,
                  right: 0,
                  backgroundColor: "#111",
                  border: "1px solid rgba(245, 200, 27, 0.4)",
                  borderRadius: "7px",
                  padding: "11px", // 🔴 Un poco más
                  zIndex: 100,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
                }}
              >
                <div
                  style={{
                    paddingBottom: "9px", // 🔴 Un poco más
                    borderBottom: "1px solid rgba(245, 200, 27, 0.2)",
                    marginBottom: "9px", // 🔴 Un poco más
                  }}
                >
                  <p
                    style={{
                      color: "#F5C81B",
                      fontSize: "12.5px", // 🔴 Un poquito más grande
                      fontWeight: "600",
                      margin: "0 0 6px 0", // 🔴 Un poco más
                    }}
                  >
                    {user.name || "Administrador"}
                  </p>
                  <p
                    style={{
                      color: "#888",
                      fontSize: "10.5px", // 🔴 Un poquito más grande
                      margin: "0",
                    }}
                  >
                    {user.email || "admin@gmail.com"}
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}> {/* 🔴 Un poco más */}
                  <button
                    onClick={handleLogout}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px", // 🔴 Un poco más
                      width: "100%",
                      padding: "8px 11px", // 🔴 Un poco más
                      backgroundColor: "transparent",
                      border: "1px solid #ef4444",
                      borderRadius: "5px",
                      cursor: "pointer",
                      color: "#ef4444",
                      fontSize: "11.5px", // 🔴 Un poquito más grande
                      fontWeight: "600",
                      textAlign: "left",
                      transition: "all 0.2s ease",
                      height: "34px", // 🔴 Un poco más alto
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <FaSignOutAlt size={12} /> {/* 🔴 Un poco más grande */}
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* LÍNEA */}
      <div
        style={{
          position: "fixed",
          left: "205px", // 🔴 Ajustado
          top: 0,
          bottom: 0,
          width: "3px",
          background: "#F5C81B",
          zIndex: 5,
          pointerEvents: "none",
        }}
      />

      {/* SOMBRA */}
      <div
        style={{
          position: "fixed",
          left: "208px", // 🔴 Ajustado
          top: 0,
          bottom: 0,
          width: "5px",
          background: "linear-gradient(to right, rgba(0, 0, 0, 0.3) 0%, transparent 100%)",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />

      {/* CONTENIDO */}
      <div
        style={{
          marginLeft: "215px", // 🔴 Ajustado
          padding: "19px", // 🔴 Un poco más
          width: "calc(100% - 215px)", // 🔴 Ajustado
          height: "100vh",
          backgroundColor: "#000000",
          color: "#ffffff",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "0",
            top: 0,
            bottom: 0,
            width: "1px",
            background: "rgba(245, 200, 27, 0.2)",
            pointerEvents: "none",
          }}
        />

        {children}
      </div>
    </div>
  );
};

export default AdminLayoutClean;