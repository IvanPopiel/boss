import { Routes, Route } from "react-router-dom";
import {
  Login,
  Home,
  ProtectedRoute,
  Configuracion,
  Categorias,
  Productos,
  Marca,
  Personal,
  Empresa,
  Inventario,
 
  Reportes,
  StockActualPorProducto,
  StockBajoMinimo,
  InventarioEntradaSalida,
  StockInventariooValorado,
} from "../index";

import StockActualTodos from "../components/organismos/report/StockActualTodos";
import { Layout } from "../hooks/Layout";
export function MyRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <ProtectedRoute accessBy="non-authenticated">
            <Login />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute accessBy="authenticated">
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/configurar/usuarios"
        element={
          <ProtectedRoute accessBy="authenticated">
            <Layout>
              <Personal />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/configurar"
        element={
          <ProtectedRoute accessBy="authenticated">
            <Layout>
              <Configuracion />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/configurar/categorias"
        element={
          <ProtectedRoute accessBy="authenticated">
            <Layout>
              <Categorias />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/configurar/productos"
        element={
          <ProtectedRoute accessBy="authenticated">
            <Layout>
              <Productos />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/configurar/marca"
        element={
          <ProtectedRoute accessBy="authenticated">
            <Layout>
              <Marca />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/configurar/empresa"
        element={
          <ProtectedRoute accessBy="authenticated">
            <Layout>
              <Empresa />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventario"
        element={
          <ProtectedRoute accessBy="authenticated">
            <Layout>
              <Inventario />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reportes"
        element={
          <ProtectedRoute accessBy="authenticated">
            <Layout>
              <Reportes />
            </Layout>
          </ProtectedRoute>
        }
      >
        <Route path="stock-actual-todos" element={<StockActualTodos />} />
        <Route
          path="stock-actual-por-producto"
          element={<StockActualPorProducto />}
        />
        <Route path="stock-bajo-minimo" element={<StockBajoMinimo />} />
        <Route
          path="inventario-entradas-salidas"
          element={<InventarioEntradaSalida />}
        />
        <Route
          path="inventario-valorado"
          element={<StockInventariooValorado />}
        />
      </Route>
    </Routes>
  );
}
