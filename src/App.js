import "./App.css";
import { Route , Routes } from "react-router-dom";
import Home from './pages/Home';
import Navbar from "./components/common/Navbar";
import Login from "./components/core/Auth/Login";
import Signup from "./components/core/Auth/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import OpenRoute from "./components/core/Auth/OpenRoute";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./components/core/Dashboard/MyProfile";
import PrivateRoute from './components/core/Auth/PrivateRoute'
import Dashboard from "./pages/Dashboard";
import Error from './pages/Error'

function App() {
  //study about openRoute and implement
  return (
    <div className="w-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
    <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

    <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />  

      <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />  

    <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />  

    <Route
          path="about"
          element={
              <About />

          }
          
        />  
         <Route path="/contact" element={<Contact />} />

          <Route element={
            <PrivateRoute>
              <Dashboard/>
            </PrivateRoute>
          }>

          <Route path="dashboard/my-profile" element = {<MyProfile/>}/>

          </Route>



         <Route path="*" element={<Error/>}/>
      </Routes>
    </div> 
    //HW: Settings page
  );
}

export default App;
