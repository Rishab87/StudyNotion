import React, { useEffect, useRef, useState } from 'react'
import { Skeleton } from "../../shadcn/ui/skeleton"
import { FaRobot } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import { TypeAnimation } from 'react-type-animation';
import GeminiLogo from '../../assets/Images/Gemini.jpg'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../shadcn/ui/dialog"
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai";
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const Gemini = () => {  
  const MODEL_NAME = "gemini-1.5-pro-latest";
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  
  async function runChat(userInput) {
    setLoading(true);
    try{

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
      const generationConfig = {
        temperature: 1,
        topK: 0,
        topP: 0.95,
        maxOutputTokens: 8192,
      };
    
      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ];
    
      const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [
        ],
      });
    
      const result = await chat.sendMessage(userInput);
      const response = result.response;
      setChats((prevChats) => [...prevChats, {image: GeminiLogo , text: response.text()}]);
      console.log(response);

    } catch(error){
      console.log("Error in running chat", error);
      toast.error(error.message);
    }
    setLoading(false);
  }

  const [chats , setChats] = useState([]);
  const [chat , setChat] = useState('');
  const [loading , setLoading] = useState(false);
  const {user} = useSelector(state=> state.profile);
  const chatContainerRef = useRef(null);
  // console.log("Chats", chats)

  const scrollToBottom = (element) => {
    if (element) {
      element.scrollTop = element.scrollHeight;  
    }
  };

  useEffect(() => {
    scrollToBottom(chatContainerRef.current);
  }, [chats]);
  

  return (
    <Dialog> 
        <DialogTrigger><FaRobot color='white'/></DialogTrigger>
        <DialogContent ref={chatContainerRef} className='h-full'>
          <DialogHeader>
            <DialogTitle>Chat With Gemini</DialogTitle>
            <DialogDescription>
              Don't share any sensitive information with Gemini
            </DialogDescription>
          </DialogHeader>

          {
            
            chats.map((chat , index)=>(
              <div key={index} className='p-2 flex gap-3 w-full'>
                <img src={chat.image} alt="" className='w-[50px] h-[50px] max-h-[50px] object-cover rounded-full' />

                {
                  chat.image == GeminiLogo?(
                    <TypeAnimation
                  sequence={[chat.text , 5000]}
                  speed={100}
                  style={{ 
                    whiteSpace:'pre-line',
                    display: 'block'
                  }}
                  cursor={false}
                  repeat={false}
                />
                  ):
                 ( <p>{chat.text}</p>)
                }
              </div>
            
            ))
          }
          {
            loading && (
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
            )
          }

        <form className='flex justify-between p-2 items-center' onSubmit={(e)=>{
              e.preventDefault();
              runChat(chat);
              setChats((prevChats) => [...prevChats, {image: user.image , text: chat}]);          
              setChat('');
              }}>
            <input placeholder='What do you want to ask?' onChange={(e)=>setChat(e.target.value)} value={chat} className='border-2 text-black p-2 border-black w-[80%] rounded-lg'/>
            <button type='submit'><IoMdSend fontSize={"1.5rem"}/></button>
        </form>
        </DialogContent>
      </Dialog>
  )
}

export default Gemini