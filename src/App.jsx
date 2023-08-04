import { useState } from 'react'
import {Route, Routes} from 'react-router-dom'
import Call from './pages/Call'
import Test from './pages/Test'
import Message from './pages/message/Message'
// import './App.css'

function App() {
  return (
    <>
      <Routes>
        <Route path={'/call'} element={<Call/>}/> 
        <Route path={'/message'} element={<Message/>}/>
        <Route path={'/t'} element={<Test/>}/>   
      </Routes>     
    </>
  )
}

export default App
