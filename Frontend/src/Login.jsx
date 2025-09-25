import { AppWindowIcon, CodeIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useState } from "react"
import { API_USER } from "./config/api"
import axios from "axios"
import { toast } from "sonner";
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { AuthUser } from "./Features/UserSlice"
export default function Login() {
   const navigate=useNavigate();
   const dispatch=useDispatch();
    const [signup,setSingup]=useState({
    name:"",
    email:"",
    password:""
  })

  const [login,setLogin]=useState({
    email:"",
    password:""
  })

  const changeHandler=(e,type)=>{
    const {name,value}=e.target;
    if(type==="signup")
    {
      setSingup({...signup,[name]:value})

    }else{
      setLogin({...login,[name]:value})
    }
  }

 const handleRegistration = async (type) => {
  const InputData = type === "signup" ? signup : login;

  try {
    let res;
    if (type === "signup") {
      res = await axios.post(`${API_USER}/register`, InputData,{withCredentials:true});
      if (res.data.success) {
      toast.success(res.data.message || "Success");    
    }

    } else {
      res = await axios.post(`${API_USER}/login`, InputData,{withCredentials:true});

     if (res.data.success) {
      toast.success(res.data.message || "Success");
      dispatch(AuthUser(res?.data?.user))
      navigate("/homepage");
    }
    }

    // if (res.data.success) {
    //   toast.success(res.data.message || "Success");

      
    // } else {
    //   toast.error(res.data.message || "Something went wrong");
    // }
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Server error. Try again!";
    toast.error(errorMsg);   // ✅ Show backend error in toast
    console.error("Error:", error.response?.data || error.message);
  }
};


  return (
    <div className="flex items-center w-full justify-center mt-20">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Signup</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-xl font-bold hover:underline">Login</CardTitle>
              <CardDescription className='text-center'>
                Login to your booking account....
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
               <Label htmlFor="email">Your email address</Label>
                <Input name="email" value={login.email}  onChange={(e)=>{changeHandler(e,login)}} id="tabs-demo-username" defaultValue="abc@gmail.com" />
              </div>
                <div className="grid gap-3">
                <Label htmlFor="tabs-demo-current">Password</Label>
                <Input name="password" value={login.password} onChange={(e)=>{changeHandler(e,login)}} id="tabs-demo-current" type="password" defaultValue="******" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={()=>handleRegistration("login")}>Login</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-xl font-bold hover:underline">Signup</CardTitle>
              <CardDescription className='text-center'>
                Change your password here. After saving, you&apos;ll be logged
                out.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
             <div className="grid gap-3">
                <Label htmlFor="tabs-demo-name">Name</Label>
                <Input name="name" value={signup.name} onChange={(e)=>{changeHandler(e,"signup")}} id="tabs-demo-name" defaultValue="Pedro Duarte" />
              </div>
              <div className="grid gap-3">
               <Label htmlFor="email">Your email address</Label>
                <Input name="email" value={signup.email} onChange={(e)=>{changeHandler(e,"signup")}} id="tabs-demo-username" defaultValue="abc@gmail.com" />
              </div>
                <div className="grid gap-3">
                <Label htmlFor="tabs-demo-current">Password</Label>
                <Input name="password" value={signup.password} onChange={(e)=>{changeHandler(e,"signup")}} id="tabs-demo-current" type="password" defaultValue="******" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={()=>handleRegistration("signup")}>Signup</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
