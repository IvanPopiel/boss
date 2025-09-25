import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../index";
import Swal from "sweetalert2";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

useEffect(() => {
  const { data: authListener } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (!session?.user) {
        setUser(null);
        return;
      }

      if (event === "SIGNED_IN" || event === "SIGNED_UP") {
        const skip = localStorage.getItem("skipNextValidation");
        if (skip) {
          console.log("⏭️ Skip validación porque el usuario recién fue creado");
          localStorage.removeItem("skipNextValidation");
          setUser(session.user)
          return;
        }
      }

      // Consultar en tu tabla usuarios el estado
      const { data: userData, error } = await supabase
        .from("usuarios")
        .select("estado")
        .eq("idauth", session.user.id)
        .maybeSingle();

      if (error) {
        console.error("❌ Error verificando estado:", error);
        setUser(null);
        return;
      }

      if (!userData || userData.estado === "inactivo") {
        Swal.fire({
          icon: "error",
          title: "Acceso denegado",
          text: "Tu cuenta está inactiva. Por favor, contacta al administrador.",
          confirmButtonColor: "#d33",
        });

        await supabase.auth.signOut();
        setUser(null);
        console.warn("⚠️ Usuario inactivo, sesión cerrada");
        return;
      }

      setUser(session.user);
      console.log("✅ Usuario activo", session.user);
    }
  );

  return () => {
    authListener.subscription;
  };
}, []);


  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
