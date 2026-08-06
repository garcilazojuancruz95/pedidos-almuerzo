-- =====================================================
-- ROLES
-- =====================================================

INSERT INTO roles (nombre, descripcion)
VALUES
('Administrador', 'Administra empresas y roles de la plataforma.'),
('Operador', 'Gestiona usuarios, rotiserías, publicaciones, pedidos y configuración.'),
('Empleado', 'Consulta las publicaciones, realiza pedidos e informa ausencias.');

-- =====================================================
-- EMPRESAS
-- =====================================================

INSERT INTO empresas (nombre)
VALUES
('Nasini S.A.'),
('Mutual'),
('Market Hub');

-- =====================================================
-- ROTISERÍAS
-- =====================================================

INSERT INTO rotiserias (nombre)
VALUES
('Mary'),
('Brisari'),
('Roti Ensaladas');

-- =====================================================
-- CONFIGURACIÓN
-- =====================================================

INSERT INTO configuracion (
    hora_limite_pedidos
)
VALUES (
    '11:00'
);

-- =====================================================
-- USUARIOS
-- =====================================================

-- Los usuarios no se cargan mediante el seed.
-- Serán sincronizados automáticamente desde Google Workspace
-- al iniciar sesión por primera vez o mediante el proceso
-- de sincronización definido para la plataforma.