import React, { useState } from 'react'
import { rutaAPI} from '../../config/Config'
import $ from "jquery";

export default function Login() {
    /*=============================
        HOOK PARA INICIAR SESION
    ============================== */
    const [administradores, iniciarSesion]= useState(
       { usuario:'',
        password:''}
    );
    /*=======================================
        CAPTURANDO CAMBIOS DEL FORMULARIO PARA EJECUTAR LA FUNCION DEL HOOK
    ========================================= */
    const cambiaForm = (e)=>{
        iniciarSesion({
            ...administradores,[e.target.name]: e.target.value
        })

    }
    /*=============================
        EJECUTAMOS EL SUBMIT
    ============================== */
    const login = async e=>{
        $(".alert").remove();
        e.preventDefault();
        const result =  await loginAPI(administradores);
       // console.log(result)

        if(result.status !== 200){
            $("button[type='submit']").before(`<div class="alert alert-danger">${result.mensaje}</div>`)
        }else{
          localStorage.setItem("ACCESS_TOKEN", result.token)
          localStorage.setItem("ID", result.data._id)
          localStorage.setItem("USUARIO", result.data.usuario)

        window.location.href ="/";
           
        }

    }
    /*=============================
        RETORNAMOS LA VISTA
    ============================== */
    return(
        <div className="login-page" style={{minHeight:"512.391px"}}>
            <div className="login-box">
                <div className="login-logo">
                    <a href="#/"><b>CMS</b></a>
                </div>
                <div className="card">
                    <div className="card-body login-card-body">
                    <p className="login-box-msg">Llena los campos para iniciar sesion</p>
                    <form  onChange={cambiaForm} onSubmit={login}>

                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="usuario" name="usuario" />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <span className="fas fa-user"></span>
                                </div>
                            </div>
                        </div>

                        <div className="input-group mb-3">
                            <input type="password" className="form-control" placeholder="Password" name="password" />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <span className="fas fa-lock"></span>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block"> Ingresar</button>

                    </form>
                    </div>
                </div>

            </div>
        </div>
    )
}
 /*=============================
 PETICION POST PARA LOGIN
============================== */
const loginAPI = data =>{
    const url= `${rutaAPI}/login`;
    const params = {
        method:'POST',
        body: JSON.stringify(data),
        headers:{
            "Content-Type": "application/json"
        }

    }
    return fetch(url, params).then(response=>{
        return response.json();
    }).then(result =>{
        return result;
    }).catch(err=>{
        return err;
    })
}