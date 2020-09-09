import React, { useState } from 'react'
import $  from 'jquery'
import Swal from 'sweetalert2'
import {rutaAPI} from '../../../config/Config'
export default function EditarBorrarAdministradores() {
    /*=========================================
    HOOK PARA CAPTURAR DATOS
    =========================================== */
    const [administradores, editarAdministrador] = useState({
        usuario:"",
        password:"",
        id:""
    })
    /*=========================================
    OnChange
    =========================================== */
    const cambiarFormPost = e =>{
        editarAdministrador({
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
         EJECUTAMOS SERVICIO PUT
         =================== */
        const result = await putData(administradores);
        if(result.status === 400){

            $(".modal-footer").before(`<div class="alert alert-danger">${result.mensaje} </div>`)
        }
        if(result.status ===200){
            $(".modal-footer").before(`<div class="alert alert-success">${result.mensaje} </div>`)
            $('button[type="submit"]').remove();
            setTimeout(()=>{window.location.href="/";},2000)

        }


       
        /*==================
        VALIDAMOS EXPRESION REGULAR PARA PASSWORD
        =================== */
        if(password !== ""){
            const expPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
            if(!expPassword.test(password)){
                $(".invalid-password").show();
                $(".invalid-password").html("Utiliza el formato solicitado");
                return
            }
            //console.log(administradores)
        }
       
    }
    /*=========================================
    CAPTURAMOS DATOS PARA EDITAR
    =========================================== */
    $(document).on("click", ".editarInputs", function(e){
        e.preventDefault();
        let data = $(this).attr("data").split(",");
        $("#editarUsuario").val(data[0]);
        editarAdministrador({
            'usuario':$("#editarUsuario").val(),
            'password': $("#editarPassword").val(),
            'id': data[1]
        })
    })
    /*=========================================
    CAPTURAMOS DATOS PARA BORRAR
    =========================================== */
    $(document).on("click", ".borrarInput", function(e){
        e.preventDefault();
        let data = $(this).attr("data").split(",")[1];
       
        /*==================
        PREGUNTAMOS PRIMERO SI ESTAMOS SEGURO DE BORRAR ADMINISTRADOR
         =================== */
            Swal.fire({
            title: '¿Estas seguro de eliminar este registro?',
            text: "¡Si no lo está, puede cancelar la acción!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, eliminar registro!'
          }).then((result) => {
            if (result.value) {
/*==================
         EJECUTAMOS SERVICIO DELETE
         =================== */
            const borrarAdministrador = async()=>{
            const result = await deleteData(data);
            if(result.status === 400){

                Swal.fire({
                    type:"error",
                    title: result.mensaje,
                    showConfirmButton: true,
                    confirmButtonText: "Cerrar"
                }).then(function(result){
                      if(result.value){
                          window.location.href = "/"
                      }
                  })
            }
            if(result.status ===200){
                Swal.fire({
                    type:"success",
                    title: result.mensaje,
                    showConfirmButton: true,
                    confirmButtonText: "Cerrar"
                }).then(function(result){
                    if(result.value){
                        window.location.href = "/"
                    }
                })

            }
            }
            borrarAdministrador();             
             
            }
          })
         
       
    })
    /*=========================================
    RETORNAMOS VISTA DEL COMPONENTE
    =========================================== */
    return(
            
            <div className="modal fade" id="editarAdmin">
                <div className="modal-dialog">
                <div className="modal-content">
                
                    <div className="modal-header">
                    <h4 className="modal-title">Editar administrador</h4>
                    <button type="button" className="close" data-dismiss="modal">×</button>
                    </div>
                    <form onChange={cambiarFormPost} onSubmit={submitPost}>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="small text-secondary" htmlFor="editarUsuario">*Minimo 2 caracteres, maximo 6, sin numeros</label>
                                <div className="input-group mb-3">
                                    <div className="input-group-append input-group-text">
                                        <i className="fas fa-user"/>
                                    </div>
                                    <input
                                        id="editarUsuario"
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
                                <label className="small text-secondary" htmlFor="editarPassword">*Minimo 8 caracteres, letras en minusculas, mayuscula y numeros </label>
                                <div className="input-group mb-3">
                                    <div className="input-group-append input-group-text">
                                        <i className="fas fa-key"/>
                                    </div>
                                    <input
                                        id="editarPassword"
                                        type="password"
                                        className="form-control" 
                                        name="password"
                                        placeholder="Ingrese la contraseña*"
                                        minLength="8"
                                        pattern="(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}"
                                        
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
PETICION PUT ADMINISTRADORES
================================ */
const putData = data =>{
    const url = `${rutaAPI}/editar-administrador/${data.id}`
    const token= localStorage.getItem("ACCESS_TOKEN")
    const params ={
        method:"PUT",
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

/*===============================
PETICION DELETE ADMINISTRADORES
================================ */
const deleteData = data =>{
    const url = `${rutaAPI}/borrar-administrador/${data}`
    const token= localStorage.getItem("ACCESS_TOKEN")
    const params ={
        method:"DELETE",
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