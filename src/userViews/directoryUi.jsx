import React from 'react'
import Header from '../components/navbarFooter/header'
import { AlumniDirectory, Random } from '../components/directory/directory'
import Footer from '../components/navbarFooter/footer'
const DirectoryUi = () => {
  return (
    <>
    <Header/>
    <AlumniDirectory/>
    <Random/>
    <Footer/>
    </>
  )
}

export default DirectoryUi

