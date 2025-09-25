import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../index";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 Evento recibido:", event);

        if (!session?.user) {
          setUser(null);
          return;
        }

        // ⏭️ Saltar validación si venís de creación
        if ((event === "SIGNED_IN" || event === "SIGNED_UP") && localStorage.getItem("skipNextValidation")) {
          console.log("⏭️ Skip validación inicial");
          localStorage.removeItem("skipNextValidation");
          setUser(session.user);
          return;
        }

        // Consultar tabla usuarios
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
          await supabase.auth.signOut();
          setUser(null);
          console.warn("⚠️ Usuario inactivo, sesión cerrada");
          return;
        }

        setUser(session.user);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 👇 Método de logout exportado
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      localStorage.removeItem("skipNextValidation");
    }
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => useContext(AuthContext);
