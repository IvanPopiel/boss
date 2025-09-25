import { create } from "zustand";
import { BuscarInventario, InsertarInventario, MostrarInventario } from "../index";
import { supabase } from "../supabase/supabase.config";
import Swal from "sweetalert2";

export const useInventarioStore = create((set, get) => ({
  buscador: "",
  setBuscador: (p) => {
    set({ buscador: p });
  },
  datainventario: [],
  inventarioItemSelect: [],
  parametros: {},

  insertarInventario: async (p) => {
    // 1. Traer stock actual y mínimo del producto
    const { data: producto, error } = await supabase
      .from("productos")
      .select("stock, stock_minimo, descripcion")
      .eq("id", p.id_producto)
      .single();

    if (!error && producto) {
      let stockFinal =
        p.tipo === "entrada"
          ? Number(producto.stock) + Number(p.cantidad)
          : Number(producto.stock) - Number(p.cantidad);

      // 2. Validar si va a quedar por debajo del mínimo
      if (stockFinal < producto.stock_minimo) {
        Swal.fire({
          icon: "warning",
          title: "Stock bajo el mínimo",
          text: `El producto "${producto.descripcion}" quedará en ${stockFinal} (Stock mínimo: ${producto.stock_minimo}).`,
        });
      }
    }

    // 3. Insertar el movimiento igualmente
    await InsertarInventario(p);

    // 4. Refrescar inventario
    const { mostrarInventario } = get();
    const { parametros } = get();
    set(mostrarInventario(parametros));
  },

  mostrarInventario: async (p) => {
    const response = await MostrarInventario(p);
    set({ parametros: p });
    set({ datainventario: response });
    return response;
  },
  buscarInventario: async (p) => {
    const response = await BuscarInventario(p);
    set({ datainventario: response });
    return response;
  },
}));
