// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Componentes
import Header from './components/Header';
import Alert from './components/Alert';

// Páginas públicas
import Home from './pages/Home';
import Ofertas from './pages/Ofertas';
import Categorias from './pages/Categorias';
import CategoriaDetalle from './pages/CategoriaDetalle';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import SearchResults from './pages/SearchResults';
import Productos from "./pages/Productos";

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategorias from './pages/admin/Categorias';
import ClientesPage from './pages/admin/ClientesPage';
import ProveedoresPage from './pages/admin/ProveedoresPage';
import ProductosPage from './pages/admin/Productos';
import DevolucionesPage from './pages/admin/DevolucionesPage';
import RolesPage from './pages/admin/RolesPage';
import UsersPage from './pages/admin/UsersPage';
import VentasPage from './pages/admin/VentasPage';
import ComprasPage from './pages/admin/ComprasPage';

// Context para el Alert global
export const AlertContext = React.createContext();

// Guards
const AdminRoute = ({ children, user, isLoading }) => {
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const ProtectedRoute = ({ children, user, isLoading }) => {
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AppContent = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'success-center',
  });

  const showAlert = (message, type = 'success-center') => {
    setAlert({ show: true, message, type });
  };

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Load cart
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch {
        localStorage.removeItem("cart");
      }
    }
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    showAlert('¡Inicio de sesión exitoso!', 'success-center');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    showAlert('Sesión cerrada correctamente', 'success-center');
  };

  const addToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.id === product.id);
      const updated = exists
        ? prev.map(i =>
            i.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        : [...prev, { ...product, quantity: 1 }];
      
      localStorage.setItem("cart", JSON.stringify(updated));

      showAlert(
        `${product.nombre || 'Producto'} agregado al carrito`,
        'add-record'
      );

      return updated;
    });
  };

  const showHeader =
    !['/login'].includes(location.pathname) &&
    !location.pathname.startsWith('/admin');

  if (isLoading)
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#fff" }}>
        Cargando…
      </div>
    );

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      
      {/* HEADER */}
      {showHeader && (
        <Header
          user={user}
          onLoginClick={() => (window.location.href = '/login')}
          onLogout={handleLogout}
          cartItemCount={cartItems.reduce((a, b) => a + b.quantity, 0)}
          cartItems={cartItems}
          updateCart={setCartItems}
        />
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main
        style={{
          width: "100%",
          margin: 0,
          minHeight: "calc(100vh - 64px)", // Resta la altura del header
          background: "transparent",
          position: "relative",
        }}
      >
        <Routes>
          {/* RUTAS PÚBLICAS */}
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />

          {/* RUTAS DE PRODUCTOS (CATÁLOGO) */}
          <Route path="/productos" element={<Productos />} />
          <Route path="/destacados" element={<Productos destacados={true} />} />
          <Route path="/mas-comprados" element={<Productos masComprados={true} />} />

          {/* OFERTAS */}
          <Route path="/ofertas" element={<Ofertas addToCart={addToCart} />} />

          {/* CATEGORÍAS */}
          <Route
            path="/categoria/:nombreCategoria"
            element={<CategoriaDetalle addToCart={addToCart} />}
          />

          {/* BÚSQUEDA */}
          <Route path="/search" element={<SearchResults addToCart={addToCart} />} />

          {/* CARRITO */}
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                updateCart={setCartItems}
                user={user}
              />
            }
          />

          {/* PERFIL */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user} isLoading={isLoading}>
                <Profile user={user} />
              </ProtectedRoute>
            }
          />

          {/* ADMIN */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute user={user} isLoading={isLoading}>
                <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
                  <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="categories" element={<AdminCategorias />} />
                    <Route path="products" element={<ProductosPage />} />
                    <Route path="customers" element={<ClientesPage />} />
                    <Route path="suppliers" element={<ProveedoresPage />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="roles" element={<RolesPage />} />
                    <Route path="sales" element={<VentasPage />} />
                    <Route path="orders" element={<ComprasPage />} />
                    <Route path="returns" element={<DevolucionesPage />} />
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                  </Routes>
                </div>
              </AdminRoute>
            }
          />

          {/* DEFAULT */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* ALERT GLOBAL */}
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={hideAlert}
        />
      )}

    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = React.useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert debe usarse dentro de AlertContext.Provider');
  }
  return context;
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}