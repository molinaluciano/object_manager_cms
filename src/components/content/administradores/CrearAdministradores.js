import React, { useState } from 'react'
import $  from 'jquery'
import {rutaAPI} from '../../../config/Config'
export default function CrearAdministradores() {
    /*=========================================
    HOOK PARA CAPTURAR DATOS
    =========================================== */
    const [administradores, crearAdministrador] = useState({
        usuario:"",
        password:""
    })
    /*=========================================
    OnChange
    =========================================== */
    const cambiarFormPost = e =>{
        crearAdministrador({
            ...administradores,
            [e.target.name]: e.target.value
        })
    }
    /*=========================================
    OnSubmit
    =========================================== */
    const submitPost = async e =>{
        $('.alert').remove();
        e.preventDefault();
        const {usuario, password} = administradores;
        /*==================
        VALIDAMOS QUE USUARIO NO VENGA VACIO
        =================== */
        if(usuario ===""){
            $(".invalid-usuario").show();
            $(".invalid-usuario").html("Completa este campo");
            return
        }
        /*==================
        VALIDAMOS EXPRESION REGULAR PARA USUARIO
        =================== */
        const expUsuario = /^(?=.*[A-Za-z]).{2,6}$/;
        if(!expUsuario.test(usuario)){
            $(".invalid-usuario").show();
            $(".invalid-usuario").html("Utiliza el formato solicitado");
            return
        }
         /*==================
        EJECUTAMOS SERVICIO POST
        =================== */
        const result = await postData(administradores);
        if(result.status === 400){

            $(".modal-footer").before(`<div class="alert alert-danger">${result.mensaje} </div>`)
        }
        if(result.status ===200){
            $(".modal-footer").before(`<div class="alert alert-success">${result.mensaje} </div>`)
            $('button[type="submit"]').remove();
            setTimeout(()=>{window.location.href="/";},3000)

        }








        /*==================
        VALIDAMOS QUE PASSWORD  NO VENGA VACIO
        =================== */
        if(password ===""){
            $(".invalid-password").show();
            $(".invalid-password").html("Completa este campo");
            return
        }
        /*==================
        VALIDAMOS EXPRESION REGULAR PARA PASSWORD
        =================== */
        const expPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
        if(!expPassword.test(password)){
            $(".invalid-password").show();
            $(".invalid-password").html("Utiliza el formato solicitado");
            return
        }
        //console.log(administradores)
    }
    /*=========================================
    RETORNAMOS VISTA DEL COMPONENTE
    =========================================== */
    return(
            
            <div className="modal fade" id="crearAdmin">
                <div className="modal-dialog">
                <div className="modal-content">
                
                    <div className="modal-header">
                    <h4 className="modal-title">Crear administrador</h4>
                    <button type="button" className="close" data-dismiss="modal">×</button>
                    </div>
                    <form onChange={cambiarFormPost} onSubmit={submitPost}>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="small text-secondary" htmlFor="usuario">*Minimo 2 caracteres, maximo 6, sin numeros</label>
                                <div className="input-group mb-3">
                                    <div className="input-group-append input-group-text">
                                        <i className="fas fa-user"/>
                                    </div>
                                    <input
                                        id="usuario"
                                        type="text"
                                        className="form-control text-lowercase" 
                                        name="usuario"
                                        placeholder="Ingrese el Usuario*"
                                        minLength="2"
                                        maxLength="6"
                                        pattern="(?=.*[A-Za-z]).{2,6}"
                                        required
                                        />
                                    <div className="invalid-feedback invalid-usuario"></div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="small text-secondary" htmlFor="password">*Minimo 8 caracteres, letras en minusculas, mayuscula y numeros </label>
                                <div className="input-group mb-3">
                                    <div className="input-group-append input-group-text">
                                        <i className="fas fa-key"/>
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        className="form-control" 
                                        name="password"
                                        placeholder="Ingrese la contraseña*"
                                        minLength="8"
                                        pattern="(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}"
                                        required
                                        />
                                </div>
                                <div className="invalid-feedback invalid-password"></div>

                            </div>

                        </div>
                        
                        <div className="modal-footer d-flex justify-content-between">
                            <div>
                            <button type="button" className="btn btn-danger" data-dismiss="modal">Cerrar</button>
                            </div>
                            <div>
                            <button type="submit" className="btn btn-primary"  >Enviar</button>
                            </div>
                        
                        </div>
                    </form>
                </div>
                </div>
            </div>

    )
}
/*===============================
PETICION POST ADMINISTRADORES
================================ */
const postData = data =>{
    const url = `${rutaAPI}/crear-administrador`
    const token= localStorage.getItem("ACCESS_TOKEN")
    const params ={
        method:"POST",
        body:JSON.stringify(data),
        headers: {
            "Authorization":token,
            "Content-Type":"application/json"
        }

    }
    return fetch(url, params).then(response=>{
        return response.json();
    }).then(result=>{
        return result;
    }).catch(err=>{
        return err;
    })
}