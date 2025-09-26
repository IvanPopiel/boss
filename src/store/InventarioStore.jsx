import { create } from "zustand";
import { BuscarInventario, InsertarInventario, MostrarInventario } from "../index";
export const useInventarioStore = create((set, get) => ({
  buscador: "",
  setBuscador: (p) => {
    set({ buscador: p });
  },
  dataInventario: [],
  InventarioItemSelect: [],
  parametros: {},

  insertarInventario: async (p) => {
    await InsertarInventario(p);
    const { mostrarInventario } = get();
    const { parametros } = get();
    set(mostrarInventario(parametros));
  },
  mostrarInventario: async (p) => {
    const response = await MostrarInventario(p);
    set({ parametros: p });
    set({ dataInventario: response });
    return response;
  },
  buscarInventario: async (p) => {
    const response = await BuscarInventario(p);
    set({ dataInventario: response });
    return response;
  },
}));
