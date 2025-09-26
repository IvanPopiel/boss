import { create } from "zustand";
import {
  BuscarProductos,
  EditarProductos,
  EliminarProductos,
  InsertarProductos,
  MostrarProductos,
  ReportStockProductosTodos,ReportStockXProducto,ReportStockBajoMinimo,ReportInventarioEntradaSalida,ReportInventarioValorado
} from "../index";
export const useProductosStore = create((set, get) => ({
  buscador: "",
  setBuscador: (p) => {
    set({ buscador: p });
  },
  dataproductos: [],
  productoItemSelect: [],
  parametros: {},
  mostrarProductos: async (p) => {
    if (!p?.id_empresa && !p?._id_empresa) {
      console.error("❌ mostrarProductos necesita id_empresa");
      return [];
    }
  
    // Normalizamos la key para la función SQL
    const response = await MostrarProductos({
      id_empresa: p.id_empresa || p._id_empresa,
    });
  
    set({ parametros: { id_empresa: p.id_empresa || p._id_empresa } });
    set({ dataproductos: response });
    set({ productoItemSelect: [] });
    return response;
  },
  selectProductos: (p) => {
    set({ productoItemSelect: p });
  },
  insertarProductos: async (p) => {
    await InsertarProductos(p);
    const { mostrarProductos } = get();
    const { parametros } = get();
    set(mostrarProductos(parametros));
  },
  eliminarProductos: async (p) => {
    await EliminarProductos(p);
    const { mostrarProductos } = get();
    const { parametros } = get();
    console.log("parametros", parametros);
    set(mostrarProductos(parametros));
  },

  editarProductos: async (p) => {
    await EditarProductos(p);
    const { mostrarProductos } = get();
    const { parametros } = get();
    console.log("parametros", parametros);
    set(mostrarProductos(parametros));
  },
  buscarProductos: async (p) => {
    const response = await BuscarProductos(p);
    set({ dataproductos: response });
    return response;
  },
  reportStockProductosTodos: async (p) => {
    const response = await ReportStockProductosTodos(p);
    return response;
  },
  reportStockXproducto: async (p) => {
    const response = await ReportStockXProducto(p);
    return response;
  },
  reportBajoMinimo: async (p) => {
    const response = await ReportStockBajoMinimo(p);
    return response;
  },
  reportInventarioEntradaSalida: async (p) => {
    const response = await ReportInventarioEntradaSalida(p);
    return response;
  },
  reportInventarioValorado: async (p) => {
    const response = await ReportInventarioValorado(p);
    return response;
  },

}));
