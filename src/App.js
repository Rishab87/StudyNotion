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
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart/index";
import { ACCOUNT_TYPE } from "./utils/constants";
import { useDispatch, useSelector } from "react-redux";
import AddCourse from "./components/core/Dashboard/AddCourse";
import Settings from "./components/core/Dashboard/Settings";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse";
import Catalog from "./pages/Catalog";
import BuyCourse from "./components/core/Catalog/CoursePage/BuyCourse";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";

function App() {

  const dispatch = useDispatch();
  const {user} = useSelector(state=> state.profile);

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
        <Route path="/catalog/:catalogName" element={<Catalog/>}/>
        <Route path="/catalog/:catalogName/courses/:id" element={<BuyCourse/>}/>

        <Route element={
          <PrivateRoute>
            <ViewCourse/>
          </PrivateRoute>
        }>
          {
            user?.accountType === ACCOUNT_TYPE.STUDENT &&(
              <>
                <Route path="/view-course/:courseId/section/:sectionId/sub-section/:subSectionId" element={<VideoDetails/>}/>
              </>
            )
          }
        </Route>

          <Route element={
            <PrivateRoute>
              <Dashboard/>
            </PrivateRoute>
          }>

          <Route path="/dashboard/my-profile" element = {<MyProfile/>}/>
          <Route path="/dashboard/settings" element = {<Settings/>}/>

          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="dashboard/enrolled-courses" element= {<EnrolledCourses/>}/>
                <Route path="dashboard/cart" element= {<Cart/>}/>
              </>
            )
          }

          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="dashboard/add-course" element= {<AddCourse/>}/>
                <Route path="dashboard/my-courses" element= {<MyCourses/>}/>
                <Route path="dashboard/edit-course/:id" element= {<EditCourse/>}/>
                <Route path="dashboard/instructor" element = {<Instructor/>}/>
              </>
            )
          }
          </Route>

{/*remove db call in auth middleware and add it in router login token */}
         <Route path="*" element={<Error/>}/>
      </Routes>
    </div> 
    //HW: Settings page , MyCourse page
  );
}

export default App;
