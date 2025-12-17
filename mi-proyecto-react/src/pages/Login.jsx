import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope, FaLock, FaUser, FaCheckCircle } from 'react-icons/fa';

// 👇 Credenciales del admin quemadas
const VALID_EMAIL = 'duvann1991@gmail.com';
const VALID_PASSWORD = 'Gorrasmedellin_caps';

const Login = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [currentView, setCurrentView] = useState('login'); // 'login', 'forgot', 'reset', 'email-sent'
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetData, setResetData] = useState({ password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // === LOGIN ===
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    let userData;

    if (loginData.email === VALID_EMAIL && loginData.password === VALID_PASSWORD) {
      // 🔹 Usuario admin
      userData = {
        email: VALID_EMAIL,
        role: 'admin',
        name: 'Administrador',
      };
    } else {
      // 🔹 Usuario cliente normal
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.email === loginData.email && parsed.password === loginData.password) {
          userData = parsed;
        }
      }
    }

    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      if (onLogin) onLogin(userData);

      // 👇 Redirección según rol
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError('Email o contraseña incorrectos');
    }
  };

  // === REGISTRO ===
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const userData = {
      email: registerData.email,
      name: registerData.name,
      password: registerData.password,
      role: 'user',
    };

    localStorage.setItem('user', JSON.stringify(userData));
    if (onLogin) onLogin(userData);
    navigate('/');
  };

  // === OLVIDÉ CONTRASEÑA ===
  const handleForgotPassword = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    // Simular verificación de email
    setTimeout(() => {
      // Verificar si el email existe en localStorage
      const storedUser = localStorage.getItem('user');
      let userExists = false;
      
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.email === forgotEmail) {
          userExists = true;
        }
      }

      // También verificar el admin
      if (forgotEmail === VALID_EMAIL) {
        userExists = true;
      }

      if (userExists) {
        // Simular envío de email
        setMessage(`Hemos enviado un enlace de recuperación a: ${forgotEmail}`);
        
        // Guardar token de recuperación simulado en localStorage
        const resetToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
        const resetData = {
          email: forgotEmail,
          token: resetToken,
          expires: Date.now() + 3600000 // 1 hora
        };
        localStorage.setItem('passwordResetToken', JSON.stringify(resetData));
        
        setCurrentView('email-sent');
      } else {
        setError('No encontramos una cuenta asociada a este email');
      }
      
      setIsLoading(false);
    }, 1500);
  };

  // === RESET PASSWORD ===
  const handleResetPassword = (e) => {
    e.preventDefault();
    
    if (resetData.password !== resetData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (resetData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simular proceso de reset
    setTimeout(() => {
      const resetTokenData = localStorage.getItem('passwordResetToken');
      
      if (!resetTokenData) {
        setError('Token de recuperación inválido o expirado');
        setIsLoading(false);
        return;
      }

      const { email, expires } = JSON.parse(resetTokenData);
      
      if (Date.now() > expires) {
        setError('El enlace de recuperación ha expirado');
        localStorage.removeItem('passwordResetToken');
        setIsLoading(false);
        return;
      }

      // No permitir cambiar contraseña del admin
      if (email === VALID_EMAIL) {
        setError('No es posible cambiar la contraseña de administrador desde esta función');
        setIsLoading(false);
        return;
      }

      // Actualizar contraseña en localStorage para usuarios normales
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.email === email) {
          // Actualizar usuario normal
          user.password = resetData.password;
          localStorage.setItem('user', JSON.stringify(user));
        }
      }

      // Limpiar token
      localStorage.removeItem('passwordResetToken');
      
      setMessage('Contraseña actualizada correctamente');
      setIsLoading(false);

      // Redirigir después de 2 segundos
      setTimeout(() => {
        setCurrentView('login');
        setResetData({ password: '', confirmPassword: '' });
      }, 2000);
    }, 1500);
  };

  // === VISTA LOGIN PRINCIPAL ===
  const renderLoginView = () => (
    <div
      style={{
        backgroundColor: '#7f7c7cff',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Link
        to="/"
        style={{
          position: 'absolute',
          left: '20px',
          top: '20px',
          color: '#FFC107',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <FaArrowLeft size={14} /> Volver a la tienda
      </Link>

      <div
        style={{
          backgroundColor: '#121212',
          padding: '25px',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 4px 20px rgba(239, 181, 9, 0.5)',
          border: '1px solid #333',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#FFC107', fontSize: '20px', margin: '0' }}>GM CAPS</h2>
          <p style={{ color: '#ccc', fontSize: '14px', margin: '10px 0 0 0' }}>
            Bienvenido<br />Tu tienda de gorras favorita
          </p>
        </div>

        {/* === TABS === */}
        <div
          style={{
            display: 'flex',
            gap: '5px',
            marginBottom: '20px',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#2f4c5bff',
          }}
        >
          <button
            onClick={() => setActiveTab('login')}
            style={{
              flex: 1,
              padding: '8px 12px',
              backgroundColor: activeTab === 'login' ? '#FFC107' : 'transparent',
              color: activeTab === 'login' ? '#000' : 'white',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setActiveTab('register')}
            style={{
              flex: 1,
              padding: '8px 12px',
              backgroundColor: activeTab === 'register' ? '#FFC107' : 'transparent',
              color: activeTab === 'register' ? '#000' : 'white',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Registrarse
          </button>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#331a1a',
              color: '#f83d3dff',
              padding: '8px',
              borderRadius: '6px',
              marginBottom: '15px',
              fontSize: '12px',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        {message && (
          <div
            style={{
              backgroundColor: '#1a331a',
              color: '#4CAF50',
              padding: '8px',
              borderRadius: '6px',
              marginBottom: '15px',
              fontSize: '12px',
              textAlign: 'center',
            }}
          >
            {message}
          </div>
        )}

        {/* === FORM LOGIN === */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#ddd', fontSize: '12px' }}>
                <FaEnvelope style={{ marginRight: '6px' }} /> Email
              </label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                placeholder="admin@gmail.com"
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  backgroundColor: '#2f424dff',
                  border: '1px solid #948f8fff',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#ddd', fontSize: '12px' }}>
                <FaLock style={{ marginRight: '6px' }} /> Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="123456"
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  backgroundColor: '#2f424dff',
                  border: '1px solid #c1babaff',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                fontWeight: 'bold',
                borderRadius: '6px',
                backgroundColor: '#FFC107',
                color: '#000',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Iniciar Sesión
            </button>

            {/* === ENLACE OLVIDÉ CONTRASEÑA === */}
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <button
                type="button"
                onClick={() => setCurrentView('forgot')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFC107',
                  fontSize: '14px',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </form>
        )}

        {/* === FORM REGISTRO === */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#ddd', fontSize: '12px' }}>
                <FaUser style={{ marginRight: '6px' }} /> Nombre Completo
              </label>
              <input
                type="text"
                name="name"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                placeholder="Juan Pérez"
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  backgroundColor: '#1E1E1E',
                  border: '1px solid #333',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#ddd', fontSize: '12px' }}>
                <FaEnvelope style={{ marginRight: '6px' }} /> Email
              </label>
              <input
                type="email"
                name="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                placeholder="tu@email.com"
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  backgroundColor: '#1E1E1E',
                  border: '1px solid #333',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#ddd', fontSize: '12px' }}>
                <FaLock style={{ marginRight: '6px' }} /> Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  backgroundColor: '#1E1E1E',
                  border: '1px solid #333',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#ddd', fontSize: '12px' }}>
                <FaLock style={{ marginRight: '6px' }} /> Confirmar Contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  backgroundColor: '#1E1E1E',
                  border: '1px solid #333',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                fontWeight: 'bold',
                borderRadius: '6px',
                backgroundColor: '#FFC107',
                color: '#000',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Crear Cuenta
            </button>
          </form>
        )}
      </div>
    </div>
  );

  // === VISTA OLVIDÉ CONTRASEÑA ===
  const renderForgotPasswordView = () => (
    <div style={{
      backgroundColor: '#7f7c7cff',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <button
        onClick={() => setCurrentView('login')}
        style={{
          position: 'absolute',
          left: '20px',
          top: '20px',
          color: '#FFC107',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <FaArrowLeft size={14} /> Volver al login
      </button>

      <div style={{
        backgroundColor: '#121212',
        padding: '25px',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 20px rgba(239, 181, 9, 0.5)',
        border: '1px solid #333',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#FFC107', fontSize: '20px', margin: '0' }}>GM CAPS</h2>
          <p style={{ color: '#ccc', fontSize: '14px', margin: '10px 0 0 0' }}>
            Recuperar Contraseña
          </p>
          <p style={{ color: '#aaa', fontSize: '12px', margin: '10px 0' }}>
            Te enviaremos un enlace para restablecer tu contraseña
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#331a1a',
            color: '#f83d3dff',
            padding: '8px',
            borderRadius: '6px',
            marginBottom: '15px',
            fontSize: '12px',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{
            backgroundColor: '#1a331a',
            color: '#4CAF50',
            padding: '8px',
            borderRadius: '6px',
            marginBottom: '15px',
            fontSize: '12px',
            textAlign: 'center',
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleForgotPassword}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#ddd', fontSize: '12px' }}>
              <FaEnvelope style={{ marginRight: '6px' }} /> Email
            </label>
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="admin@gmail.com"
              required
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                backgroundColor: '#2f424dff',
                border: '1px solid #948f8fff',
                color: 'white',
                fontSize: '14px',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              fontWeight: 'bold',
              borderRadius: '6px',
              backgroundColor: '#FFC107',
              color: '#000',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              marginBottom: '10px',
            }}
          >
            {isLoading ? 'Enviando...' : 'Enviar Email'}
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('login')}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              color: '#FFC107',
              fontSize: '14px',
              textDecoration: 'none',
              padding: '8px',
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );

  // === VISTA EMAIL ENVIADO ===
  const renderEmailSentView = () => (
    <div style={{
      backgroundColor: '#7f7c7cff',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <button
        onClick={() => setCurrentView('login')}
        style={{
          position: 'absolute',
          left: '20px',
          top: '20px',
          color: '#FFC107',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <FaArrowLeft size={14} /> Volver al login
      </button>

      <div style={{
        backgroundColor: '#121212',
        padding: '30px',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 4px 20px rgba(239, 181, 9, 0.5)',
        border: '1px solid #333',
        textAlign: 'center',
      }}>
        <div style={{ marginBottom: '20px' }}>
          <FaCheckCircle size={40} color="#4CAF50" />
        </div>
        
        <h2 style={{ color: '#FFC107', fontSize: '20px', margin: '0 0 10px 0' }}>GM CAPS</h2>
        <h3 style={{ color: '#4CAF50', fontSize: '18px', margin: '0 0 20px 0' }}>Email Enviado</h3>
        
        <p style={{ color: '#ccc', fontSize: '14px', marginBottom: '10px' }}>
          Revisa tu bandeja de entrada
        </p>
        
        <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '20px' }}>
          Hemos enviado un enlace de recuperación a:
        </p>
        
        <p style={{ 
          color: '#FFC107', 
          fontSize: '14px', 
          fontWeight: 'bold',
          marginBottom: '25px',
          padding: '10px',
          backgroundColor: '#2f424dff',
          borderRadius: '6px'
        }}>
          {forgotEmail}
        </p>
        
        <p style={{ color: '#888', fontSize: '12px', marginBottom: '25px' }}>
          ⚠️ Este es un sistema de demostración. En una aplicación real, recibirías un email con un enlace para restablecer tu contraseña.
        </p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={() => setCurrentView('reset')}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 'bold',
              borderRadius: '6px',
              backgroundColor: '#FFC107',
              color: '#000',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Continuar con la recuperación
          </button>
        </div>

        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => setCurrentView('login')}
            style={{
              background: 'none',
              border: 'none',
              color: '#FFC107',
              fontSize: '14px',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            Volver al Login
          </button>
        </div>
      </div>
    </div>
  );

  // === VISTA RESET PASSWORD ===
  const renderResetPasswordView = () => (
    <div style={{
      backgroundColor: '#7f7c7cff',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <button
        onClick={() => setCurrentView('login')}
        style={{
          position: 'absolute',
          left: '20px',
          top: '20px',
          color: '#FFC107',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <FaArrowLeft size={14} /> Volver al login
      </button>

      <div style={{
        backgroundColor: '#121212',
        padding: '25px',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 20px rgba(239, 181, 9, 0.5)',
        border: '1px solid #333',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#FFC107', fontSize: '20px', margin: '0' }}>GM CAPS</h2>
          <p style={{ color: '#ccc', fontSize: '14px', margin: '10px 0 0 0' }}>
            Restablecer Contraseña
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#331a1a',
            color: '#f83d3dff',
            padding: '8px',
            borderRadius: '6px',
            marginBottom: '15px',
            fontSize: '12px',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{
            backgroundColor: '#1a331a',
            color: '#4CAF50',
            padding: '8px',
            borderRadius: '6px',
            marginBottom: '15px',
            fontSize: '12px',
            textAlign: 'center',
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleResetPassword}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#ddd', fontSize: '12px' }}>
              <FaLock style={{ marginRight: '6px' }} /> Nueva Contraseña
            </label>
            <input
              type="password"
              value={resetData.password}
              onChange={(e) => setResetData({ ...resetData, password: e.target.value })}
              placeholder="Mínimo 6 caracteres"
              required
              minLength="6"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                backgroundColor: '#2f424dff',
                border: '1px solid #948f8fff',
                color: 'white',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#ddd', fontSize: '12px' }}>
              <FaLock style={{ marginRight: '6px' }} /> Confirmar Contraseña
            </label>
            <input
              type="password"
              value={resetData.confirmPassword}
              onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
              placeholder="Repite tu contraseña"
              required
              minLength="6"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                backgroundColor: '#2f424dff',
                border: '1px solid #948f8fff',
                color: 'white',
                fontSize: '14px',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              fontWeight: 'bold',
              borderRadius: '6px',
              backgroundColor: '#FFC107',
              color: '#000',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? 'Actualizando...' : 'Restablecer Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );

  // === RENDER PRINCIPAL ===
  switch (currentView) {
    case 'forgot':
      return renderForgotPasswordView();
    case 'email-sent':
      return renderEmailSentView();
    case 'reset':
      return renderResetPasswordView();
    default:
      return renderLoginView();
  }
};

export default Login;