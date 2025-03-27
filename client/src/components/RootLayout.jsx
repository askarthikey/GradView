// import { useState } from "react";
import Header from './Header'
import Footer from './Footer'
import { Outlet } from "react-router-dom";

function RootLayout(){
    return(
        <div>
        <Header/>
        <Outlet/>
        <Footer/>
        </div>
    )
}

export default RootLayout