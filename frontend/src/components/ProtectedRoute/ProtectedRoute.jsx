import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AccessDenied from "../../pages/AccessDenied";

export default function ProtectedRoute({
  children,
  roles,
}) {
  const {
    loading,
    session,
    usuario,
    mensajeAcceso,
  } = useAuth();

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (!usuario) {
    return <AccessDenied mensaje={mensajeAcceso} />;
  }

  if (
    roles &&
    !roles.includes(usuario.roles?.nombre)
  ) {
    return (
      <AccessDenied
        mensaje="No tenés permisos para acceder a esta sección."
      />
    );
  }

  return children;
}