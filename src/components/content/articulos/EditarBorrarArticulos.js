import React, {useState} from 'react'
import $ from 'jquery'
import notie from 'notie'
import { rutaAPI} from '../../../config/Config'
import Swal from 'sweetalert2'
import 'summernote/dist/summernote-lite'
import 'summernote/dist/summernote-lite.css'
export default function EditarBorrarArticulos(){
    /*==============================================
    HOOK State para capturar datos
    =============================================== */
    const [articulo, editarArticulo] = useState({
        portada:null,
        titulo:"",
        intro:"",
        url:"",
        contenido:"",
        id:""
    })
    /*==============================================
    ON CHANGE
    =============================================== */

    const cambiarFormPut = e =>{
        if($("#editarPortada").val()){
            let portada =$("#editarPortada").get(0).files[0];
                /*==============================================
                VALIDAMOS EL FORMATO DE LA IMAGEN SEA JPG O PNG
                =============================================== */
                if(portada["type"] !== "image/jpeg" && portada["type"] !== "image/png"){
                    $("#editarPortada").val("");
                    notie.alert({
                        type: 3, // optional, default = 4, enum: [1, 2, 3, 4, 5, 'success', 'warning', 'error', 'info', 'neutral']
                        text: "ERROR FORMATO JPG O PNG",
                        time: 7, // optional, default = 3, minimum = 1,
                    })
                    $(".previsualizarImg").attr("src","")
                
                    return;

                }else if(portada["size"]>2000000){
                    $("#editarPortada").val("");
                    notie.alert({
                        type: 3, // optional, default = 4, enum: [1, 2, 3, 4, 5, 'success', 'warning', 'error', 'info', 'neutral']
                        text: "ERROR LA PORTADA DEBE PESAR HASTA 2MB",
                        time: 7, // optional, default = 3, minimum = 1,
                    })
                    $(".previsualizarImg").attr("src","")
                    return;

                }else{
                    let datosArchivo = new FileReader();
                    datosArchivo.readAsDataURL(portada);
                    $(datosArchivo).on("load",function(event){
                        let rutaArchivo = event.target.result;
                        $(".previsualizarImg").attr("src",rutaArchivo)
                        //console.log(rutaArchivo)
                        editarArticulo({
                            'portada':portada,
                            'titulo': $("#editarTitulo").val(),
                            'intro': $("#editarIntro").val(),
                            'url': articulo.url,
                            'contenido': $("#editarContenido").val(),
                            'id':$("#idArticulo").val()
                        })
                    })
                }
        }else{
            editarArticulo({
                'portada':null,
                'titulo': $("#editarTitulo").val(),
                'intro': $("#editarIntro").val(),
                'url': articulo.url,
                'contenido': $("#editaContenido").val(),
                'id':$("#idArticulo").val()
            })
        }
    }
   /*==============================================
    ON SUBMIT
    =============================================== */
    const submitPut = async e =>{
        $('.alert').remove();
        e.preventDefault();
        articulo.contenido =$("#editarContenido").val()
        const { titulo, intro,  contenido}= articulo;
  
        /*==============================================
        VALIDAMS QUE EL CAMPO TITULO NO VENGA VACIO
        =============================================== */
        if(titulo===""){
            $(".invalid-titulo").show();
            $(".invalid-titulo").html("El titulo no puede ir vacio")
            return;
        }
        /*==============================================
        Validamos expresion regular para el TITULO 
        =============================================== */
        if(titulo !== ""){
            const expTitulo = /^([0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]).{1,30}$/
            if(!expTitulo.test(titulo)){
                $(".invalid-titulo").show();
                $(".invalid-titulo").html("Utiliza el forma que coincida con el solicitado para el titulo")
                return;
            }
            
        }
        /*==============================================
        VALIDAMS QUE EL CAMPO intro NO VENGA VACIO
        =============================================== */
        if(intro===""){
            $(".invalid-intro").show();
            $(".invalid-intro").html("El intro no puede ir vacia")
            return;
        }
        /*==============================================
        Validamos expresion regular para el intro 
        =============================================== */
        if(intro !== ""){
            const expIntro = /^([(\\)\\=\\&\\$\\-\\_\\*\\<\\>\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]).{1,300}$/
            if(!expIntro.test(intro)){
                $(".invalid-intro").show();
                $(".invalid-intro").html("Utiliza el formato que coincida con el solicitado para la intro")
                return;
            }
            
        }
        /*==============================================
        VALIDAMS QUE EL CAMPO contenido NO VENGA VACIO
        =============================================== */
        if(contenido===""){
            $(".invalid-contenido").show();
            $(".invalid-contenido").html("El contenido no puede ir vacio")
            return;
        }
        /*==============================================
        Validamos expresion regular para el contenido 
        =============================================== */
        if(contenido !== ""){
            const expContenido = /^([(\\)\\=\\&\\$\\-\\_\\*\\<\\>\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]).{1,}$/
            if(!expContenido.test(contenido)){
                $(".invalid-contenido").show();
                $(".invalid-contenido").html("Utiliza el formato que coincida con el solicitado para el contenido´")
                return;
            }
            
        }
        /*==============================================
            EJECUTANDO SERVICIOS PUT
        =============================================== */
        const result = await putData(articulo);
        console.log(result)
        if(result.status === 400){
            $(".modal-footer").before(`<div class="alert alert-danger">${result.mensaje} </div>`)
        }
        if(result.status ===200){
            $(".modal-footer").before(`<div class="alert alert-success">${result.mensaje} </div>`)
            $('button[type="submit"]').remove();
            setTimeout(()=>{window.location.href="/articulos";},3000)

        }
    }
    /*==============================================
    CAPTURAMOS DATOS PARA EDITAR
    =============================================== */   
    $(document).on("click",".editarInputs", function(e){
        e.preventDefault();
        let data = $(this).attr("data").split("_,"); 
        console.log(data)
        $("#idArticulo").val(data[0]);
        $(".previsualizarImg").attr("src",`${rutaAPI}/mostrar-img-articulo/${data[4]}+${data[1]}`);
        $("#editarTitulo").val(data[2])
        $("#editarIntro").val(data[3])
        $("#editarUrl").val(data[4])
        $("#editarContenido").val(data[5]);
        $("#editarContenido").summernote({
            height:350
        });
        editarArticulo({
            'portada':null,
            'titulo': data[2],
            'intro': data[3],
            'url': data[4],
            'contenido': data[5],
            'id':data[0]
        })
    })
   
     /*==============================================
    CAPTURAMOS DATOS PARA BORRAR REGISTRO
    =============================================== */ 
    $(document).on("click",".borrarRegistro", function(e){
        e.preventDefault();
        let data = $(this).attr("data").split("_,")[0];
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
            const borrarArticulo = async()=>{
            const result = await deleteData(data);
            //console.log(result)
            if(result.status === 400){

                Swal.fire({
                    type:"error",
                    title: result.mensaje,
                    showConfirmButton: true,
                    confirmButtonText: "Cerrar"
                }).then(function(result){
                      if(result.value){
                          window.location.href = "/articulos"
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
                        window.location.href = "/articulos"
                    }
                })

            }
            }
            borrarArticulo();             
             
            }
          })
    })
    /*==============================================
    RETORNO DE LA VISTA
    =============================================== */
    return(
        <div className="modal fade" id="editarArticulos">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title ">Editar Articulo</h4>
                        <button type="button" className="close" data-dismiss="modal">×</button>
                    </div>
                    <form  onChange={cambiarFormPut} onSubmit={submitPut} encType="multipart/form-data" method="post">
                    <input type="hidden" id="idArticulo"/>
                        <div className="modal-body">
                            {/*ENTRADA PORTADA */}     
                            <div className="form-group">
                                <label className="small text-secondary" htmlFor="editarPortada">*(Campo Obligatorio)* Peso Max. 2MB | Formato: JPG o PNG</label>
                                <input
                                    id="editarPortada"
                                    type="file"
                                    className="form-control-file border"
                                    name="portada"
                                    
                                />
                                <div className="invalid-feedback invalid-imagen"></div>
                                <img className="previsualizarImg img-fluid" alt=""/>
                            </div>
                            {/*URL */}
                            <div className="form-group">
                                <label className="small text-secondary" htmlFor="editarUrl"> *La URL no se puede modificar*</label>
                                <div className="input-group mb-3">
                                    <div className="input-group-append input-group-text">
                                    <i className="fas fa-link"></i>                           
                                    </div>
                                
                                    <input
                                        id="editarUrl"
                                        type="text"
                                        className="form-control inputUrl text-lowercase"
                                        name="url"
                                        placeholder="Ingrese la URL"
                                        pattern="([0-9a-zA-Z- ]).{1,50}"
                                        readOnly
                                    />
                                    <div className="invalid-feedback invalid-url"></div>
                                </div>
                                
                            </div>
                            {/*TITULO */}
                            <div className="form-group">
                                <label className="small text-secondary" htmlFor="editarTitulo"> * No ingresar caracteres especiales, solo letras y números</label>
                                <div className="input-group mb-3">
                                    <div className="input-group-append input-group-text">
                                    <i className="fas fa-heading"></i>                           
                                    </div>
                                
                                    <input
                                        id="editarTitulo"
                                        type="text"
                                        className="form-control"
                                        name="titulo"
                                        placeholder="Ingrese el título"
                                        pattern="([0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]).{1,30}"
                                        required
                                    />
                                    <div className="invalid-feedback invalid-titulo"></div>
                                </div>
                                
                            </div>
                            {/*INTRO */}
                            <div className="form-group">
                                <label className="small text-secondary" htmlFor="editarIntro"> * No ingresar caracteres especiales, solo letras y números</label>
                                <div className="input-group mb-3">
                                    <div className="input-group-append input-group-text">
                                    <i className="fas fa-file-alt"></i>                           
                                    </div>
                                
                                    <input
                                        id="editarIntro"
                                        type="text"
                                        className="form-control"
                                        name="intro"
                                        placeholder="Ingrese la intro"
                                        pattern="([(\\)\\=\\&\\$\\-\\_\\*\\<\\>\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]).{1,300}"
                                        required
                                    />
                                    <div className="invalid-feedback invalid-intro"></div>
                                </div>
                                
                            </div>
                            {/*CONTENIDO */}
                            <div className="form-group">
                                <label className="small text-secondary" htmlFor="editarContenido"> Ingrese el contenido del articulo </label>
                                <textarea
                                    id="editarContenido"
                                    type="file"
                                    className="form-control-file summernote"
                                    rows="10"
                                    name="contenido"
                                
                                ></textarea>
                                <div className="invalid-feedback invalid-contenido"></div>
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
PETICION PUT ARTICULO
================================ */
const putData = data =>{
    const url = `${rutaAPI}/editar-articulo/${data.id}`
    const token= localStorage.getItem("ACCESS_TOKEN")
    let formData = new FormData();
    formData.append("archivo", data.portada)
    formData.append("titulo", data.titulo)
    formData.append("intro", data.intro)
    formData.append("url", data.url)
    formData.append("contenido", data.contenido)

    const params ={
        method:"PUT",
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
PETICION DELETE ARTICULO
================================ */
const deleteData = data =>{
    const url = `${rutaAPI}/borrar-articulo/${data}`
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