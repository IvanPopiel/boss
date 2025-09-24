import Swal from "sweetalert2";
import { ObtenerIdAuthSupabase, supabase, usePermisosStore } from "../index";

export const InsertarUsuarios = async (p) => {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .insert(p)
      .select()
      .maybeSingle();

    console.log("📥 parametros del user:", p);

    if (error) {
      console.error("❌ Error al insertar usuario en Supabase:", error.message, error.details);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al insertar usuario: " + error.message,
        footer: '<a href="">Ver detalles en consola</a>',
      });
      return null; // 👈 cortamos acá si falló
    }

    if (data) {
      console.log("✅ Usuario insertado:", data);
      return data;
    }

    return null;
  } catch (error) {
    console.error("⚠️ Excepción inesperada en InsertarUsuarios:", error);
    return null;
  }
};
export const InsertarAsignaciones = async (p) => {
  try {
    const { error } = await supabase.from("asignarempresa").insert(p);
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al insertar asignacion " + error.message,
        footer: '<a href="">error</a>',
      });
    }
  } catch (error) {}
};
export const MostrarUsuarios = async () => {
  try {
    const idAuthSupabase = await ObtenerIdAuthSupabase();
    const { error, data } = await supabase
      .from("usuarios")
      .select()
      .eq("idauth", idAuthSupabase)
      .maybeSingle();
    if (data) {
      console.log("demoledor idauth", idAuthSupabase);
      return data;
    }
  } catch (error) {}
};
export const MostrarUsuariosTodos = async (p) => {
  try {
    const { error, data } = await supabase.rpc("mostrarpersonal", {
      _id_empresa: p._id_empresa,
    });
    if (data) {
      return data;
    }
  } catch (error) {}
};
export async function EditarTemaMonedaUser(p) {
  try {
    const { error } = await supabase.from("usuarios").update(p).eq("id", p.id);
    if (error) {
      alert("Error al editar usuarios", error);
    }
    Swal.fire({
      icon: "success",
      title: "Datos modificados",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    alert(error.error_description || error.message + "EditarTemaMonedaUser");
  }
}
export async function Editarusuarios(p) {
  try {
    
    const { data, error } = await supabase
      .from("usuarios")
      .update(p)
      .eq("id", p.id);
    console.log("parametros user edit", error.message);
    // if (error) {
    // return  alert("Error al editar usuarios !!!", error.message);
    // }
    if (data) {
      Swal.fire({
        icon: "success",
        title: "Datos modificados",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    return data;
  } catch (error) {
    // alert(error.error_description || error.message + "EditarTemaMonedaUser");
  }
}
export async function EliminarUsuarios(p) {
  try {
    const { error } = await supabase
      .from("usuarios")
      .delete()
      .eq("id", p.id); // 👈 asegurate que tu PK sea "id"

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al eliminar usuario " + error.message,
        footer: '<a href="">error</a>',
      });
      throw error;
    }

    Swal.fire({
      icon: "success",
      title: "Usuario eliminado",
      showConfirmButton: false,
      timer: 1500,
    });

    return true;
  } catch (error) {
    console.error("❌ Error en EliminarUsuarios:", error);
    return false;
  }
}
