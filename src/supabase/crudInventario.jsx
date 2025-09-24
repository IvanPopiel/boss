import { supabase } from "../index";
import Swal from "sweetalert2";
export async function InsertarInventario(p) {
  const { error } = await supabase.from("inventario").insert(p);
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message,
      footer: '<a href="">...</a>',
    });
  }
}

export async function MostrarInventario(p) {
  const { data } = await supabase
    .rpc("mostrarinventarioempresa", {
      _id_empresa: p.id_empresa,
    })
    .order("id", { ascending: false });
  return data;
}
export async function BuscarInventario(p) {
  const { data } = await supabase
    .rpc("buscarinventarioempresa", {
      _id_empresa: p.id_empresa,
      buscador: p.buscador,
    })
    .order("id", { ascending: false });
  return data;
}
