import { useQuery } from "@tanstack/react-query";
import { useCategoriasStore } from "../store/CategoriasStore";
import { useEmpresaStore } from "../store/EmpresaStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { ProductosTemplate } from "../components/templates/ProductosTemplate";
import { useProductosStore } from "../store/ProductosStore";
import { useMarcaStore } from "../store/MarcaStore";
import { usePermisosStore, BloqueoPagina } from "../index";

export function Productos() {
  const { datapermisos } = usePermisosStore();
  const statePermiso = datapermisos.some((objeto) =>
    objeto.modulos.nombre.includes("Productos")
  );

  // if (!statePermiso) {
  //   return <BloqueoPagina state={statePermiso} />;
  // }

  const {
    mostrarProductos,
    dataproductos,
    buscador,          // 👈 estado global del buscador
    buscarProductos,
  } = useProductosStore();

  const { mostrarCategorias } = useCategoriasStore();
  const { mostrarMarca } = useMarcaStore();
  const { dataempresa } = useEmpresaStore();

  // mostrar productos
  const { isLoading, error } = useQuery({
    queryKey: ["mostrar productos", dataempresa?.id],
    queryFn: () => mostrarProductos({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
  });

  // buscar productos
  const { data: dataBuscar } = useQuery({
    queryKey: ["buscar productos", buscador],
    queryFn: () =>
      buscarProductos({
        buscador: buscador,          // 👈 ahora coincide con el SQL
        id_empresa: dataempresa?.id,
      }),
    enabled: !!dataempresa,
  });

  // mostrar marcas
  useQuery({
    queryKey: ["mostrar marcas", dataempresa?.id],
    queryFn: () => mostrarMarca({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
  });

  // mostrar categorias
  useQuery({
    queryKey: ["mostrar categorias", dataempresa?.id],
    queryFn: () => mostrarCategorias({ idempresa: dataempresa?.id }),
    enabled: !!dataempresa,
  });

  if (isLoading) {
    return <SpinnerLoader />;
  }

  if (error) {
    return <span>Error...</span>;
  }

  return (
    <>
      <ProductosTemplate data={buscador ? dataBuscar || [] : dataproductos || []} />
    </>
  );
}
