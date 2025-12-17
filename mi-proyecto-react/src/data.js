// src/data.js
import { BarChart3, Users, ShoppingBag, Package, Truck, Shield, RefreshCcw, TrendingUp, UserCheck, Tags } from 'lucide-react';

// =================================================================
// CONFIGURACIÓN Y OPCIONES
// =================================================================

// Permisos del Sistema
export const availablePermissions = [
  { id: 'ventas', label: 'Ventas' },
  { id: 'devoluciones', label: 'Devoluciones'},
  { id: 'productos', label: 'Productos' },
  { id: 'proveedores', label: 'Proveedores'},
  { id: 'usuarios', label: 'Usuarios' },
  { id: 'clientes', label: 'Clientes'},
  { id: 'compras', label: 'Compras' },
  { id: 'categorias', label: 'categorias' },
  { id: 'roles', label: 'Roles', description: 'Registrar y ver Rolesdel sistema' }
];

// Opciones de Talla (Para Gorras)
export const initialSizes = [
  { value: 'Ajustable', label: 'Ajustable' },
  { value: '6 7/8', label: '6 7/8' },
  { value: '7', label: '7' },
  { value: '7 1/8', label: '7 1/8' },
  { value: '7 1/4', label: '7 1/4' },
  { value: '7 3/8', label: '7 3/8' },
  { value: '7 1/2', label: '7 1/2' },
  { value: '7 5/8', label: '7 5/8' },
  { value: '7 3/4', label: '7 3/4' },
  { value: '7 7/8', label: '7 7/8' },
  { value: '8', label: '8' },
  { value: 'Única', label: 'Única' },
];

// Opciones de Color (Para Gorras)
export const initialColors = [
  { value: 'Negro', label: 'Negro' },
  { value: 'Blanco', label: 'Blanco' },
  { value: 'Azul', label: 'Azul' },
  { value: 'Rojo', label: 'Rojo' },
  { value: 'Verde', label: 'Verde' },
  { value: 'Amarillo', label: 'Amarillo' },
  { value: 'Gris', label: 'Gris' },
  { value: 'Naranja', label: 'Naranja' },
  { value: 'Morado', label: 'Morado' },
  { value: 'Rosa', label: 'Rosa' },
  { value: 'Marrón', label: 'Marrón' },
  { value: 'Beige', label: 'Beige' },
  { value: 'Gris', label: 'Gris' },
  { value: 'Negro', label: 'Negro' },
  { value: 'Azul Noche', label: 'Azul' },
  { value: 'Blanco Roto', label: 'Blanco' },
  { value: 'Verde Militar', label: 'Verde' },
  { value: 'Negro Diamante', label: 'Negro' },
  { value: 'Rosa Pastel', label: 'Rosa' },
  { value: 'Caqui', label: 'Caqui' },
  { value: 'Azul Real', label: 'Azul' },
  { value: 'Negro con Oro', label: 'Negro' },
  { value: 'Beige Natural', label: 'Beige' },
  { value: 'Gris Perla', label: 'Gris' },
  { value: 'Variado', label: 'Variado' },
  { value: 'Borgoña', label: 'Borgoña' },
  { value: 'Natural', label: 'Natural' },
  { value: 'Negro/Plata', label: 'Negro' },
];

// Items del Sidebar (Menú de Navegación)
export const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'categories', label: 'Categorías', icon: Tags },
  { id: 'products', label: 'Productos', icon: Package },
  { id: 'suppliers', label: 'Proveedores', icon: Truck },
   { id: 'orders', label: 'Compras', icon: ShoppingBag },
  { id: 'customers', label: 'Clientes', icon: UserCheck },
  { id: 'sales', label: 'Ventas', icon: TrendingUp },
  { id: 'returns', label: 'Devoluciones', icon: RefreshCcw },
  { id: 'roles', label: 'Roles', icon: Shield },
  { id: 'users', label: 'Usuarios', icon: Users },
];

// =================================================================
// DATOS TRANSACCIONALES
// =================================================================

// Roles
export const initialRoles = [
  {
    IdRol: 1,
    Nombre: "Administrador",
    Descripcion: "Acceso completo al sistema",
    Permisos: ["usuarios", "clientes", "proveedores", "productos", "compras", "devoluciones", "ventas"],
    Estado: true
  },
  {
    IdRol: 2,
    Nombre: "Vendedor",
    Descripcion: "Gestión de ventas y atención al cliente",
    Permisos: ["ventas", "devoluciones"],
    Estado: true
  },
  {
    IdRol: 3,
    Nombre: "Gestor de Inventario",
    Descripcion: "Gestión de productos y proveedores",
    Permisos: ["productos", "proveedores"],
    Estado: true
  },
  {
    IdRol: 4,
    Nombre: "Recursos Humanos",
    Descripcion: "Gestión de usuarios del sistema",
    Permisos: ["usuarios"],
    Estado: true
  },
  {
    IdRol: 5,
    Nombre: "Gestor de Clientes",
    Descripcion: "Gestión de información y estado de clientes",
    Permisos: ["clientes"],
    Estado: true
  },
  {
    IdRol: 6,
    Nombre: "Auditor",
    Descripcion: "Solo lectura de reportes y movimientos",
    Permisos: ["reportes", "auditoria"],
    Estado: false
  }
];

// Usuarios
export const initialUsers = [
  { IdUsuario: 1,  Nombre: "Andrés Guzmán",  Correo: "andres.guzman23@gmail.com",   Clave: "$2a$10$abc123...", Estado: true,  IdRol: 1 },
  { IdUsuario: 2,  Nombre: "Imanol López",  Correo: "imanol.lopez@gmail.com",      Clave: "$2a$10$def456...", Estado: true,  IdRol: 2 },
  { IdUsuario: 4,  Nombre: "Sebastián Torres", Correo: "sebastorres053@gmail.com", Clave: "$2a$10$jkl012...", Estado: true,  IdRol: 2 },
  { IdUsuario: 5,  Nombre: "Carolina Méndez",  Correo: "caro.mendez@inventario.co", Clave: "$2a$10$mno345...", Estado: true,  IdRol: 3 },
  { IdUsuario: 6,  Nombre: "Diana Ríos",    Correo: "diana.rios@rh.local",        Clave: "$2a$10$pqr678...", Estado: true,  IdRol: 4 },
  { IdUsuario: 7,  Nombre: "Felipe Vargas", Correo: "felipe.vargas@ventas.co",    Clave: "$2a$10$stu901...", Estado: false, IdRol: 2 },
  { IdUsuario: 8,  Nombre: "Lucía Herrera", Correo: "lucia.herrera@clientes.co",  Clave: "$2a$10$vwx234...", Estado: true,  IdRol: 5 },
  { IdUsuario: 9,  Nombre: "Mateo Ruiz",    Correo: "mateo.ruiz@inventario.co",   Clave: "$2a$10$yza567...", Estado: true,  IdRol: 3 },
  { IdUsuario: 10, Nombre: "Valeria Castro", Correo: "vale.castro@ventas.co",     Clave: "$2a$10$bcd890...", Estado: true,  IdRol: 2 },
  { IdUsuario: 11, Nombre: "Jorge Ortega",  Correo: "jorge.ortega@rh.local",      Clave: "$2a$10$efg123...", Estado: false, IdRol: 4 },
  { IdUsuario: 12, Nombre: "Natalia Silva", Correo: "natalia.silva@clientes.co",  Clave: "$2a$10$hij456...", Estado: true,  IdRol: 5 }
];

// Clientes
export const initialCustomers = [
  {
    Nombre: "Imanol López",
    Telefono: "3124567890",
    Correo: "imanol.lopez@gmail.com",
    Departamento: "Antioquia",
    Ciudad: "Medellín",
    Direccion: "Calle 45 #23-10",
    SaldoaFavor: "150000",
    Estado: true
  },
  {
    Nombre: "Sebastián Torres",
    Telefono: "3109876543",
    Correo: "sebastorres053@gmail.com",
    Departamento: "Cundinamarca",
    Ciudad: "Bogotá",
    Direccion: "Carrera 10 #15-30",
    SaldoaFavor: "0",
    Estado: true
  },
  {
    Nombre: "María González",
    Telefono: "3012589634",
    Correo: "maria.gonzalez@hotmail.com",
    Departamento: "Valle del Cauca",
    Ciudad: "Cali",
    Direccion: "Avenida 3N #45-20",
    SaldoaFavor: "45000",
    Estado: true
  },
  {
    Nombre: "Carlos Ramírez",
    Telefono: "3201122334",
    Correo: "carlos.ramirez78@outlook.com",
    Departamento: "Santander",
    Ciudad: "Bucaramanga",
    Direccion: "Calle 32 #18-45",
    SaldoaFavor: "32000",
    Estado: true
  },
  {
    Nombre: "Ana María Vélez",
    Telefono: "3156789012",
    Correo: "anavelez22@gmail.com",
    Departamento: "Atlántico",
    Ciudad: "Barranquilla",
    Direccion: "Carrera 53 #78-12",
    SaldoaFavor: "0",
    Estado: false
  },
  {
    Nombre: "Jorge Eliécer Duque",
    Telefono: "3112345678",
    Correo: "jorge.duque@empresa.co",
    Departamento: "Antioquia",
    Ciudad: "Envigado",
    Direccion: "Calle 10 Sur #44-67",
    SaldoaFavor: "210500",
    Estado: true
  },
  {
    Nombre: "Lucía Fernández",
    Telefono: "3009871234",
    Correo: "luciafdez_91@yahoo.com",
    Departamento: "Cundinamarca",
    Ciudad: "Chía",
    Direccion: "Vereda La Florida, Km 2",
    SaldoaFavor: "18900",
    Estado: true
  },
  {
    Nombre: "Diego Armando Rojas",
    Telefono: "3223456789",
    Correo: "diego.rojas87@gmail.com",
    Departamento: "Risaralda",
    Ciudad: "Pereira",
    Direccion: "Carrera 14 #30-05",
    SaldoaFavor: "0",
    Estado: true
  },
  {
    Nombre: "Valentina Castro",
    Telefono: "3187654321",
    Correo: "vale.castro1995@hotmail.com",
    Departamento: "Bolívar",
    Ciudad: "Cartagena",
    Direccion: "Calle del Espíritu Santo #32-18",
    SaldoaFavor: "76400",
    Estado: true
  },
  {
    Nombre: "Fernando Pardo",
    Telefono: "3134567890",
    Correo: "fpardo_negocios@gmail.com",
    Departamento: "Norte de Santander",
    Ciudad: "Cúcuta",
    Direccion: "Avenida 5 #22-88, Edificio Central, Of. 302",
    SaldoaFavor: "0",
    Estado: false
  }
];

// Proveedores
export const initialSuppliers = [
  { IdProveedor: 1,  Nombre: "Distribuidora ABC",             TipoDocumento: "NIT", NumeroDocumento: "900123456-7", Telefono: "+57 300 123 4567", Direccion: "Calle 10 #23-45, Medellín",       Correo: "ventas@abc.com.co",              Estado: true },
  { IdProveedor: 2,  Nombre: "Importaciones XYZ",             TipoDocumento: "NIT", NumeroDocumento: "900234567-8", Telefono: "+57 301 234 5678", Direccion: "Av. Las Vegas #78-12, Medellín",  Correo: "contacto@xyzimport.com",         Estado: true },
  { IdProveedor: 3,  Nombre: "Gorras del Valle",              TipoDocumento: "NIT", NumeroDocumento: "900345678-9", Telefono: "+57 302 345 6789", Direccion: "Calle 56 #34-21, Cali",            Correo: "info@gorrasvalle.com",           Estado: false },
  { IdProveedor: 4,  Nombre: "Textiles Norte",                TipoDocumento: "NIT", NumeroDocumento: "900456789-0", Telefono: "+57 303 456 7890", Direccion: "Av. Boyacá #45-67, Bogotá",       Correo: "pedidos@textilesnorte.com",      Estado: true },
  { IdProveedor: 5,  Nombre: "Alimentos Andinos S.A.",        TipoDocumento: "NIT", NumeroDocumento: "901234567-1", Telefono: "+57 310 567 8901", Direccion: "Carrera 45 #90-23, Medellín",     Correo: "ventas@alimentosandinos.co",     Estado: true },
  { IdProveedor: 6,  Nombre: "Electrónicos del Futuro",       TipoDocumento: "NIT", NumeroDocumento: "902345678-2", Telefono: "+57 311 678 9012", Direccion: "Calle 78 #12-34, Envigado",       Correo: "soporte@electronicosfuturo.com", Estado: true },
  { IdProveedor: 7,  Nombre: "Papelería Creativa Ltda.",      TipoDocumento: "NIT", NumeroDocumento: "903456789-3", Telefono: "+57 312 789 0123", Direccion: "Carrera 30 #56-78, Itagüí",       Correo: "pedidos@papeleriacreativa.com",  Estado: true },
  { IdProveedor: 8,  Nombre: "Confecciones Antioquia",        TipoDocumento: "NIT", NumeroDocumento: "904567890-4", Telefono: "+57 313 890 1234", Direccion: "Av. Oriental #23-45, Medellín",   Correo: "produccion@confeccionesantioquia.com", Estado: false },
  { IdProveedor: 9,  Nombre: "Empaques EcoSostenibles",       TipoDocumento: "NIT", NumeroDocumento: "905678901-5", Telefono: "+57 314 901 2345", Direccion: "Calle 120 #45-67, Sabaneta",      Correo: "info@empaqueseco.co",            Estado: true },
  { IdProveedor: 10, Nombre: "Ferretería La Estrella",        TipoDocumento: "NIT", NumeroDocumento: "906789012-6", Telefono: "+57 315 012 3456", Direccion: "Carrera 52 #89-01, Medellín",     Correo: "ventas@ferreterialaestrella.com", Estado: true },
  { IdProveedor: 11, Nombre: "Dulces Regionales SAS",         TipoDocumento: "NIT", NumeroDocumento: "907890123-7", Telefono: "+57 316 123 4567", Direccion: "Calle 65 #22-11, Bello",          Correo: "distribucion@dulcesregionales.co", Estado: true },
  { IdProveedor: 12, Nombre: "Muebles Artesanales",           TipoDocumento: "NIT", NumeroDocumento: "908901234-8", Telefono: "+57 317 234 5678", Direccion: "Vereda El Porvenir, La Ceja",     Correo: "contacto@mueblesartesanales.com", Estado: false },
  { IdProveedor: 13, Nombre: "Cosméticos Naturales",          TipoDocumento: "NIT", NumeroDocumento: "909012345-9", Telefono: "+57 318 345 6789", Direccion: "Carrera 70 #34-56, Medellín",     Correo: "ventas@cosmeticosnaturales.co",  Estado: true },
  { IdProveedor: 14, Nombre: "Herramientas Profesionales",    TipoDocumento: "NIT", NumeroDocumento: "900123457-0", Telefono: "+57 319 456 7890", Direccion: "Av. 80 #67-89, Medellín",         Correo: "soporte@herramientaspro.com",    Estado: true },
  { IdProveedor: 15, Nombre: "Café Premium Antioqueño",       TipoDocumento: "NIT", NumeroDocumento: "901234568-1", Telefono: "+57 320 567 8901", Direccion: "Finca El Roble, Fredonia",        Correo: "export@cafepremium.co",          Estado: true }
];

// Categorías
export const initialCategories = [
  { IdCategoria: 1,  Nombre: "NIKE 1.1",               Descripcion: "Gorras Nike oficiales, edición limitada y premium",             Estado: true },
  { IdCategoria: 2,  Nombre: "A/N 1.1",                Descripcion: "Colección A/N - Diseños exclusivos y modernos",                  Estado: true },
  { IdCategoria: 3,  Nombre: "BEISBOLERA PREMIUM",     Descripcion: "Gorras beisboleras de alta calidad, materiales premium",         Estado: true },
  { IdCategoria: 4,  Nombre: "DIAMANTE IMPORTADA",     Descripcion: "Gorras importadas con acabado diamante, estilo urbano",         Estado: true },
  { IdCategoria: 5,  Nombre: "EQUINAS-AGROPECUARIAS",  Descripcion: "Gorras para uso agropecuario y campo, resistentes y funcionales", Estado: true },
  { IdCategoria: 6,  Nombre: "EXCLUSIVA 1.1",          Descripcion: "Línea exclusiva, ediciones limitadas y diseños únicos",         Estado: true },
  { IdCategoria: 7,  Nombre: "MONASTERY 1.1",          Descripcion: "Colección Monastery, estilos minimalistas y urbanos",           Estado: true },
  { IdCategoria: 8,  Nombre: "MULTIMARCA",             Descripcion: "Gorras de múltiples marcas, variedad amplia y precios accesibles", Estado: true },
  { IdCategoria: 9,  Nombre: "PLANA CERRADA 1.1",      Descripcion: "Gorras planas con visera cerrada, ideal para streetwear",        Estado: true },
  { IdCategoria: 10, Nombre: "PLANA IMPORTADA",        Descripcion: "Gorras planas importadas, diseños internacionales y tendencia global", Estado: true },
  { IdCategoria: 11, Nombre: "PORTAGORRAS",            Descripcion: "Accesorios y organizadores para almacenar gorras",              Estado: true },
  { IdCategoria: 12, Nombre: "PREMIUM",                Descripcion: "Gorras premium, bordados 3D, materiales de lujo y ajuste perfecto", Estado: true },
  { IdCategoria: 13, Nombre: "camisetas",                Descripcion: "camisetas complementarios a la colección de gorras, diseño coordinado", Estado: true }
];

// Productos - Array completo con ejemplos representativos
export const initialProducts = [
  // BEISBOLERA PREMIUM (ejemplos)
  {
    id: 1,
    nombre: "Gorra Azul Blanco LA",
    categoria: "BEISBOLERA PREMIUM",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Azul", "Blanco"],
    precio: 125000,
    originalPrice: 140000,
    stock: 35,
    imagenes: ["https://res.cloudinary.com/dxc5qqsjd/image/upload/v1762910786/gorraazulblancoLA_rembf2.jpg"],
    descripcion: "Gorra clásica de béisbol con logo LA, combinación azul y blanco",
    isActive: true
  },
  {
    id: 2,
    nombre: "Gorra Azul Contipo A",
    categoria: "BEISBOLERA PREMIUM",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Azul", "Blanco"],
    precio: 110000,
    originalPrice: 125000,
    stock: 28,
    imagenes: ["https://res.cloudinary.com/dxc5qqsjd/image/upload/v1762910795/gorraazulcontipoA_ldfroh.jpg"],
    descripcion: "Gorra béisbolera premium con diseño contipo A",
    isActive: true
  },
  {
    id: 3,
    nombre: "Gorra Azul derayo",
    categoria: "BEISBOLERA PREMIUM",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Azul"],
    precio: 75000,
    originalPrice: 85000,
    stock: 40,
    imagenes: ["https://res.cloudinary.com/dxc5qqsjd/image/upload/v1762910797/gorraazulderayo_v8qcb0.jpg"],
    descripcion: "Gorra béisbolera estilo derayo",
    isActive: true
  },
  {
    id: 4,
    nombre: "Gorra Azul Gris LA",
    categoria: "BEISBOLERA PREMIUM",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Azul", "Gris"],
    precio: 82000,
    originalPrice: 92000,
    stock: 25,
    imagenes: ["https://res.cloudinary.com/dxc5qqsjd/image/upload/v1762910786/gorraazulgrisLa_i1dazk.jpg"],
    descripcion: "Gorra LA en tonos azul y gris",
    isActive: true
  },
  {
    id: 5,
    nombre: "Gorra Azul Letra Verde B",
    categoria: "BEISBOLERA PREMIUM",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Azul", "Verde"],
    precio: 95000,
    originalPrice: 105000,
    stock: 18,
    imagenes: ["https://res.cloudinary.com/dxc5qqsjd/image/upload/v1762910791/gorraazulletraverdeB_wb2htn.jpg"],
    descripcion: "Gorra azul con letra verde estilo B",
    isActive: true
  },
  {
    id: 6,
    nombre: "Gorra Azul Toda LA",
    categoria: "BEISBOLERA PREMIUM",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Azul"],
    precio: 88000,
    originalPrice: 98000,
    stock: 32,
    imagenes: ["https://via.placeholder.com/600x400/1E293B/FFFFFF?text=Imagen+No+Disponible"],
    descripcion: "Gorra totalmente azul con logo LA",
    isActive: true
  },
  {
    id: 7,
    nombre: "Gorra Azul Morado NY",
    categoria: "BEISBOLERA PREMIUM",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Azul", "Morado"],
    precio: 105000,
    originalPrice: 120000,
    stock: 15,
    imagenes: ["https://res.cloudinary.com/dxc5qqsjd/image/upload/v1762910789/gorraazulmoradoNY_vlhcqv.jpg"],
    descripcion: "Gorra azul con detalles morados y logo NY",
    isActive: true
  },
  {
    id: 8,
    nombre: "Gorra Azul SF",
    categoria: "BEISBOLERA PREMIUM",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Azul"],
    precio: 78000,
    originalPrice: 88000,
    stock: 45,
    imagenes: ["https://via.placeholder.com/600x400/1E293B/FFFFFF?text=Imagen+No+Disponible"],
    descripcion: "Gorra azul con logo SF",
    isActive: true
  },
  {
    id: 9,
    nombre: "Gorra Azul SF Café",
    categoria: "BEISBOLERA PREMIUM",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Azul", "Café"],
    precio: 85000,
    originalPrice: 95000,
    stock: 22,
    imagenes: ["https://via.placeholder.com/600x400/1E293B/FFFFFF?text=Imagen+No+Disponible"],
    descripcion: "Gorra azul con detalles café y logo SF",
    isActive: true
  },
  {
    id: 10,
    nombre: "Gorra Azul Sox Blanca",
    categoria: "BEISBOLERA PREMIUM",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Azul", "Blanco"],
    precio: 92000,
    originalPrice: 102000,
    stock: 28,
    imagenes: ["https://via.placeholder.com/600x400/1E293B/FFFFFF?text=Imagen+No+Disponible"],
    descripcion: "Gorra azul y blanca con logo Sox",
    isActive: true
  },
  {
    id: 11,
    nombre: "Gorra Blanca Azul NY",
    categoria: "BEISBOLERA PREMIUM",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Blanco", "Azul"],
    precio: 95000,
    originalPrice: 105000,
    stock: 30,
    imagenes: ["https://via.placeholder.com/600x400/1E293B/FFFFFF?text=Imagen+No+Disponible"],
    descripcion: "Gorra blanca y azul con logo NY",
    isActive: true
  },
  {
    id: 12,
    nombre: "Gorra Blanca Morado NY",
    categoria: "BEISBOLERA PREMIUM",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Blanco", "Morado"],
    precio: 105000,
    originalPrice: 115000,
    stock: 20,
    imagenes: ["https://via.placeholder.com/600x400/1E293B/FFFFFF?text=Imagen+No+Disponible"],
    descripcion: "Gorra blanca con detalles morados y logo NY",
    isActive: true
  },
  {
    id: 13,
    nombre: "Gorra Blanca Negra LA",
    categoria: "BEISBOLERA PREMIUM",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Blanco", "Negro"],
    precio: 98000,
    originalPrice: 108000,
    stock: 25,
    imagenes: ["https://via.placeholder.com/600x400/1E293B/FFFFFF?text=Imagen+No+Disponible"],
    descripcion: "Gorra blanca y negra con logo LA",
    isActive: true
  },
  {
    id: 14,
    nombre: "Gorra Blanca Negra NY",
    categoria: "BEISBOLERA PREMIUM",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Blanco", "Negro"],
    precio: 102000,
    originalPrice: 112000,
    stock: 18,
    imagenes: ["https://via.placeholder.com/600x400/1E293B/FFFFFF?text=Imagen+No+Disponible"],
    descripcion: "Gorra blanca y negra con logo NY",
    isActive: true
  },
  {
    id: 15,
    nombre: "Gorra Blanca NY",
    categoria: "BEISBOLERA PREMIUM",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Blanco"],
    precio: 85000,
    originalPrice: 95000,
    stock: 35,
    imagenes: ["https://via.placeholder.com/600x400/1E293B/FFFFFF?text=Imagen+No+Disponible"],
    descripcion: "Gorra blanca con logo NY",
    isActive: true
  },
  // DIAMANTE IMPORTADA
  {
    id: 36,
    nombre: "Gorra Diamante Roja LA",
    categoria: "DIAMANTE IMPORTADA",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Rojo", "Blanco"],
    precio: 145000,
    originalPrice: 165000,
    stock: 9,
    imagenes: ["https://res.cloudinary.com/dxc5qqsjd/image/upload/v1762914404/gorraAroja_eypttd.jpg"],
    descripcion: "Gorra diamante importada color rojo con logo LA",
    isActive: true,
    hasDiscount: true,
    tags: ["PREMIUM", "IMPORTADA"],
    isFeatured: true
  },
  {
    id: 37,
    nombre: "Gorra Diamante AS",
    categoria: "DIAMANTE IMPORTADA",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Negro"],
    precio: 150000,
    originalPrice: 150000,
    stock: 15,
    imagenes: ["https://res.cloudinary.com/dxc5qqsjd/image/upload/v1762914407/gorraAS_qybamm.jpg"],
    descripcion: "Gorra diamante con logo AS",
    isActive: true,
    hasDiscount: false,
    tags: ["PREMIUM"],
    isFeatured: false
  },
  {
    id: 38,
    nombre: "Gorra Diamante con Rosas",
    categoria: "DIAMANTE IMPORTADA",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Rosa Pastel"],
    precio: 115000,
    originalPrice: 115000,
    stock: 8,
    imagenes: ["https://res.cloudinary.com/dxc5qqsjd/image/upload/v1762914412/gorraconrosas_ko3326.jpg"],
    descripcion: "Gorra diamante con diseño de rosas",
    isActive: true,
    hasDiscount: false,
    tags: ["FEMENINA"],
    isFeatured: false
  },
  {
    id: 39,
    nombre: "Gorra Diamante Doge",
    categoria: "DIAMANTE IMPORTADA",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Multicolor"],
    precio: 135000,
    originalPrice: 135000,
    stock: 6,
    imagenes: ["https://res.cloudinary.com/dxc5qqsjd/image/upload/v1762914410/gorradoge_mefwmo.jpg"],
    descripcion: "Gorra diamante con meme Doge",
    isActive: true,
    hasDiscount: false,
    tags: ["MEME"],
    isFeatured: false
  },
  {
    id: 40,
    nombre: "Gorra Diamante LA",
    categoria: "DIAMANTE IMPORTADA",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Negro", "Dorado"],
    precio: 160000,
    originalPrice: 160000,
    stock: 12,
    imagenes: ["https://res.cloudinary.com/dxc5qqsjd/image/upload/v1762914409/gorraLA_vz1fsr.jpg"],
    descripcion: "Gorra diamante LA premium",
    isActive: true,
    hasDiscount: false,
    tags: ["PREMIUM"],
    isFeatured: true,
    destacado: true,
  },
  {
    id: 41,
    nombre: "Gorra Diamante NY",
    categoria: "DIAMANTE IMPORTADA",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Negro", "Plateado"],
    precio: 155000,
    originalPrice: 155000,
    stock: 10,
    imagenes: ["https://res.cloudinary.com/dxc5qqsjd/image/upload/v1762914405/gorraNY_z3oxea.jpg"],
    descripcion: "Gorra diamante NY premium",
    isActive: true,
    hasDiscount: false,
    tags: ["PREMIUM"],
    isFeatured: false
  },
  // NIKE 1.1
  {
    id: 42,
    nombre: "Gorra Nike Roja & Morada",
    categoria: "NIKE 1.1",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Rojo", "Morado"],
    precio: 165000,
    originalPrice: 165000,
    stock: 22,
    imagenes: ["https://res.cloudinary.com/dxc5qqsjd/image/upload/v1762950188/gorrarojaymorada9_sufoqt.jpg"],
    descripcion: "Gorra Nike deportiva en colores rojo y morado",
    isActive: true,
    hasDiscount: false,
    tags: ["NIKE", "DEPORTIVA"],
    isFeatured: true
  },
  {
    id: 43,
    nombre: "Gorra Nike Azul Bulldog",
    categoria: "NIKE 1.1",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Azul"],
    precio: 92000,
    originalPrice: 92000,
    stock: 18,
    imagenes: ["https://res.cloudinary.com/dxc5qqsjd/image/upload/v1762949687/gorrasazuldelbuldog_ebyrlc.jpg"],
    descripcion: "Gorra Nike con diseño de bulldog",
    isActive: true,
    hasDiscount: false,
    tags: ["NIKE"],
    isFeatured: true,
    destacado: true,
  },
  // A/N 1.1
  {
    id: 44,
    nombre: "Gorra A/N Negra con Escudo",
    categoria: "A/N 1.1",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Negro"],
    precio: 125000,
    originalPrice: 140000,
    stock: 7,
    imagenes: ["https://res.cloudinary.com/dxc5qqsjd/image/upload/v1762988183/negraconelescudo_zzh4l9.jpg"],
    descripcion: "Gorra A/N negra mate con escudo",
    isActive: true,
    hasDiscount: true,
    tags: ["PREMIUM"],
    isFeatured: false
  },
  {
    id: 45,
    nombre: "Gorra A/N Verde con Escudo",
    categoria: "A/N 1.1",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Verde"],
    precio: 145000,
    originalPrice: 160000,
    stock: 3,
    imagenes: ["https://res.cloudinary.com/dxc5qqsjd/image/upload/v1762988184/negraconelescudoverde_pazamj.jpg"],
    descripcion: "Gorra A/N verde militar con escudo",
    isActive: true,
    hasDiscount: true,
    tags: ["PREMIUM"],
    isFeatured: false
  },
  // PORTAGORRAS
  {
    id: 46,
    nombre: "Portagorras Sencillo",
    categoria: "PORTAGORRAS",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Natural"],
    precio: 45000,
    originalPrice: 50000,
    stock: 14,
    imagenes: ["https://res.cloudinary.com/dxc5qqsjd/image/upload/v1762994460/portagorras-1sencillo_xxe5hf.jpg"],
    descripcion: "Portagorras sencillo para almacenamiento",
    isActive: true,
    hasDiscount: true,
    tags: ["ACCESORIO"],
    isFeatured: false
  },
  // RELOJES
  {
    id: 47,
    nombre: "Reloj Deportivo Azul MX60",
    categoria: "RELOJES",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Negro/Plata"],
    precio: 180000,
    originalPrice: 200000,
    stock: 7,
    imagenes: ["https://res.cloudinary.com/dxc5qqsjd/image/upload/v1763002075/azulmx60ot_oal8yb.jpg"],
    descripcion: "Reloj deportivo resistente al agua",
    isActive: true,
    hasDiscount: true,
    tags: ["RELOJ", "DEPORTIVO"],
    isFeatured: true,
    destacado: true,
  },
  {
    id: 48,
    nombre: "Reloj Richard Negro",
    categoria: "RELOJES",
    tallas: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    colores: ["Negro"],
    precio: 320000,
    originalPrice: 350000,
    stock: 3,
    imagenes: ["https://res.cloudinary.com/dxc5qqsjd/image/upload/v1763002076/richarnegro_p6m73v.jpg"],
    descripcion: "Reloj premium marca Richard",
    isActive: true,
    hasDiscount: true,
    tags: ["RELOJ", "PREMIUM"],
    isFeatured: true,
    destacado: true,
  }
];

// Constantes de categorías para filtros
export const categories = [
  "BEISBOLERA PREMIUM",
  "DIAMANTE IMPORTADA", 
  "EQUINAS-AGROPECUARIAS",
  "NIKE 1.1",
  "EXCLUSIVA 1.1",
  "MULTIMARCA",
  "PREMIUM",
  "A/N 1.1",
  "PLANA CERRADA 1.1",
  "PLANA IMPORTADA",
  "PORTAGORRAS",
  "RELOJES"
];

// Mapa de colores para UI
export const colorMap = {
  azul: "#2563EB",
  blanco: "#FFFFFF",
  rojo: "#DC2626",
  negro: "#000000",
  verde: "#16A34A",
  gris: "#6B7280",
  café: "#92400E",
  morado: "#7C3AED",
  rosa: "#DB2777",
  dorado: "#FBBF24",
  plateado: "#9CA3AF",
  amarillo: "#F59E0B",
  naranja: "#EA580C",
  "azul oscuro": "#1E40AF",
  "verde militar": "#365314",
  "azul claro": "#60A5FA",
  beige: "#D4B499",
  marrón: "#7C2D12",
  turquesa: "#06B6D4",
  coral: "#FB7185",
  lila: "#A78BFA",
  menta: "#34D399",
  mostaza: "#D97706",
  vino: "#991B1B",
  "rosa pastel": "#FBCFE8",
  celeste: "#38BDF8",
  "verde limón": "#84CC16",
  multicolor: "linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FECA57, #FF9FF3)",
  natural: "#D1D5DB"
};

// Ventas
export const initialSales = [
  {
    id: 1,
    cliente: { id: 2, nombre: "Imanuel López" },
    vendedor: { id: 1, nombre: "Juan Pérez" },
    estado: "Completada",
    isActive: true,
    fecha: "05/12/2025",
    total: 170000,
    metodoPago: "Efectivo",
    productos: [
      {
        id: 101,
        nombre: "Gorra NBA Lakers",
        cantidad: 2,
        precio: 85000,
        talla: "Ajustable",
        color: "Negro"
      }
    ]
  },
  {
    id: 2,
    cliente: { id: 3, nombre: "Wilson López" },
    vendedor: { id: 2, nombre: "Laura Sánchez" },
    estado: "Completada",
    isActive: true,
    fecha: "06/10/2025",
    total: 95000,
    metodoPago: "Tarjeta",
    productos: [
      {
        id: 102,
        nombre: "Gorra NBA Bulls",
        cantidad: 1,
        precio: 95000,
        talla: "7 1/4",
        color: "Rojo"
      }
    ]
  },
  {
    id: 3,
    cliente: { id: 5, nombre: "Carolina Méndez" },
    vendedor: { id: 3, nombre: "Felipe Vargas" },
    estado: "Pendiente",
    isActive: true,
    fecha: "04/10/2025",
    total: 195000,
    metodoPago: "Transferencia",
    productos: [
      {
        id: 105,
        nombre: "Gorra Westcol Edición",
        cantidad: 1,
        precio: 120000,
        talla: "Ajustable",
        color: "Blanco"
      },
      {
        id: 103,
        nombre: "Gorra Nike",
        cantidad: 1,
        precio: 75000,
        talla: "7",
        color: "Gris"
      }
    ]
  },
  {
    id: 4,
    cliente: { id: 2, nombre: "Imanuel López" },
    vendedor: { id: 1, nombre: "Juan Pérez" },
    estado: "Cancelada",
    isActive: false,
    fecha: "03/10/2025",
    total: 75000,
    metodoPago: "Efectivo",
    productos: [
      {
        id: 104,
        nombre: "Gorra Plana Lakers",
        cantidad: 1,
        precio: 75000,
        talla: "7 1/2",
        color: "Morado"
      }
    ]
  },
  {
    id: 5,
    cliente: { id: 4, nombre: "Laura Sánchez" },
    vendedor: { id: 4, nombre: "Natalia Silva" },
    estado: "Completada",
    isActive: true,
    fecha: "02/11/2025",
    total: 120000,
    metodoPago: "Tarjeta",
    productos: [
      {
        id: 105,
        nombre: "Gorra Westcol Edición",
        cantidad: 1,
        precio: 120000,
        talla: "Ajustable",
        color: "Verde"
      }
    ]
  },
  {
    id: 6,
    cliente: { id: 10, nombre: "Valeria Castro" },
    vendedor: { id: 5, nombre: "Mateo Ruiz" },
    estado: "Completada",
    isActive: true,
    fecha: "31/10/2025",
    total: 210000,
    metodoPago: "Transferencia",
    productos: [
      {
        id: 106,
        nombre: "Gorra Diamante NY",
        cantidad: 2,
        precio: 105000,
        talla: "7 3/8",
        color: "Negro Diamante"
      }
    ]
  },
  {
    id: 7,
    cliente: { id: 7, nombre: "Felipe Vargas" },
    vendedor: { id: 3, nombre: "Felipe Vargas" },
    estado: "Cancelada",
    isActive: false,
    fecha: "30/10/2025",
    total: 82000,
    metodoPago: "Efectivo",
    productos: [
      {
        id: 110,
        nombre: "Gorra Beisbolera Premium",
        cantidad: 1,
        precio: 82000,
        talla: "Ajustable",
        color: "Azul"
      }
    ]
  },
  {
    id: 8,
    cliente: { id: 8, nombre: "Natalia Silva" },
    vendedor: { id: 4, nombre: "Natalia Silva" },
    estado: "Completada",
    isActive: true,
    fecha: "29/10/2025",
    total: 55000,
    metodoPago: "Tarjeta",
    productos: [
      {
        id: 111,
        nombre: "Gorra Agropecuaria Premium",
        cantidad: 1,
        precio: 55000,
        talla: "Ajustable",
        color: "Caqui"
      }
    ]
  },
  {
    id: 9,
    cliente: { id: 6, nombre: "Diana Ríos" },
    vendedor: { id: 6, nombre: "Diana Ríos" },
    estado: "Pendiente",
    isActive: true,
    fecha: "28/10/2025",
    total: 180000,
    metodoPago: "Transferencia",
    productos: [
      {
        id: 201,
        nombre: "Reloj Style Negro",
        cantidad: 1,
        precio: 180000,
        talla: "Única",
        color: "Negro/Plata"
      }
    ]
  },
  {
    id: 10,
    cliente: { id: 12, nombre: "Natalia Silva" },
    vendedor: { id: 4, nombre: "Natalia Silva" },
    estado: "Completada",
    isActive: true,
    fecha: "01/11/2025",
    total: 45000,
    metodoPago: "Efectivo",
    productos: [
      {
        id: 301,
        nombre: "Portagorras",
        cantidad: 1,
        precio: 45000,
        talla: "Única",
        color: "Natural"
      }
    ]
  },
  {
    id: 11,
    cliente: { id: 1, nombre: "Juan Pérez" },
    vendedor: { id: 1, nombre: "Juan Pérez" },
    estado: "Pendiente",
    isActive: true,
    fecha: "07/11/2025",
    total: 290000,
    metodoPago: "Tarjeta",
    productos: [
      {
        id: 108,
        nombre: "Gorra Premium Limited",
        cantidad: 1,
        precio: 290000,
        talla: "7 3/8",
        color: "Borgoña"
      }
    ]
  },
  {
    id: 12,
    cliente: { id: 9, nombre: "Mateo Ruiz" },
    vendedor: { id: 5, nombre: "Mateo Ruiz" },
    estado: "Completada",
    isActive: true,
    fecha: "06/11/2025",
    total: 203000,
    metodoPago: "Transferencia",
    productos: [
      {
        id: 103,
        nombre: "Gorra Nike",
        cantidad: 1,
        precio: 75000,
        talla: "7",
        color: "Rojo"
      },
      {
        id: 107,
        nombre: "Gorra Antioquia Negra",
        cantidad: 1,
        precio: 68000,
        talla: "Ajustable",
        color: "Negro"
      },
      {
        id: 109,
        nombre: "Gorra Multimarca",
        cantidad: 1,
        precio: 60000,
        talla: "Ajustable",
        color: "Verde"
      }
    ]
  }
];

// Compras (Orders)
export const initialOrders = [
  {
    IdCompra: 1,
    IdProveedor: 1,
    proveedor: "Distribuidora ABC",
    Fecha: "2025-11-05T10:30:00",
    Total: 500000,
    Subtotal: 420168.07,
    IVA: 79831.93,
    estado: "Activo",
    metodoPago: "Efectivo",
    isActive: true,
    productos: [
      { IdProducto: 1, nombre: "Gorra Nike Air Force", cantidad: 2, precio: 88000, subtotal: 176000, talla: "Ajustable", color: "Negro" },
      { IdProducto: 5, nombre: "Beisbolera Premium Clásica", cantidad: 3, precio: 75000, subtotal: 225000, talla: "Ajustable", color: "Blanco Roto" }
    ]
  },
  {
    IdCompra: 2,
    IdProveedor: 2,
    proveedor: "Importaciones XYZ",
    Fecha: "2025-11-06T14:15:00",
    Total: 350000,
    Subtotal: 294117.65,
    IVA: 55882.35,
    estado: "Procesando",
    metodoPago: "Transferencia",
    isActive: true,
    productos: [
      { IdProducto: 4, nombre: "Gorra A/N Nebula", cantidad: 1, precio: 145000, subtotal: 145000, talla: "7 1/2", color: "Azul Noche" },
      { IdProducto: 7, nombre: "Gorra Diamante NY", cantidad: 1, precio: 110000, subtotal: 110000, talla: "7 1/4", color: "Negro Diamante" },
      { IdProducto: 10, nombre: "Gorra Agropecuaria Premium", cantidad: 1, precio: 55000, subtotal: 55000, talla: "Ajustable", color: "Caqui" }
    ]
  },
  {
    IdCompra: 3,
    IdProveedor: 3,
    proveedor: "Gorras del Valle",
    Fecha: "2025-11-04T09:45:00",
    Total: 420000,
    Subtotal: 352941.18,
    IVA: 67058.82,
    estado: "Anulada",
    metodoPago: "Tarjeta",
    isActive: false,
    productos: [
      { IdProducto: 8, nombre: "Gorra Diamante LA", cantidad: 1, precio: 115000, subtotal: 115000, talla: "7 1/2", color: "Rosa Pastel" },
      { IdProducto: 11, nombre: "Gorra Exclusiva Oro", cantidad: 1, precio: 220000, subtotal: 220000, talla: "7 1/2", color: "Negro con Oro" },
      { IdProducto: 15, nombre: "Gorra Plana Cerrada Classic", cantidad: 1, precio: 85000, subtotal: 85000, talla: "Ajustable", color: "Negro" }
    ]
  },
  {
    IdCompra: 4,
    IdProveedor: 4,
    proveedor: "Textiles Norte",
    Fecha: "2025-11-03T16:20:00",
    Total: 280000,
    Subtotal: 235294.12,
    IVA: 44705.88,
    estado: "Activo",
    metodoPago: "Efectivo",
    isActive: true,
    productos: [
      { IdProducto: 6, nombre: "Beisbolera Premium Camuflada", cantidad: 2, precio: 82000, subtotal: 164000, talla: "7 3/8", color: "Verde Militar" },
      { IdProducto: 13, nombre: "Gorra Monastery Urban", cantidad: 1, precio: 105000, subtotal: 105000, talla: "7 1/4", color: "Gris Perla" },
      { IdProducto: 18, nombre: "Portagorras Estándar", cantidad: 1, precio: 45000, subtotal: 45000, talla: "Única", color: "Natural" }
    ]
  },
  {
    IdCompra: 5,
    IdProveedor: 5,
    proveedor: "Alimentos Andinos S.A.",
    Fecha: "2025-10-31T11:10:00",
    Total: 620000,
    Subtotal: 521008.40,
    IVA: 98991.60,
    estado: "Activo",
    metodoPago: "Transferencia",
    isActive: true,
    productos: [
      { IdProducto: 3, nombre: "Gorra A/N Eclipse", cantidad: 1, precio: 125000, subtotal: 125000, talla: "7 1/4", color: "Negro Mate" },
      { IdProducto: 12, nombre: "Gorra Monastery Zen", cantidad: 2, precio: 98000, subtotal: 196000, talla: "7 1/8", color: "Beige Natural" },
      { IdProducto: 14, nombre: "Gorra Multimarca Básica", cantidad: 3, precio: 38000, subtotal: 114000, talla: "Ajustable", color: "Variado" },
      { IdProducto: 19, nombre: "Reloj Gorra Style", cantidad: 1, precio: 180000, subtotal: 180000, talla: "Única", color: "Negro/Plata" }
    ]
  },

  /* -------------------- NUEVAS COMPRAS -------------------- */

  {
    IdCompra: 6,
    IdProveedor: 6,
    proveedor: "Ropa & Accesorios Medellín",
    Fecha: "2025-11-07T13:50:00",
    Total: 430000,
    Subtotal: 361344.53,
    IVA: 68655.47,
    estado: "Activo",
    metodoPago: "Efectivo",
    isActive: true,
    productos: [
      { IdProducto: 21, nombre: "Gorra Urban Shadow", cantidad: 2, precio: 90000, subtotal: 180000, talla: "7 1/4", color: "Negro Mate" },
      { IdProducto: 22, nombre: "Gorra Basic Retro", cantidad: 1, precio: 65000, subtotal: 65000, talla: "Ajustable", color: "Rojo Clásico" },
      { IdProducto: 23, nombre: "Beisbolera Elite Sport", cantidad: 2, precio: 92500, subtotal: 185000, talla: "7 3/8", color: "Negro/Gris" }
    ]
  },
  {
    IdCompra: 7,
    IdProveedor: 7,
    proveedor: "Importadora El Capo",
    Fecha: "2025-11-08T09:15:00",
    Total: 280000,
    Subtotal: 235294.12,
    IVA: 44705.88,
    estado: "Procesando",
    metodoPago: "Transferencia",
    isActive: true,
    productos: [
      { IdProducto: 24, nombre: "Gorra Galaxy Chrome", cantidad: 1, precio: 135000, subtotal: 135000, talla: "7 1/8", color: "Negro/Plateado" },
      { IdProducto: 25, nombre: "Gorra Classic NY", cantidad: 1, precio: 95000, subtotal: 95000, talla: "7 1/2", color: "Azul Marino" },
      { IdProducto: 26, nombre: "Gorra Aero Street", cantidad: 1, precio: 50000, subtotal: 50000, talla: "Ajustable", color: "Gris Urbano" }
    ]
  },
  {
    IdCompra: 8,
    IdProveedor: 3,
    proveedor: "Gorras del Valle",
    Fecha: "2025-11-09T12:30:00",
    Total: 370000,
    Subtotal: 310924.37,
    IVA: 59075.63,
    estado: "Activo",
    metodoPago: "Tarjeta",
    isActive: true,
    productos: [
      { IdProducto: 27, nombre: "Gorra Deluxe Colombia", cantidad: 1, precio: 155000, subtotal: 155000, talla: "7 1/4", color: "Tricolor" },
      { IdProducto: 28, nombre: "Gorra Limited Urban", cantidad: 2, precio: 95000, subtotal: 190000, talla: "Ajustable", color: "Negro/Gris" },
      { IdProducto: 29, nombre: "Gorra Retro Clásica", cantidad: 1, precio: 25000, subtotal: 25000, talla: "Única", color: "Beige" }
    ]
  },
  {
    IdCompra: 9,
    IdProveedor: 8,
    proveedor: "Sombreros & Style SAS",
    Fecha: "2025-11-10T17:40:00",
    Total: 310000,
    Subtotal: 260504.20,
    IVA: 49500.80,
    estado: "Anulada",
    metodoPago: "Efectivo",
    isActive: false,
    productos: [
      { IdProducto: 30, nombre: "Gorra Royal Crown", cantidad: 1, precio: 170000, subtotal: 170000, talla: "7 1/2", color: "Negro/Oro" },
      { IdProducto: 31, nombre: "Gorra Street Edition", cantidad: 2, precio: 70000, subtotal: 140000, talla: "7 1/8", color: "Borgoña" }
    ]
  },
  {
    IdCompra: 10,
    IdProveedor: 9,
    proveedor: "Distribuidora Central",
    Fecha: "2025-11-11T08:10:00",
    Total: 255000,
    Subtotal: 214285.71,
    IVA: 406.14,
    estado: "Activo",
    metodoPago: "Transferencia",
    isActive: true,
    productos: [
      { IdProducto: 32, nombre: "Gorra Titan Pro", cantidad: 1, precio: 125000, subtotal: 125000, talla: "7 3/8", color: "Negro/Azul" },
      { IdProducto: 33, nombre: "Gorra Mountain Peak", cantidad: 1, precio: 80000, subtotal: 80000, talla: "Ajustable", color: "Verde" },
      { IdProducto: 34, nombre: "Gorra Lona Tradicional", cantidad: 1, precio: 50000, subtotal: 50000, talla: "Única", color: "Arena" }
    ]
  },
  {
    IdCompra: 11,
    IdProveedor: 10,
    proveedor: "Global Caps LTD",
    Fecha: "2025-11-12T15:00:00",
    Total: 540000,
    Subtotal: 453781.51,
    IVA: 86218.49,
    estado: "Procesando",
    metodoPago: "Efectivo",
    isActive: true,
    productos: [
      { IdProducto: 35, nombre: "Gorra Infinity Black", cantidad: 3, precio: 120000, subtotal: 360000, talla: "7 1/2", color: "Negro" },
      { IdProducto: 36, nombre: "Gorra Arctic White", cantidad: 2, precio: 90000, subtotal: 180000, talla: "7 1/4", color: "Blanco" }
    ]
  }
];



// Devoluciones
export const initialReturns = [
  {
    IdDevolucion: 1,
    IdProducto: 1,
    IdVenta: 1,
    Cantidad: 1,
    Motivo: "Producto defectuoso - logo despegado",
    Fecha: "2025-11-08T10:30:00",
    Monto: 88000.00
  },
  {
    IdDevolucion: 2,
    IdProducto: 5,
    IdVenta: 1,
    Cantidad: 1,
    Motivo: "Talla incorrecta - muy ajustada",
    Fecha: "2025-11-09T14:20:00",
    Monto: 75000.00
  },
  {
    IdDevolucion: 3,
    IdProducto: 4,
    IdVenta: 2,
    Cantidad: 1,
    Motivo: "Color diferente al mostrado en la imagen",
    Fecha: "2025-11-10T09:15:00",
    Monto: 145000.00
  },
  {
    IdDevolucion: 4,
    IdProducto: 7,
    IdVenta: 2,
    Cantidad: 1,
    Motivo: "Mal ajuste - se cae fácilmente",
    Fecha: "2025-11-11T16:45:00",
    Monto: 110000.00
  },
  {
    IdDevolucion: 5,
    IdProducto: 8,
    IdVenta: 3,
    Cantidad: 1,
    Motivo: "Arrepentimiento de compra",
    Fecha: "2025-11-12T11:30:00",
    Monto: 115000.00
  }
];

// =================================================================
// FUNCIONES DE AYUDA
// =================================================================

// Función para obtener el color del estado
export const getStatusColor = (status) => {
  switch (status) {
    case "Completada":
      return "#28a745";
    case "Pendiente":
      return "#ffc107";
    case "Cancelada":
      return "#6c757d";
    default:
      return "#6c757d";
  }
};

// Métodos de pago
export const paymentMethods = [
  "Efectivo",
  "Tarjeta",
  "Transferencia",
];

// Función para obtener productos en oferta
export const getProductsOnSale = () => {
  return initialProducts.filter(product => 
    product.isActive && product.hasDiscount && product.precio < product.originalPrice
  );
};

// Función para calcular el porcentaje de descuento
export const calculateDiscountPercentage = (originalPrice, salePrice) => {
  if (!originalPrice || originalPrice <= salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

// Función para obtener productos destacados
export const getFeaturedProducts = () => {
  return initialProducts.filter(product => 
    product.isActive && product.isFeatured
  );
};

// Función para obtener productos por categoría
export const getProductsByCategory = (category) => {
  return initialProducts.filter(product => 
    product.isActive && product.categoria === category
  );
};

// Función para obtener productos con bajo stock
export const getLowStockProducts = (threshold = 10) => {
  return initialProducts.filter(product => 
    product.isActive && product.stock <= threshold
  );
};

// Función para obtener el total de ventas
export const getTotalSales = () => {
  return initialSales
    .filter(sale => sale.estado === "Completada" && sale.isActive)
    .reduce((total, sale) => total + sale.total, 0);
};

// Función para obtener ventas por mes
export const getSalesByMonth = () => {
  const salesByMonth = {};
  
  initialSales.forEach(sale => {
    if (sale.estado === "Completada" && sale.isActive) {
      const month = sale.fecha.split('/')[1]; // Obtener el mes
      if (!salesByMonth[month]) {
        salesByMonth[month] = 0;
      }
      salesByMonth[month] += sale.total;
    }
  });
  
  return salesByMonth;
};

// =================================================================
// FUNCIONES DE FILTRADO AVANZADO
// =================================================================

// Función para obtener productos por color y talla
export const getProductsByColorAndSize = (color, size) => {
  return initialProducts.filter(product => {
    // Verificar si el producto está activo
    if (!product.isActive) return false;
    
    // Verificar color
    const colorMatch = !color || 
      (Array.isArray(product.colores) && product.colores.some(c => 
        c.toLowerCase().includes(color.toLowerCase())
      )) ||
      (typeof product.colores === 'string' && 
       product.colores.toLowerCase().includes(color.toLowerCase()));
    
    // Verificar talla
    const sizeMatch = !size || 
      (Array.isArray(product.tallas) && product.tallas.some(t => 
        t.toLowerCase().includes(size.toLowerCase())
      )) ||
      (typeof product.tallas === 'string' && 
       product.tallas.toLowerCase().includes(size.toLowerCase()));
    
    return colorMatch && sizeMatch;
  });
};

// Función para obtener productos en oferta con filtros opcionales
export const getFilteredProductsOnSale = (filters = {}) => {
  let filtered = getProductsOnSale();
  
  // Aplicar filtros si existen
  if (filters.color) {
    filtered = filtered.filter(product => 
      product.colores && 
      product.colores.some(c => 
        c.toLowerCase().includes(filters.color.toLowerCase())
      )
    );
  }
  
  if (filters.size) {
    filtered = filtered.filter(product => 
      product.tallas && 
      product.tallas.some(t => 
        t.toLowerCase().includes(filters.size.toLowerCase())
      )
    );
  }
  
  if (filters.category) {
    filtered = filtered.filter(product => 
      product.categoria && 
      product.categoria.toLowerCase().includes(filters.category.toLowerCase())
    );
  }
  
  if (filters.minPrice || filters.maxPrice) {
    filtered = filtered.filter(product => {
      const price = product.precio;
      const minMatch = !filters.minPrice || price >= filters.minPrice;
      const maxMatch = !filters.maxPrice || price <= filters.maxPrice;
      return minMatch && maxMatch;
    });
  }
  
  return filtered;
};

// Función para obtener productos por múltiples colores
export const getProductsByMultipleColors = (colors = []) => {
  if (!colors.length) return initialProducts.filter(p => p.isActive);
  
  return initialProducts.filter(product => 
    product.isActive && 
    product.colores && 
    product.colores.some(productColor => 
      colors.some(searchColor => 
        productColor.toLowerCase().includes(searchColor.toLowerCase())
      )
    )
  );
};