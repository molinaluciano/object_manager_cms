import React from 'react'
import $ from 'jquery'
import 'datatables.net';
import 'datatables.net-bs4'
import 'datatables.net-responsive'
import {rutaAPI} from '../../../config/Config'
export default function Usuarios() {
       
    const dataUsuarios = async()=>{
        /*==================================
        CREAMOS EL DATASET
        ===================================*/
            const getUsuarios = await getData();
            const dataTable = [];
            getUsuarios.data.forEach((usuario,index)=>{
                dataTable[index]= [(index+1),
                                    usuario.usuario,
                                    usuario.email,
                                    [usuario._id]];
            })
            //console.log(dataTable)


        /*==================================
        EJECUTAMOS DATATABLE 
        ===================================*/
        $(document).ready( function () {
            let tablaUsuarios = $('.table').DataTable({
                data: dataTable,
                "columDefs":[{
                    "searchable":true,
                    "orderable":true,
                    "targets":0
                }],
                "order":[[0,"desc"]],
                columns: [
                    { title: "#" },
                    { title: "Usuario" },
                    {title:"Email"},
                    { title: "Acciones",
                    render: function(data){
                        return `
                        <a href="#">                    
                        <svg style="color:black; background:orange; border-radius:100%; width:45px; line-height:35px; text-align:center; padding:10px"
                        aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pencil-alt" class="svg-inline--fa fa-pencil-alt fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"></path></svg>
                        </a>
                        <a href="#"> 

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
            tablaUsuarios.on("order.dt search.dt", function(){
                tablaUsuarios.column(0,{search:"applied", order:"applied"})
                .nodes().each(function(cell,i){
                    cell.innerHTML = i+1;
                })
            }).draw();
        })
    }
    dataUsuarios();
/* ================================
RETORNAMOS VISTA DEL COMPONENETE
=================================== */
    return(
        <div className="content-wrapper" style={{minHeight:"494px"}}>
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1 className="m-0 text-dark">Usuarios</h1>
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
                                   
                                </div>
                                <div className="card-body">
                                   <table className="table table-striped dt-responsive" style={{"width":"100%"}}>
                                   {/* <thead>
                                       <tr>
                                           <th>#</th>
                                           <th> Usuario</th>
                                           <th> Email</th>
                                       </tr>
                                   </thead>
                                   <tbody>
                                       <tr>
                                           <td>1 </td>
                                           <td>admin</td>
                                           <td>lucianomm@gmail.com</td>
                                          
                                       </tr>
                                   </tbody> */}
                                   </table>
                                </div>
                            </div>

                        </div>
                    
                    </div>
                </div>
            </div>


        </div>

    )
    
}
/*==================================
PETICION GET PARA ADMINISTRADORES
 ===================================*/
 const getData = ()=>{
    const url = `${rutaAPI}/mostrar-usuarios`;
    const token = localStorage.getItem("ACCESS_TOKEN")
    const params = {
        method:"GET",
        headers: {
            "Authorization":token,
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