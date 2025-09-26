import { supabase } from "../index";
import Swal from "sweetalert2";
const tabla = "productos";

// ========================
// CRUD BASE
// ========================

export async function InsertarProductos(p) {
  try {
    const { error } = await supabase.rpc("insertarproductos", p);
    if (error) {
      console.log("parametros", p);
      console.log("error", error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
        footer: '<a href="">Agregue una nueva descripción</a>',
      });
    }
  } catch (error) {
    throw error;
  }
}

export async function MostrarProductos(p) {
  try {
    const { data, error } = await supabase.rpc("mostrarproductos", {
      _id_empresa: p.id_empresa,
    });
    if (error) {
      console.error("Error MostrarProductos:", error.message);
      return [];
    }
    return data;
  } catch (error) {
    console.error("Excepción MostrarProductos:", error);
    return [];
  }
}

export async function EliminarProductos(p) {
  try {
    const { error } = await supabase.from(tabla).delete().eq("id", p.id);
    if (error) {
      alert("Error al eliminar", error.message);
    }
  } catch (error) {
    alert(error.error_description || error.message + " eliminar productos");
  }
}

export async function EditarProductos(p) {
  try {
    const { error } = await supabase.from(tabla).update(p).eq("id", p.id);
    if (error) {
      alert("Error al editar producto", error.message);
    }
  } catch (error) {
    alert(error.error_description || error.message + " editar productos");
  }
}

export async function BuscarProductos(p) {
  try {
    console.log("📌 Params recibidos en BuscarProductos:", p);

    const { data, error } = await supabase.rpc("buscarproductos", {
      _id_empresa: p.id_empresa,
      buscador: p.buscador || ""
    });

    if (error) {
      console.error("Error BuscarProductos:", error.message);
      return [];
    }

    console.log("📦 Datos devueltos por buscarproductos:", data);
    return data;
  } catch (error) {
    console.error("Excepción BuscarProductos:", error);
    return [];
  }
}



// ========================
// REPORTES
// ========================

export async function ReportStockProductosTodos(p) {
  const { data, error } = await supabase.rpc("mostrarproductos", {
    _id_empresa: p.id_empresa,
  });
  if (error) {
    console.error("Error ReportStockProductosTodos:", error.message);
    return [];
  }
  return data;
}
export async function ReportStockXProducto(p) {
  const { data, error } = await supabase.rpc("mostrarproductos", {
    _id_empresa: p.id_empresa,
  });
  if (error) {
    console.error("Error ReportStockXProducto:", error.message);
    return [];
  }
  // filtro por producto en el front
  return data.filter((prod) => prod.id === p.id);
}


export async function ReportStockBajoMinimo(p) {
  const { data, error } = await supabase.rpc("reportproductosbajominimo", {
    _id_empresa: p.id_empresa,
  });
  if (error) {
    console.error("Error ReportStockBajoMinimo:", error.message);
    return [];
  }
  return data;
}

export async function ReportInventarioEntradaSalida(p) {
  const { data, error } = await supabase.rpc("mostrarinventarioempresa", {
    _id_empresa: p._id_empresa,   // 👈 nombre exacto del parámetro SQL
  });

  if (error) {
    console.error("Error ReportInventarioEntradaSalida:", error.message);
    return [];
  }

  // Si querés filtrar por producto, hacelo en el front:
  return p._id_producto
    ? data.filter((mov) => mov.id_producto === p._id_producto)
    : data;
}

export async function ReportInventarioValorado(p) {
  const { data, error } = await supabase.rpc("inventariovalorado", {
    _id_empresa: p.id_empresa,
  });
  if (error) {
    console.error("Error ReportInventarioValorado:", error.message);
    return [];
  }
  return data;
}
