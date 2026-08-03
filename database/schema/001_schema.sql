-- =====================================================
-- Plataforma Web de Gestión de Pedidos de Almuerzo
-- Archivo: 001_schema.sql
-- Motor: PostgreSQL (Supabase)
-- Versión: 001
-- =====================================================

-- =====================================================
-- Extensiones
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- TABLA: roles
-- =====================================================

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT
);

-- =====================================================
-- TABLA: empresas
-- =====================================================

CREATE TABLE empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- =====================================================
-- TABLA: usuarios
-- =====================================================

CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    auth_user_id UUID NOT NULL UNIQUE,

    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    empresa_id UUID NOT NULL,
    rol_id UUID NOT NULL,

    activo BOOLEAN NOT NULL DEFAULT TRUE,

    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
    fecha_modificacion TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_usuario_empresa
        FOREIGN KEY (empresa_id)
        REFERENCES empresas(id),

    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (rol_id)
        REFERENCES roles(id)
);


-- =====================================================
-- TABLA: rotiserias
-- =====================================================

CREATE TABLE rotiserias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    nombre VARCHAR(100) NOT NULL UNIQUE,

    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
    fecha_modificacion TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =====================================================
-- TABLA: publicaciones
-- =====================================================

CREATE TABLE publicaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    rotiseria_id UUID NOT NULL,

    fecha DATE NOT NULL,

    menu_texto TEXT,

    aclaraciones TEXT,

    publicado_por UUID NOT NULL,

    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
    fecha_modificacion TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_publicaciones_rotiseria
        FOREIGN KEY (rotiseria_id)
        REFERENCES rotiserias(id),

    CONSTRAINT fk_publicaciones_usuario
        FOREIGN KEY (publicado_por)
        REFERENCES usuarios(id),

    CONSTRAINT uq_publicacion_rotiseria_fecha
        UNIQUE (rotiseria_id, fecha)
);

-- =====================================================
-- TABLA: publicacion_imagenes
-- =====================================================

CREATE TABLE publicacion_imagenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    publicacion_id UUID NOT NULL,

    url TEXT NOT NULL,

    orden INTEGER NOT NULL DEFAULT 1,

    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_imagen_publicacion
        FOREIGN KEY (publicacion_id)
        REFERENCES publicaciones(id)
        ON DELETE CASCADE
);

-- =====================================================
-- TABLA: pedidos
-- =====================================================

CREATE TABLE pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    usuario_id UUID NOT NULL,

    rotiseria_id UUID NOT NULL,
    
    pedido TEXT NOT NULL,

    observaciones TEXT,

    fecha DATE NOT NULL,

    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),

    fecha_modificacion TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_pedido_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id),

    CONSTRAINT fk_pedido_rotiseria
        FOREIGN KEY (rotiseria_id)
        REFERENCES rotiserias(id),

    CONSTRAINT uq_pedido_usuario_fecha
        UNIQUE (usuario_id, fecha)
);

-- =====================================================
-- ÍNDICES
-- =====================================================

CREATE INDEX idx_usuarios_empresa
    ON usuarios (empresa_id);

CREATE INDEX idx_usuarios_rol
    ON usuarios (rol_id);

CREATE INDEX idx_publicaciones_fecha
    ON publicaciones (fecha);

CREATE INDEX idx_publicaciones_rotiseria
    ON publicaciones (rotiseria_id);

CREATE INDEX idx_pedidos_usuario
    ON pedidos (usuario_id);

CREATE INDEX idx_pedidos_rotiseria
    ON pedidos (rotiseria_id);

CREATE INDEX idx_pedidos_fecha
    ON pedidos (fecha);

