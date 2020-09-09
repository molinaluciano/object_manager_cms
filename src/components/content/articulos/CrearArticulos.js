import React, {useState} from 'react'
import $ from 'jquery'
import notie from 'notie'
import { rutaAPI} from '../../../config/Config'

import 'summernote/dist/summernote-lite'
import 'summernote/dist/summernote-lite.css'
export default function CrearArticulo(){
    /*==============================================
    FORMATO URL
    =============================================== */
    let limpiarUrl = textoEscrito =>{
        let texto = textoEscrito.toLowerCase();
        texto = texto.replace(/[á]/g,'a');
        texto = texto.replace(/[é]/g,'e');
        texto = texto.replace(/[í]/g,'i');
        texto = texto.replace(/[ó]/g,'o');
        texto = texto.replace(/[ú]/g,'u');
        texto = texto.replace(/[ñ]/g,'n');
        texto = texto.replace(/ /g,'-');
        return texto;
    } 
    $(document).on("keyup", ".inputUrl", function(){
        $(this).val(
            limpiarUrl($(this).val())
        )
    })
    /*==============================================
    HOOK State para capturar datos
    =============================================== */
    const [articulos, crearArticulos] = useState({
        portada:null,
        titulo:"",
        intro:"",
        url:"",
        contenido:""
    })
    /*==============================================
    ON CHANGE
    =============================================== */
    const cambiarFormPost = e =>{
        if($("#portada").val() !== null){
            let portada =$("#portada").get(0).files[0];
                /*==============================================
                VALIDAMOS EL FORMATO DE LA IMAGEN SEA JPG O PNG
                =============================================== */
                if(portada["type"] !== "image/jpeg" && portada["type"] !== "image/png"){
                    $("#portada").val("");
                    notie.alert({
                        type: 3, // optional, default = 4, enum: [1, 2, 3, 4, 5, 'success', 'warning', 'error', 'info', 'neutral']
                        text: "ERROR FORMATO JPG O PNG",
                        time: 7, // optional, default = 3, minimum = 1,
                    })
                    $(".previsualizarImg").attr("src","")
                
                    return;

                }else if(portada["size"]>2000000){
                    $("#portada").val("");
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
                        crearArticulos({
                            'portada':portada,
                            'titulo': $("#titulo").val(),
                            'intro': $("#intro").val(),
                            'url': $("#url").val(),
                            'contenido': $("#contenido").val()
                        })
                    })
                }
        }
    }
    /*==============================================
    ON SUBMIT
    =============================================== */
    const submitPost = async e =>{
        $('.alert').remove();
        e.preventDefault();
        articulos.contenido =$("#contenido").val()

        const { titulo, intro, url, contenido}= articulos;
        /*==============================================
        VALIDAMS QUE EL CAMPO NO VENGA VACIO
        =============================================== */
        if(url===""){
            $(".invalid-url").show();
            $(".invalid-url").html("La url no puede ir vacia")
            return;
        }
        /*==============================================
        Validamos expresion regular de URL
        =============================================== */
        if(url !== ""){
            const expUrl = /^([0-9a-zA-Z-]).{1,50}$/
            if(!expUrl.test(url)){
                $(".invalid-url").show();
                $(".invalid-url").html("Utiliza el formato que coincida con el solicitado en la URL")
                return;
            }
            
        }
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
            EJECUTANDO SERVICIOS POST
        =============================================== */
        const result = await postData(articulos);
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
    SUMMERNOTE
    =============================================== */
    $(document).ready(function(){
        $("#contenido").summernote({
            height:250
        })
    })
    /*==============================================
    RETORNO DE LA VISTA
    =============================================== */
    return( 
    <div className="modal fade" id="crearArticulos">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title ">Crear nuevo Articulo</h4>
                    <button type="button" className="close" data-dismiss="modal">×</button>
                </div>
                <form  onChange={cambiarFormPost} onSubmit={submitPost} encType="multipart/form-data" method="post">
                    <div className="modal-body">
                        {/*ENTRADA PORTADA */}     
                        <div className="form-group">
                            <label className="small text-secondary" htmlFor="portada">*(Campo Obligatorio)* Peso Max. 2MB | Formato: JPG o PNG</label>
                            <input
                                id="portada"
                                type="file"
                                className="form-control-file border"
                                name="portada"
                                required
                            />
                            <div className="invalid-feedback invalid-imagen"></div>
                            <img className="previsualizarImg img-fluid" alt=""/>
                        </div>
                        {/*URL */}
                        <div className="form-group">
                            <label className="small text-secondary" htmlFor="url"> * No ingresar caracteres especiales, solo letras y números</label>
                            <div className="input-group mb-3">
                                <div className="input-group-append input-group-text">
                                <i className="fas fa-link"></i>                           
                                </div>
                            
                                <input
                                    id="url"
                                    type="text"
                                    className="form-control inputUrl text-lowercase"
                                    name="url"
                                    placeholder="Ingrese la URL"
                                    pattern="([0-9a-zA-Z- ]).{1,50}"
                                    required
                                />
                                <div className="invalid-feedback invalid-url"></div>
                            </div>
                            
                        </div>
                        {/*TITULO */}
                        <div className="form-group">
                            <label className="small text-secondary" htmlFor="titulo"> * No ingresar caracteres especiales, solo letras y números</label>
                            <div className="input-group mb-3">
                                <div className="input-group-append input-group-text">
                                <i className="fas fa-heading"></i>                           
                                </div>
                            
                                <input
                                    id="titulo"
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
                            <label className="small text-secondary" htmlFor="intro"> * No ingresar caracteres especiales, solo letras y números</label>
                            <div className="input-group mb-3">
                                <div className="input-group-append input-group-text">
                                <i className="fas fa-file-alt"></i>                           
                                </div>
                            
                                <input
                                    id="intro"
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
                            <label className="small text-secondary" htmlFor="contenido"> Ingrese el contenido del articulo </label>
                            <textarea
                                id="contenido"
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
PETICION POST SLIDE
================================ */
const postData = data =>{
    const url = `${rutaAPI}/crear-articulo`
    const token= localStorage.getItem("ACCESS_TOKEN")
    let formData = new FormData();
 
    formData.append("archivo", data.portada)
    formData.append("titulo", data.titulo)
    formData.append("intro", data.intro)
    formData.append("url", data.url)
    formData.append("contenido", data.contenido)

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