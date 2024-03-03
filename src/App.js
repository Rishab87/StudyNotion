import "./App.css";
import { Route , Routes } from "react-router-dom";
import Home from './pages/Home';
import Navbar from "./components/common/Navbar";
import Login from "./components/core/Auth/Login";
import Signup from "./components/core/Auth/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";

function App() {
  //study about openRoute and implement
  return (
    <div className="w-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element= {<Login/>}/>
        <Route path="/signup" element = {<Signup/>}/>
        <Route path="/forgot-password" element ={<ForgotPassword/>}/>
        <Route path="/update-password/:id" element = {<UpdatePassword/>} />
        <Route path="/verify-email" element={<VerifyEmail/>} />
      </Routes>
    </div>
  );
}

export default App;
