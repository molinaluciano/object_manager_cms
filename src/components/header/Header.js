import React from 'react'
export default function  Header() {
    /*================================
    CERRAR LA SESION 
    ==================================*/
    const cerrarSesion = ()=>{
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("ID");
        localStorage.removeItem("USUARIO");

    }

    return(
            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" data-widget="pushmenu" href="#/">
                         <i className="fas fa-bars"></i>
                        </a>
                    </li>
                    
                </ul>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <a className="nav-link"  href="/" onClick={()=>cerrarSesion()}>
                         <i className="fas fa-sign-out-alt"></i>
                        </a>
                    </li>
                    
                </ul>
            </nav>

    );
}