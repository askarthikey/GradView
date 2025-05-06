// import { useState } from "react";
import Header from './Header'
import Footer from './Footer'
import { Outlet } from "react-router-dom";
import ProfileHandler from './ProfileHandler';
function RootLayout(){
    return(
        <div>
        <Header/>
        <ProfileHandler/>
        <Outlet/>
        <Footer/>
        </div>
    )
}

export default RootLayout