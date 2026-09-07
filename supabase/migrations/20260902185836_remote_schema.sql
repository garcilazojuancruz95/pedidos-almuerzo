


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."es_operador"() RETURNS boolean
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.usuarios u
    JOIN public.roles r ON r.id = u.rol_id
    WHERE u.auth_user_id = auth.uid()
      AND u.activo = true
      AND r.nombre = 'Operador'
  );
$$;


ALTER FUNCTION "public"."es_operador"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."empresas" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nombre" character varying(100) NOT NULL
);


ALTER TABLE "public"."empresas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."home_office" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "usuario_id" "uuid" NOT NULL,
    "fecha" "date" DEFAULT CURRENT_DATE NOT NULL,
    "creado_en" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."home_office" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pedidos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "usuario_id" "uuid" NOT NULL,
    "rotiseria_id" "uuid" NOT NULL,
    "pedido" "text" NOT NULL,
    "observaciones" "text",
    "fecha" "date" NOT NULL,
    "fecha_creacion" timestamp without time zone DEFAULT "now"() NOT NULL,
    "fecha_modificacion" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."pedidos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."publicacion_imagenes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "publicacion_id" "uuid" NOT NULL,
    "url" "text" NOT NULL,
    "orden" integer DEFAULT 1 NOT NULL,
    "fecha_creacion" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."publicacion_imagenes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."publicacion_opciones" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "publicacion_id" "uuid" NOT NULL,
    "nombre" "text" NOT NULL,
    "orden" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."publicacion_opciones" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."publicaciones" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "rotiseria_id" "uuid" NOT NULL,
    "fecha" "date" NOT NULL,
    "menu_texto" "text",
    "aclaraciones" "text",
    "publicado_por" "uuid" NOT NULL,
    "fecha_creacion" timestamp without time zone DEFAULT "now"() NOT NULL,
    "fecha_modificacion" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."publicaciones" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."roles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nombre" character varying(50) NOT NULL,
    "descripcion" "text"
);


ALTER TABLE "public"."roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."rotiserias" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nombre" character varying(100) NOT NULL,
    "fecha_creacion" timestamp without time zone DEFAULT "now"() NOT NULL,
    "fecha_modificacion" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."rotiserias" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."usuarios" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "auth_user_id" "uuid",
    "nombre" character varying(100) NOT NULL,
    "apellido" character varying(100) NOT NULL,
    "email" character varying(255) NOT NULL,
    "empresa_id" "uuid" NOT NULL,
    "rol_id" "uuid" NOT NULL,
    "activo" boolean DEFAULT true NOT NULL,
    "fecha_creacion" timestamp without time zone DEFAULT "now"() NOT NULL,
    "fecha_modificacion" timestamp without time zone DEFAULT "now"() NOT NULL,
    "peopleforce_id" bigint
);


ALTER TABLE "public"."usuarios" OWNER TO "postgres";


ALTER TABLE ONLY "public"."empresas"
    ADD CONSTRAINT "empresas_nombre_key" UNIQUE ("nombre");



ALTER TABLE ONLY "public"."empresas"
    ADD CONSTRAINT "empresas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."home_office"
    ADD CONSTRAINT "home_office_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."home_office"
    ADD CONSTRAINT "home_office_usuario_fecha_unico" UNIQUE ("usuario_id", "fecha");



ALTER TABLE ONLY "public"."pedidos"
    ADD CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."publicacion_imagenes"
    ADD CONSTRAINT "publicacion_imagenes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."publicacion_opciones"
    ADD CONSTRAINT "publicacion_opciones_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."publicaciones"
    ADD CONSTRAINT "publicaciones_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_nombre_key" UNIQUE ("nombre");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rotiserias"
    ADD CONSTRAINT "rotiserias_nombre_key" UNIQUE ("nombre");



ALTER TABLE ONLY "public"."rotiserias"
    ADD CONSTRAINT "rotiserias_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."publicaciones"
    ADD CONSTRAINT "uq_publicacion_rotiseria_fecha" UNIQUE ("rotiseria_id", "fecha");



ALTER TABLE ONLY "public"."usuarios"
    ADD CONSTRAINT "usuarios_auth_user_id_key" UNIQUE ("auth_user_id");



ALTER TABLE ONLY "public"."usuarios"
    ADD CONSTRAINT "usuarios_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."usuarios"
    ADD CONSTRAINT "usuarios_peopleforce_id_unique" UNIQUE ("peopleforce_id");



ALTER TABLE ONLY "public"."usuarios"
    ADD CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_pedidos_fecha" ON "public"."pedidos" USING "btree" ("fecha");



CREATE INDEX "idx_pedidos_rotiseria" ON "public"."pedidos" USING "btree" ("rotiseria_id");



CREATE INDEX "idx_pedidos_usuario" ON "public"."pedidos" USING "btree" ("usuario_id");



CREATE INDEX "idx_publicaciones_fecha" ON "public"."publicaciones" USING "btree" ("fecha");



CREATE INDEX "idx_publicaciones_rotiseria" ON "public"."publicaciones" USING "btree" ("rotiseria_id");



CREATE INDEX "idx_usuarios_empresa" ON "public"."usuarios" USING "btree" ("empresa_id");



CREATE INDEX "idx_usuarios_rol" ON "public"."usuarios" USING "btree" ("rol_id");



ALTER TABLE ONLY "public"."publicacion_imagenes"
    ADD CONSTRAINT "fk_imagen_publicacion" FOREIGN KEY ("publicacion_id") REFERENCES "public"."publicaciones"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pedidos"
    ADD CONSTRAINT "fk_pedido_rotiseria" FOREIGN KEY ("rotiseria_id") REFERENCES "public"."rotiserias"("id");



ALTER TABLE ONLY "public"."pedidos"
    ADD CONSTRAINT "fk_pedido_usuario" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id");



ALTER TABLE ONLY "public"."publicaciones"
    ADD CONSTRAINT "fk_publicaciones_rotiseria" FOREIGN KEY ("rotiseria_id") REFERENCES "public"."rotiserias"("id");



ALTER TABLE ONLY "public"."publicaciones"
    ADD CONSTRAINT "fk_publicaciones_usuario" FOREIGN KEY ("publicado_por") REFERENCES "public"."usuarios"("id");



ALTER TABLE ONLY "public"."usuarios"
    ADD CONSTRAINT "fk_usuario_empresa" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id");



ALTER TABLE ONLY "public"."usuarios"
    ADD CONSTRAINT "fk_usuario_rol" FOREIGN KEY ("rol_id") REFERENCES "public"."roles"("id");



ALTER TABLE ONLY "public"."home_office"
    ADD CONSTRAINT "home_office_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."publicacion_opciones"
    ADD CONSTRAINT "publicacion_opciones_publicacion_id_fkey" FOREIGN KEY ("publicacion_id") REFERENCES "public"."publicaciones"("id") ON DELETE CASCADE;



CREATE POLICY "Empleados pueden actualizar sus propios pedidos" ON "public"."pedidos" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."usuarios" "u"
     JOIN "public"."roles" "r" ON (("r"."id" = "u"."rol_id")))
  WHERE (("u"."id" = "pedidos"."usuario_id") AND ("u"."auth_user_id" = "auth"."uid"()) AND ("u"."activo" = true) AND (("r"."nombre")::"text" = 'Empleado'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM ("public"."usuarios" "u"
     JOIN "public"."roles" "r" ON (("r"."id" = "u"."rol_id")))
  WHERE (("u"."id" = "pedidos"."usuario_id") AND ("u"."auth_user_id" = "auth"."uid"()) AND ("u"."activo" = true) AND (("r"."nombre")::"text" = 'Empleado'::"text")))));



CREATE POLICY "Empleados pueden crear su propio home office" ON "public"."home_office" FOR INSERT WITH CHECK (("usuario_id" IN ( SELECT "usuarios"."id"
   FROM "public"."usuarios"
  WHERE ("usuarios"."auth_user_id" = "auth"."uid"()))));



CREATE POLICY "Empleados pueden eliminar su propio home office" ON "public"."home_office" FOR DELETE USING (("usuario_id" IN ( SELECT "usuarios"."id"
   FROM "public"."usuarios"
  WHERE ("usuarios"."auth_user_id" = "auth"."uid"()))));



CREATE POLICY "Empleados pueden eliminar sus propios pedidos" ON "public"."pedidos" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."usuarios" "u"
     JOIN "public"."roles" "r" ON (("r"."id" = "u"."rol_id")))
  WHERE (("u"."id" = "pedidos"."usuario_id") AND ("u"."auth_user_id" = "auth"."uid"()) AND ("u"."activo" = true) AND (("r"."nombre")::"text" = 'Empleado'::"text")))));



CREATE POLICY "Empleados pueden ver su propio home office" ON "public"."home_office" FOR SELECT USING (("usuario_id" IN ( SELECT "usuarios"."id"
   FROM "public"."usuarios"
  WHERE ("usuarios"."auth_user_id" = "auth"."uid"()))));



CREATE POLICY "Empleados pueden ver sus propios pedidos" ON "public"."pedidos" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."usuarios" "u"
     JOIN "public"."roles" "r" ON (("r"."id" = "u"."rol_id")))
  WHERE (("u"."id" = "pedidos"."usuario_id") AND ("u"."auth_user_id" = "auth"."uid"()) AND ("u"."activo" = true) AND (("r"."nombre")::"text" = 'Empleado'::"text")))));



CREATE POLICY "Operadores pueden actualizar usuarios" ON "public"."usuarios" FOR UPDATE TO "authenticated" USING ("public"."es_operador"()) WITH CHECK ("public"."es_operador"());



CREATE POLICY "Operadores pueden insertar usuarios" ON "public"."usuarios" FOR INSERT TO "authenticated" WITH CHECK ("public"."es_operador"());



CREATE POLICY "Operadores pueden ver home office" ON "public"."home_office" FOR SELECT USING ("public"."es_operador"());



CREATE POLICY "Operadores pueden ver usuarios" ON "public"."usuarios" FOR SELECT TO "authenticated" USING ("public"."es_operador"());



CREATE POLICY "Operadores y administradores pueden actualizar pedidos" ON "public"."pedidos" FOR UPDATE TO "authenticated" USING ("public"."es_operador"()) WITH CHECK ("public"."es_operador"());



CREATE POLICY "Operadores y administradores pueden actualizar publicaciones" ON "public"."publicaciones" FOR UPDATE TO "authenticated" USING (("public"."es_operador"() OR (EXISTS ( SELECT 1
   FROM ("public"."usuarios" "u"
     JOIN "public"."roles" "r" ON (("r"."id" = "u"."rol_id")))
  WHERE (("u"."auth_user_id" = "auth"."uid"()) AND ("u"."activo" = true) AND (("r"."nombre")::"text" = 'Administrador'::"text")))))) WITH CHECK (("public"."es_operador"() OR (EXISTS ( SELECT 1
   FROM ("public"."usuarios" "u"
     JOIN "public"."roles" "r" ON (("r"."id" = "u"."rol_id")))
  WHERE (("u"."auth_user_id" = "auth"."uid"()) AND ("u"."activo" = true) AND (("r"."nombre")::"text" = 'Administrador'::"text"))))));



CREATE POLICY "Operadores y administradores pueden crear imagenes de publicaci" ON "public"."publicacion_imagenes" FOR INSERT TO "authenticated" WITH CHECK (("public"."es_operador"() OR (EXISTS ( SELECT 1
   FROM ("public"."usuarios" "u"
     JOIN "public"."roles" "r" ON (("r"."id" = "u"."rol_id")))
  WHERE (("u"."auth_user_id" = "auth"."uid"()) AND ("u"."activo" = true) AND (("r"."nombre")::"text" = 'Administrador'::"text"))))));



CREATE POLICY "Operadores y administradores pueden crear publicaciones" ON "public"."publicaciones" FOR INSERT TO "authenticated" WITH CHECK (("public"."es_operador"() OR (EXISTS ( SELECT 1
   FROM ("public"."usuarios" "u"
     JOIN "public"."roles" "r" ON (("r"."id" = "u"."rol_id")))
  WHERE (("u"."auth_user_id" = "auth"."uid"()) AND ("u"."activo" = true) AND (("r"."nombre")::"text" = 'Administrador'::"text"))))));



CREATE POLICY "Operadores y administradores pueden eliminar imagenes de public" ON "public"."publicacion_imagenes" FOR DELETE TO "authenticated" USING (("public"."es_operador"() OR (EXISTS ( SELECT 1
   FROM ("public"."usuarios" "u"
     JOIN "public"."roles" "r" ON (("r"."id" = "u"."rol_id")))
  WHERE (("u"."auth_user_id" = "auth"."uid"()) AND ("u"."activo" = true) AND (("r"."nombre")::"text" = 'Administrador'::"text"))))));



CREATE POLICY "Operadores y administradores pueden eliminar pedidos" ON "public"."pedidos" FOR DELETE TO "authenticated" USING ("public"."es_operador"());



CREATE POLICY "Operadores y administradores pueden eliminar publicaciones" ON "public"."publicaciones" FOR DELETE TO "authenticated" USING (("public"."es_operador"() OR (EXISTS ( SELECT 1
   FROM ("public"."usuarios" "u"
     JOIN "public"."roles" "r" ON (("r"."id" = "u"."rol_id")))
  WHERE (("u"."auth_user_id" = "auth"."uid"()) AND ("u"."activo" = true) AND (("r"."nombre")::"text" = 'Administrador'::"text"))))));



CREATE POLICY "Operadores y administradores pueden ver pedidos" ON "public"."pedidos" FOR SELECT TO "authenticated" USING (("public"."es_operador"() OR (EXISTS ( SELECT 1
   FROM ("public"."usuarios" "u"
     JOIN "public"."roles" "r" ON (("r"."id" = "u"."rol_id")))
  WHERE (("u"."auth_user_id" = "auth"."uid"()) AND ("u"."activo" = true) AND (("r"."nombre")::"text" = 'Administrador'::"text"))))));



CREATE POLICY "Policy Name: usuarios_autenticados_pueden_ver_roles" ON "public"."roles" FOR SELECT USING (true);



CREATE POLICY "Usuarios autenticados pueden ver imagenes de publicaciones" ON "public"."publicacion_imagenes" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Usuarios autenticados pueden ver publicaciones" ON "public"."publicaciones" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Usuarios autenticados pueden ver rotiserias" ON "public"."rotiserias" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Usuarios autorizados pueden crear pedidos" ON "public"."pedidos" FOR INSERT TO "authenticated" WITH CHECK (((EXISTS ( SELECT 1
   FROM ("public"."usuarios" "u"
     JOIN "public"."roles" "r" ON (("r"."id" = "u"."rol_id")))
  WHERE (("u"."auth_user_id" = "auth"."uid"()) AND ("u"."id" = "pedidos"."usuario_id") AND (("r"."nombre")::"text" = 'Empleado'::"text")))) OR (EXISTS ( SELECT 1
   FROM ("public"."usuarios" "u"
     JOIN "public"."roles" "r" ON (("r"."id" = "u"."rol_id")))
  WHERE (("u"."auth_user_id" = "auth"."uid"()) AND (("r"."nombre")::"text" = 'Operador'::"text")))) OR (EXISTS ( SELECT 1
   FROM ("public"."usuarios" "u"
     JOIN "public"."roles" "r" ON (("r"."id" = "u"."rol_id")))
  WHERE (("u"."auth_user_id" = "auth"."uid"()) AND (("r"."nombre")::"text" = ANY ((ARRAY['Administrador'::character varying, 'Superadministrador'::character varying])::"text"[])))))));



CREATE POLICY "Usuarios pueden ver su propio registro" ON "public"."usuarios" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "auth_user_id"));



ALTER TABLE "public"."empresas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."home_office" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pedidos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."publicacion_imagenes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."publicacion_opciones" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."publicaciones" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rotiserias" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."usuarios" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "usuarios_autenticados_pueden_ver_empresas" ON "public"."empresas" FOR SELECT USING (true);





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































GRANT ALL ON FUNCTION "public"."es_operador"() TO "anon";
GRANT ALL ON FUNCTION "public"."es_operador"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."es_operador"() TO "service_role";


















GRANT ALL ON TABLE "public"."empresas" TO "anon";
GRANT ALL ON TABLE "public"."empresas" TO "authenticated";
GRANT ALL ON TABLE "public"."empresas" TO "service_role";



GRANT ALL ON TABLE "public"."home_office" TO "anon";
GRANT ALL ON TABLE "public"."home_office" TO "authenticated";
GRANT ALL ON TABLE "public"."home_office" TO "service_role";



GRANT ALL ON TABLE "public"."pedidos" TO "anon";
GRANT ALL ON TABLE "public"."pedidos" TO "authenticated";
GRANT ALL ON TABLE "public"."pedidos" TO "service_role";



GRANT ALL ON TABLE "public"."publicacion_imagenes" TO "anon";
GRANT ALL ON TABLE "public"."publicacion_imagenes" TO "authenticated";
GRANT ALL ON TABLE "public"."publicacion_imagenes" TO "service_role";



GRANT ALL ON TABLE "public"."publicacion_opciones" TO "anon";
GRANT ALL ON TABLE "public"."publicacion_opciones" TO "authenticated";
GRANT ALL ON TABLE "public"."publicacion_opciones" TO "service_role";



GRANT ALL ON TABLE "public"."publicaciones" TO "anon";
GRANT ALL ON TABLE "public"."publicaciones" TO "authenticated";
GRANT ALL ON TABLE "public"."publicaciones" TO "service_role";



GRANT ALL ON TABLE "public"."roles" TO "anon";
GRANT ALL ON TABLE "public"."roles" TO "authenticated";
GRANT ALL ON TABLE "public"."roles" TO "service_role";



GRANT ALL ON TABLE "public"."rotiserias" TO "anon";
GRANT ALL ON TABLE "public"."rotiserias" TO "authenticated";
GRANT ALL ON TABLE "public"."rotiserias" TO "service_role";



GRANT ALL ON TABLE "public"."usuarios" TO "anon";
GRANT ALL ON TABLE "public"."usuarios" TO "authenticated";
GRANT ALL ON TABLE "public"."usuarios" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";

drop policy "Usuarios autorizados pueden crear pedidos" on "public"."pedidos";


  create policy "Usuarios autorizados pueden crear pedidos"
  on "public"."pedidos"
  as permissive
  for insert
  to authenticated
with check (((EXISTS ( SELECT 1
   FROM (public.usuarios u
     JOIN public.roles r ON ((r.id = u.rol_id)))
  WHERE ((u.auth_user_id = auth.uid()) AND (u.id = pedidos.usuario_id) AND ((r.nombre)::text = 'Empleado'::text)))) OR (EXISTS ( SELECT 1
   FROM (public.usuarios u
     JOIN public.roles r ON ((r.id = u.rol_id)))
  WHERE ((u.auth_user_id = auth.uid()) AND ((r.nombre)::text = 'Operador'::text)))) OR (EXISTS ( SELECT 1
   FROM (public.usuarios u
     JOIN public.roles r ON ((r.id = u.rol_id)))
  WHERE ((u.auth_user_id = auth.uid()) AND ((r.nombre)::text = ANY ((ARRAY['Administrador'::character varying, 'Superadministrador'::character varying])::text[])))))));



  create policy "Operadores y administradores pueden eliminar imagenes"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'publicaciones'::text) AND (public.es_operador() OR (EXISTS ( SELECT 1
   FROM (public.usuarios u
     JOIN public.roles r ON ((r.id = u.rol_id)))
  WHERE ((u.auth_user_id = auth.uid()) AND (u.activo = true) AND ((r.nombre)::text = 'Administrador'::text)))))));



  create policy "Operadores y administradores pueden modificar imagenes"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (((bucket_id = 'publicaciones'::text) AND (public.es_operador() OR (EXISTS ( SELECT 1
   FROM (public.usuarios u
     JOIN public.roles r ON ((r.id = u.rol_id)))
  WHERE ((u.auth_user_id = auth.uid()) AND (u.activo = true) AND ((r.nombre)::text = 'Administrador'::text)))))))
with check (((bucket_id = 'publicaciones'::text) AND (public.es_operador() OR (EXISTS ( SELECT 1
   FROM (public.usuarios u
     JOIN public.roles r ON ((r.id = u.rol_id)))
  WHERE ((u.auth_user_id = auth.uid()) AND (u.activo = true) AND ((r.nombre)::text = 'Administrador'::text)))))));



  create policy "Operadores y administradores pueden subir imagenes"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'publicaciones'::text) AND (public.es_operador() OR (EXISTS ( SELECT 1
   FROM (public.usuarios u
     JOIN public.roles r ON ((r.id = u.rol_id)))
  WHERE ((u.auth_user_id = auth.uid()) AND (u.activo = true) AND ((r.nombre)::text = 'Administrador'::text)))))));



  create policy "Usuarios autenticados pueden ver imagenes"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using ((bucket_id = 'publicaciones'::text));



