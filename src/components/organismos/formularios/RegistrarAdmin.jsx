import { useEffect, useState } from "react";
import styled from "styled-components";
import { v } from "../../../styles/variables";
import {
  InputText,
  Spinner,
  useOperaciones,
  Btnsave,
  useUsuariosStore,
  useCategoriasStore,useAuthStore,
} from "../../../index";
import { useForm } from "react-hook-form";
import { CirclePicker } from "react-color";
import Emojipicker from "emoji-picker-react";
import { MdAlternateEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
export function RegistrarAdmin({ state, setState }) {
  const { insertarUsuarioAdmin } = useUsuariosStore();
  const { signInWithEmail } = useAuthStore();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);


  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
const mutation = useMutation({
  mutationFn: async (data) => {
    const p = {
      correo: data.correo,
      pass: data.pass,
      tipouser: "superadmin",
    };

    const res = await insertarUsuarioAdmin(p);

    if (!res.ok) {
      // 👇 Mostramos el error en pantalla
      setErrorMsg(res.message || "Error creando el superadmin");

      if (res.code === "email_exists") {
        const emailInput = document.querySelector("input[name='correo']");
        emailInput?.focus();
      }
      return;
    }

    // Si está todo bien
    navigate("/");
    setState(false); // cerrar modal
  },
});
  return (
    <Container>
        <ContentClose >
          <span onClick={setState}>x</span>
        </ContentClose>
      <section className="subcontainer">

      
      <div className="headers">
        <section>
          <h1>Registrar usuario</h1>
        </section>

      
      </div>

      <form className="formulario" onSubmit={handleSubmit(mutation.mutateAsync)}>
        <section>
          <article>
            <InputText icono={<MdAlternateEmail />}>
              <input  className="form__field"
                style={{ textTransform: "lowercase" }}
                type="text"
                placeholder="correo"
                {...register("correo", {
                  required: true,
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
                })}
              />
               <label className="form__label">Correo electrónico</label>
              {errors.correo?.type === "pattern" && (
                <p>Debes ingresar un formato de correo válido</p>
              )}
              {errors.correo?.type === "required" && <p>Campo requerido</p>}
            </InputText>
          </article>
          <article>
            <InputText icono={<RiLockPasswordLine />}>
              <input  className="form__field"
                type="text"
                placeholder="pass"
                {...register("pass", {
                  required: true,
                })}
              />
 <label className="form__label">Contraseña</label>
              {errors.pass?.type === "required" && <p>Campo requerido</p>}
            </InputText>
          </article>
          <div className="btnguardarContent">
            <Btnsave
              icono={<v.iconoguardar />}
              titulo="Crear cuenta"
              bgcolor="#651829"  
            />
          </div>
        </section>
      </form>

      {errorMsg && <p style={{ color: "red", marginTop: "10px" }}>{errorMsg}</p>}
      </section>
    </Container>
  );
}
const Container = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  border-radius: 20px;
  background: #fff;
  box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
  padding: 13px 36px 20px 36px;
  z-index: 100;
  display:flex;

  align-items:center;
.subcontainer{
  width: 100%;
}

  .headers {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h1 {
      font-size: 20px;
      font-weight: 500;
    }
    span {
      font-size: 20px;
      cursor: pointer;
    }
   
  }
  .formulario {
    section {
      gap: 20px;
      display: flex;
      flex-direction: column;
      .colorContainer {
        .colorPickerContent {
          padding-top: 15px;
          min-height: 50px;
        }
      }
    }
  }
`;

const ContentClose =styled.div`
  position:absolute;
  top:0;
  right:0;
  font-size:33px;
  margin:30px;
  cursor: pointer;
  
  
`