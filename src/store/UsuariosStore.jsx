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
    //creando el correo y pass

    await supabase.auth.signUp({
      email: p.correo,
      password: p.pass,
    });
    const { data, error } = await supabase.auth.signInWithPassword({
      email: p.correo,
      password: p.pass,
    });
    if (error) {
      return null;
    }
    await InsertarUsuarios({
      idauth: data.user.id,
      fecharegistro: new Date(),
      tipouser: p.tipouser,
    });

    return data.user;
  },

insertarUsuario: async (parametrosAuth, p, datacheckpermisos) => {
  try {
    // 1. Guardar la sesión actual (superadmin)
    const { data: currentSession } = await supabase.auth.getSession();

    // 2. Crear en Supabase Auth (esto cambia la sesión automáticamente al usuario creado)
    const { data, error } = await supabase.auth.signUp({
      email: parametrosAuth.correo,
      password: parametrosAuth.pass,
    });

    if (error) {
      console.error("❌ Error creando usuario en Auth:", error.message);
      return null;
    }

    // 3. Insertar en tabla usuarios
    const dataUserNew = await InsertarUsuarios({
      nombres: p.nombres,
      nro_doc: p.nrodoc,
      telefono: p.telefono,
      direccion: p.direccion,
      fecharegistro: new Date(),
      estado: "activo", // ✅ activo desde el inicio
      idauth: data.user.id,
      tipouser: p.tipouser,
      tipodoc: p.tipodoc,
    });

    if (!dataUserNew) {
      console.error("❌ No se pudo insertar el usuario en la tabla usuarios");
      return null;
    }

    // 4. Insertar asignación empresa
    await InsertarAsignaciones({
      id_empresa: p.id_empresa,
      id_usuario: dataUserNew.id,
    });

    // 5. Insertar permisos
    for (const item of datacheckpermisos) {
      if (item.check) {
        await InsertarPermisos({
          id_usuario: dataUserNew.id,
          idmodulo: item.id,
        });
      }
    }

    console.log("✅ Usuario creado correctamente:", dataUserNew);

    // 6. Restaurar sesión del superadmin
    if (currentSession?.session) {
      await supabase.auth.setSession(currentSession.session);
      console.log("🔄 Sesión de superadmin restaurada");
    }

    return data.user; // devolvemos el usuario de Auth creado
  } catch (error) {
    console.error("❌ Error en insertarUsuario:", error);
    return null;
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
