const express  = require('express');
const app = express(); //good prac write all import statements on top why?
require('dotenv').config();
const cookieParser = require('cookie-parser');
const courseRoutes = require('./routes/Course');
const paymentRoutes = require('./routes/Payments');
const profileRoutes = require('./routes/Profile');
const userRoutes = require('./routes/User');
const contactRoutes = require('./routes/Contact')
const dbConnect = require('./config/database');
const {cloudinaryConnect} = require('./config/cloudinary');
const fileUploader = require('express-fileupload');
const cors = require('cors'); //what? --> used for entertaining front end request then also search what it is
//CORS, which stands for Cross-Origin Resource Sharing, is a security feature implemented by web browsers. It is a set of rules that determine how a web page in one domain can request and interact with resources hosted on another domain. The same-origin policy, enforced by browsers, restricts web pages from making requests to a different domain than the one that served the original web page. CORS is a mechanism that relaxes these restrictions, allowing for controlled access to resources on different domains.
//CORS is necessary because of the same-origin policy, which is a security measure to prevent potentially malicious cross-origin requests. However, in the modern web, it's common for web pages to make requests to APIs or resources hosted on different domains. Without CORS, these requests would be blocked by the browser, leading to a lack of interoperability between web applications and APIs.
//For example, if a web page served from https://example.com wants to make a request to an API hosted at https://api.example.com, this is a cross-origin request because the domain part of the origin is different.

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(fileUploader({
    useTempFiles: true, 
    tempFileDir: '/temp/'
}));

app.use(
    cors({
        origin: ["https://study-notion-7ztncalhu-rishabs-projects-2b908967.vercel.app/" , "http://localhost:3000" , 'https://study-notion-git-main-rishabs-projects-2b908967.vercel.app/' , "https://study-notion-ebon-xi.vercel.app/"], //jo bhi request iss url se aa rhi hai(yeh frontend ka url hai) usse entertain krna hai
        credentials: true 
    })
) 

dbConnect();
cloudinaryConnect();

app.use('/api/v1/auth' ,userRoutes); //Yes, you can use multiple route handlers in a single app.use() call in Express.js. When you write app.use('/api', route1, route2);, it means that both route1 and route2 middleware functions or routers will be applied to paths that start with /api.
app.use('/api/v1/profile' ,profileRoutes); 
app.use('/api/v1/course' , courseRoutes);
app.use('/api/v1/payment' , paymentRoutes);
app.use('/api/v1/reach' , contactRoutes)

//default route
app.get('/' , (req , res)=>{
    return res.json({
        success: true , 
        message: "Your server is up and running....",
    });
});

app.listen(PORT ,()=>{
    console.log(`server started successfully at ${PORT}`);
});
//HW: add different states of course , eg draft stage , phir pending stage aur phir ek admin ka approval miljayega tabhi course published hoga