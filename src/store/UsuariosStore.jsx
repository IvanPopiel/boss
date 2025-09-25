import { create } from "zustand";
import {
  EditarTemaMonedaUser,
  MostrarUsuarios,
  supabase,
  InsertarUsuarios,
  InsertarPermisos,
  MostrarUsuariosTodos,
  InsertarAsignaciones,
  Editarusuarios,
  EliminarPermisos,
  EliminarUsuarios,
} from "../index";

export const useUsuariosStore = create((set, get) => ({
  datamoduloscheck: [],
  setdatamodulosCheck: (p) => {
    set({ datamoduloscheck: p });
  },
  idusuario: 0,
  setiduser: () => {
    set({ idusuario: 0 });
  },
  datausuarios: [],
  datausuariosTodos: [],
  mostrarUsuarios: async () => {
    const response = await MostrarUsuarios();
    set({ datausuarios: response });
    if (response) {
      set({ idusuario: response.id });
      return response;
    } else {
      return [];
    }
  },
  mostrarUsuariosTodos: async (p) => {
    const response = await MostrarUsuariosTodos(p);
    set({ datausuariosTodos: response });
    return response;
  },
  editartemamonedauser: async (p) => {
    await EditarTemaMonedaUser(p);
    const { mostrarUsuarios } = get();
    set(mostrarUsuarios);
  },
  editarusuario: async (p, datacheckpermisos,idempresa) => {
    
    await Editarusuarios(p);
    const { mostrarUsuariosTodos } = get();
    await EliminarPermisos({id_usuario:p.id})
    datacheckpermisos.forEach(async (item) => {
      if (item.check) {
        let parametrospermisos = {
          id_usuario: p.id,
          idmodulo: item.id,
        };
        await InsertarPermisos(parametrospermisos);
      }
    });
    set(mostrarUsuariosTodos({_id_empresa:idempresa}));
  },
  
insertarUsuarioAdmin: async (p) => {
  try {
    // 1. Marcar que el próximo SIGNED_IN no valide estado
    localStorage.setItem("skipNextValidation", "true");

    // 2. Crear el usuario en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: p.correo,
      password: p.pass,
    });

    if (error) {
      localStorage.removeItem("skipNextValidation");
      console.error("❌ Error creando superadmin:", error.message);

      // detectar caso de correo duplicado (422)
      const isDup =
        (error.status && error.status === 422) ||
        /already.*registered/i.test(error.message);
      return {
        ok: false,
        code: isDup ? "email_exists" : "signup_error",
        message: isDup
          ? "Este correo ya está registrado."
          : error.message,
      };
    }

    // ⚡ 3. Insertar también en la tabla usuarios
    await InsertarUsuarios({
      idauth: data.user.id,
      fecharegistro: new Date(),
      tipouser: p.tipouser,
      estado: "activo", // 👈 importantísimo
      correo: p.correo,
    });

    // 4. Retornar un objeto estructurado
    return { ok: true, user: data.user };

  } catch (e) {
    console.error("❌ Error inesperado en insertarUsuarioAdmin:", e);
    return { ok: false, code: "unexpected", message: e.message };
  }
},



insertarUsuario: async (parametrosAuth, p, datacheckpermisos) => {
  try {
    // 1. Validar si ya existe en tu tabla usuarios (evitar duplicados externos)
    const { data: existing, error: checkError } = await supabase
      .from("usuarios")
      .select("id")
      .eq("correo", parametrosAuth.correo)
      .maybeSingle();

    if (checkError) {
      console.error("❌ Error verificando correo en usuarios:", checkError);
      return { ok: false, code: "check_error", message: "Error verificando correo" };
    }

    if (existing) {
      return { ok: false, code: "email_exists", message: "El correo ya está registrado en otro usuario." };
    }

    // 2. Marcar que es creación para que AuthContext lo ignore
    localStorage.setItem("skipNextValidation", "true");

    // 3. Crear en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: parametrosAuth.correo,
      password: parametrosAuth.pass,
    });

    if (error) {
      console.error("❌ Error creando usuario:", error.message);

      // Detectar duplicado en Auth
      const isDup = error.status === 422 || /registered/i.test(error.message);
      return {
        ok: false,
        code: isDup ? "email_exists" : "signup_error",
        message: isDup ? "El correo ya está registrado en Auth." : error.message,
      };
    }

    // 4. Forzar cierre de sesión del usuario recién creado
    await supabase.auth.signOut();

    // 5. Insertar en tabla usuarios
    const dataUserNew = await InsertarUsuarios({
      nombres: p.nombres,
      nro_doc: p.nrodoc,
      telefono: p.telefono,
      direccion: p.direccion,
      fecharegistro: new Date(),
      estado: "activo",
      idauth: data.user.id,
      tipouser: p.tipouser,
      tipodoc: p.tipodoc,
      correo: parametrosAuth.correo, // 👈 importante guardar el correo también
    });

    if (!dataUserNew) {
      console.error("❌ No se pudo insertar en tabla usuarios");
      return { ok: false, code: "insert_error", message: "Error insertando usuario en tabla interna" };
    }

    // 6. Insertar asignación empresa
    await InsertarAsignaciones({
      id_empresa: p.id_empresa,
      id_usuario: dataUserNew.id,
    });

    // 7. Insertar permisos
    for (const item of datacheckpermisos) {
      if (item.check) {
        await InsertarPermisos({
          id_usuario: dataUserNew.id,
          idmodulo: item.id,
        });
      }
    }

    console.log("✅ Usuario creado correctamente:", dataUserNew);

    // 8. Restaurar sesión del superadmin
    const superAdminEmail = localStorage.getItem("superadmin_email");
    const superAdminPass = localStorage.getItem("superadmin_pass");

    if (superAdminEmail && superAdminPass) {
      await supabase.auth.signInWithPassword({
        email: superAdminEmail,
        password: superAdminPass,
      });
    } else {
      await supabase.auth.signOut(); // fallback
    }

    return { ok: true, user: data.user };

  } catch (e) {
    console.error("❌ Error inesperado en insertarUsuario:", e);
    return { ok: false, code: "unexpected", message: e.message };
  }
},




  eliminarUsuario: async (p) => {
  try {
    // 1. Eliminar sus permisos
    await EliminarPermisos({ id_usuario: p.id });

    // 2. Eliminar al usuario de la tabla usuarios
    // (asumo que ya tenés una función EliminarUsuarios en tu index.js)
    await EliminarUsuarios({ id: p.id });

    // 3. Refrescar la lista de usuarios
    const { mostrarUsuariosTodos } = get();
    // ojo: asegurate de pasar el id_empresa correcto
    if (p.id_empresa) {
      await mostrarUsuariosTodos({ _id_empresa: p.id_empresa });
    }
  } catch (error) {
    console.error("❌ Error eliminando usuario:", error);
  }
},
}));
