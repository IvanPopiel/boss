import { useQuery } from "@tanstack/react-query";

import { useCategoriasStore } from "../store/CategoriasStore";
import { useEmpresaStore } from "../store/EmpresaStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { ProductosTemplate } from "../components/templates/ProductosTemplate";
import { useProductosStore } from "../store/ProductosStore";
import { useMarcaStore } from "../store/MarcaStore";
import { InventarioTemplate } from "../components/templates/InventarioTemplate";
import { useInventarioStore } from "../store/InventarioStore";
import { usePermisosStore, BloqueoPagina } from "../index";
export function Inventario() {
  const { datapermisos } = usePermisosStore();
  const statePermiso = datapermisos.some((objeto) =>
    objeto.modulos.nombre.includes("Inventario")
  );


  const { mostrarProductos, dataproductos, buscador, buscarProductos } =
    useProductosStore();
  const {
    mostrarInventario,
    buscarInventario,
    buscador: buscadorinventario,
  } = useInventarioStore();
  const { mostrarMarca } = useMarcaStore();
  const { dataempresa } = useEmpresaStore();
  const { data, isLoading, error } = useQuery({
    queryKey: ["mostrar productos", dataempresa.id],
    queryFn: () => mostrarProductos({ _id_empresa: dataempresa.id }),
    enabled: dataempresa.id != null,
  });
  //buscador productos
  const { data: buscar } = useQuery({
    queryKey: ["buscar productos", buscador],
    queryFn: () =>
      buscarProductos({ descripcion: buscador, id_empresa: dataempresa.id }),
    enabled: dataempresa.id != null,
  });

  //mostrar Inventario
  const { data: datainventario } = useQuery({
    queryKey: ["mostrar Inventario", dataempresa.id],
    queryFn: () => mostrarInventario({ id_empresa: dataempresa.id }),
    enabled: dataempresa.id != null,
  });
  //buscador Inventario
  const { data: buscarinventario } = useQuery({
    queryKey: ["buscar Inventario", buscadorinventario],
    queryFn: () =>
      buscarInventario({ buscador: buscadorinventario, id_empresa: dataempresa.id }),
    enabled: dataempresa.id != null,
  });
  //respuestas
  if (isLoading) {
    return <SpinnerLoader />;
  }
  if (error) {
    return <span>Error...</span>;
  }
  if (statePermiso == false) return <BloqueoPagina state={statePermiso}/>;
  return <InventarioTemplate data={dataproductos} />;
}
