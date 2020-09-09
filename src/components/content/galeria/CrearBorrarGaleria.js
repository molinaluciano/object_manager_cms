import React, {useState} from 'react'
import $ from 'jquery'
import 'datatables.net';
import 'datatables.net-bs4'
import 'datatables.net-responsive'
import { rutaAPI} from '../../../config/Config'
import notie from 'notie'
import 'notie/dist/notie.css'
import Swal from 'sweetalert2'
export default function CrearBorrarGaleria() {
    /*==============================================
    HOOK State para capturar datos
    =============================================== */
    const [galeria, crearGaleria] = useState({
        foto:null
        
    })
      /*==============================================
    ON CHANGE
    =============================================== */
    const cambiarFormPost = e =>{
        let fotos =$("#foto").get(0).files;
       
        //FOR PARA RECORRER CADA UNO DE LOS ARCHIVOS QUE SUBIERON
        for(let i = 0; i< fotos.length; i++){
            /*==============================================
            VALIDAMOS EL FORMATO DE LA fotos SEA JPG O PNG
            =============================================== */
            if(fotos[i]["type"] !== "image/jpeg" && fotos[i]["type"] !== "image/png"){
                $("#foto").val("");
                notie.alert({
                    type: 3, // optional, default = 4, enum: [1, 2, 3, 4, 5, 'success', 'warning', 'error', 'info', 'neutral']
                    text: "ERROR FORMATO JPG O PNG",
                    time: 7, // optional, default = 3, minimum = 1,
                })
                $(".vistaGaleria").html("")
            
                return;

            }else if(fotos[i]["size"]>2000000){
                $("#foto").val("");
                notie.alert({
                    type: 3, // optional, default = 4, enum: [1, 2, 3, 4, 5, 'success', 'warning', 'error', 'info', 'neutral']
                    text: "ERROR LA foto DEBE PESARR 2MB",
                    time: 7, // optional, default = 3, minimum = 1,
                })
                $(".vistaGaleria").html("")
                return;

            }else{
                let datosArchivo = new FileReader();
                datosArchivo.readAsDataURL(fotos[i]);
                $(datosArchivo).on("load",function(event){
                    let rutaArchivo = event.target.result;
                    $(".vistaGaleria").append(`
                        <div class="col-6 pt-2"> 
                            <img src="${rutaArchivo}" class="img-fluid"/>
                        </div>
                    `)
                    //console.log(rutaArchivo)
                    crearGaleria({
                        'foto':fotos
                    })
                })
            }
        }    
    }
    /*==============================================
    ON SUBMIT
    =============================================== */
    const submitPost = async e =>{
        
        e.preventDefault();
        const {foto}= galeria;

        for(let i = 0; i< foto.length; i++){
            $('.alert').remove();
            /*==============================================
            Validamos si no viene imagen SLIDE
            =============================================== */
            if(foto[i] === null){
                $(".invalid-imagen").show();
                $(".invalid-imagen").html("Este campo no puede ir vacío")
                return;
            }
            
            /*==============================================
                EJECUTANDO SERVICIOS POST
            =============================================== */
            const result = await postData(foto[i]);
            console.log(result)
            if(result.status === 400){
                $(".modal-footer").before(`<div class="alert alert-danger">${result.mensaje} </div>`)
            }
            if(result.status ===200){
                $(".modal-footer").before(`<div class="alert alert-success">${result.mensaje} </div>`)
                $('button[type="submit"]').remove();
                setTimeout(()=>{window.location.href="/galeria";},3000)

            }
        }    
    }
     /*==============================================
    LIMPIAR FORMULARIO
    =============================================== */
    $(document).on("click",".limpiarFormulario", function(){
        $(".modal").find("form")[0].reset()
        $(".vistaGaleria").html("")

    })
    /*==============================================
    CAPTURAMOS DATOS PARA BORRAR REGISTRO
    =============================================== */ 
    $(document).on("click",".borrarRegistro", function(e){
        e.preventDefault();
        let data = $(this).attr("data");
        console.log(data)
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
            const borrarGaleria = async()=>{
            const result = await deleteData(data);
            if(result.status === 400){

                Swal.fire({
                    type:"error",
                    title: result.mensaje,
                    showConfirmButton: true,
                    confirmButtonText: "Cerrar"
                }).then(function(result){
                      if(result.value){
                          window.location.href = "/galeria"
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
                        window.location.href = "/galeria"
                    }
                })

            }
            }
            borrarGaleria();             
             
            }
          })
    })
    /*==============================================
    RETORNO DE LA VISTA
    =============================================== */
    return (
        <div className="modal fade" id="crearFoto">
            <div className="modal-dialog">
                    <div className="modal-content">
                    
                        <div className="modal-header">
                            <h4 className="modal-title">Crear Galeria</h4>
                            <button type="button" className="close" data-dismiss="modal">×</button>
                        </div>
                
                    <form onChange={cambiarFormPost} onSubmit={submitPost} encType="multipart/form-data">

                            <div className="modal-body">
                                {/*ENTRADA FOTOS */}     
                                <div className="form-group">
                                    <label className="small text-secondary" htmlFor="foto">*(Campo Obligatorio)* Peso Max. 2MB | Formato: JPG o PNG</label>
                                    <input
                                        id="foto"
                                        type="file"
                                        className="form-control-file border"
                                        name="foto"
                                        multiple
                                        required
                                    />
                                    <div className="invalid-feedback invalid-foto"></div>
                                    <div className="vistaGaleria row"></div>
                                </div>
                            </div>
                        <div className="modal-footer d-flex justify-content-between">
                        <div>
                        <button type="button" className="btn btn-danger" data-dismiss="modal">Cerrar</button>
                        </div>
                        <div>
                        <button type="submit" className="btn btn-primary"  >Guardar</button>
                        </div>
                    
                    </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
/*===============================
PETICION POST SLIDE
================================ */
const postData = data =>{
    const url = `${rutaAPI}/crear-galeria`
    const token= localStorage.getItem("ACCESS_TOKEN")
    let formData = new FormData();
    formData.append("archivo", data)
   

    const params ={
        method:"POST",
        body:formData,
        headers: {
            "Authorization":token
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
PETICION DELETE SLIDE
================================ */
const deleteData = data =>{
    const url = `${rutaAPI}/borrar-galeria/${data}`
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