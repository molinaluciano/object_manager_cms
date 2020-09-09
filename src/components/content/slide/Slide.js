import React from 'react'
import { rutaAPI} from '../../../config/Config'
import $ from 'jquery'
import 'datatables.net';
import 'datatables.net-bs4'
import 'datatables.net-responsive'

import CrearSlide from './CrearSlide'
import EditarBorrarSlide from './EditarBorrarslide'
export default function Slide() {

    const dataSlide = async()=>{
        /*==================================
        CREAMOS EL DATASET
        ===================================*/
            const getSlide = await getData();
            const dataTable = [];
            getSlide.data.forEach((slide,index)=>{
                dataTable[index]= [(index+1),
                                    slide.imagen,
                                    slide.titulo,
                                    slide.descripcion,
                                    [   slide._id+"_",
                                        slide.imagen+"_",
                                        slide.titulo+"_",
                                        slide.descripcion+""] ];
            })
           // console.log(dataTable)

           /*==================================
            EJECUTAMOS DATATABLE 
            ===================================*/
            $(document).ready( function () {
               let tablaSlide =  $('.table').DataTable({

                    data: dataTable,
                    "columDefs":[{
                        "searchable":true,
                        "orderable":true,
                        "targets":0
                    }],
                    "order":[[0,"desc"]],
                    columns: [
                        { title: "#" },
                        { title: "Imagen",
                        render: function(data){
                            return `<img src="${rutaAPI}/mostrar-img/${data}"  style="width:320px"  />`
                        } },
                        {title:"Titulo"},
                        {title:"Descripcion"},
                        { title: "Acciones",
                        render: function(data){
                            return `
                            <a href="" class="editarInputs" data-toggle="modal" data-target="#editarSlide" data="${data}">                    
                            <svg style="color:black; background:orange; border-radius:100%; width:45px; line-height:35px; text-align:center; padding:10px"
                            aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pencil-alt" class="svg-inline--fa fa-pencil-alt fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"></path></svg>
                            </a>
                            <a href="" class="borrarRegistro" data="${data}"> 

                            <svg style="color:white; background:#DD3444; border-radius:100%; width:45px; line-height:35px; text-align:center; padding:15px;"
                            
                            aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" class="svg-inline--fa fa-trash fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"></path></svg>
                            </a>
                            `
                        } }
                    
                    ],
                    "language": {

                        "sProcessing":     "Procesando...",
                        "sLengthMenu":     "Mostrar _MENU_ registros",
                        "sZeroRecords":    "No se encontraron resultados",
                        "sEmptyTable":     "Ningún dato disponible en esta tabla",
                        "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_",
                        "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0",
                        "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
                        "sInfoPostFix":    "",
                        "sSearch":         "Buscar:",
                        "sUrl":            "",
                        "sInfoThousands":  ",",
                        "sLoadingRecords": "Cargando...",
                        "oPaginate": {
                            "sFirst":    "Primero",
                            "sLast":     "Último",
                            "sNext":     "Siguiente",
                            "sPrevious": "Anterior"
                        },
                        "oAria": {
                                "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                        }

                    }

                });
            tablaSlide.on("order.dt search.dt", function(){
                tablaSlide.column(0,{search:"applied", order:"applied"})
                .nodes().each(function(cell,i){
                    cell.innerHTML = i+1;
                })
            }).draw();
            })
    }    
    dataSlide();
   
    /* ================================
    RETORNAMOS VISTA DEL COMPONENETE
    =================================== */
    return(
        <div className="content-wrapper" style={{minHeight:"494px"}}>
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1 className="m-0 text-dark">Slide</h1>
                        </div>
                    </div>

                </div>

            </div>
            <div className="content">
                <div className="container-fluid">
                    <div className="row">
                    <div className="col-lg-12">
                        <div className="card card-primary card-outline">
                            <div className="card-header">
                                <h5 className="m-0">
                                    <button className="btn btn-primary limpiarFormulario" data-toggle="modal" data-target="#crearSlide">Crear nuevo Slide</button>
                                </h5>
                            </div>
                            <div className="card-body">
                                <table className="table table-striped dt-responsive" style={{"width":"100%"}}>
                                {/* <thead>
                                    <tr>
                                        <th>#</th>
                                        <th width="320px"> Imagen </th>
                                        <th> Titulo</th>
                                        <th> Descripción</th>
                                        <th>Acciones</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1 </td>
                                        <td> <img src={Slide01} className="img-fluid" alt="SLIDES" /> </td>
                                        <td>LOREM IMPSUN 1</td>
                                        <td>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusan... </td>
                                        <td>
                                        <div className="btn-group">
                                                <button className="btn btn-warning rounded-circle  mr-2">
                                                <i className="nav-icon fas fa-pencil-alt"></i>
                                                </button>

                                                <button className="btn btn-danger rounded-circle  mr-2">
                                                <i className="nav-icon fas fa-trash"></i>
                                                </button>
                                        </div>
                                        </td>
                                    </tr>
                                </tbody>*/}
                                </table> 
                            </div>
                            </div>

                        </div>
                    
                    </div>
                </div>
            </div>
                {/*=============================
                FORMULARIO CON VENTANA MODAL PARA LA CREACION DE DATOS
                =============================== */}  
                <CrearSlide/>            
                {/*=============================
                FORMULARIO CON VENTANA MODAL PARA EDITAR DATOS
                =============================== */}  
                <EditarBorrarSlide/>    

        </div>

    )
    
}
/*==================================
PETICION GET PARA SLIDES
 ===================================*/
 const getData = ()=>{
    const url = `${rutaAPI}/mostrar-slides`;
    const params = {
        method:"GET",
        headers: {
            
            "Content-Type":"application/json"
        }

    }
    return fetch(url, params).then(response=>{
        return response.json();
    }).then(result =>{
        return result;
    }).catch(err=>{
        return err
    })
    
}