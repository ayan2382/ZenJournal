import { loginSchema } from "../store/schemas/loginSchema";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { login, updateLoginCount } from "../store/slices/authSlice";
import { set } from "zod";
import GenericPopup from "../components/GenericPopup";
import { User } from "lucide-react";
import { MailIcon, LockIcon } from "lucide-react";


const LoginPage = () => {
    const dptch = useDispatch();
    const nav = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [failed, setFailed] = useState(false);
    const [success, setSuccess] = useState(false);

    const {name} = useSelector((state) => state.auth);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });
    const onSubmit = async(data) => {
        try {
            setIsSubmitting(true);
            setFailed(false);
            const result = await dptch(login(data)).unwrap();
            setSuccess(true);
            dptch(updateLoginCount(result.token));
            console.log("Login successful for user:", data.email, success);
            reset();
            setTimeout(() =>{
                nav("/");
            }, 900);
        } catch (error) {
            setFailed(true);
            console.error("Login failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <>
            {success && <GenericPopup>
                <h1>Welcome back, {name}! <br></br> Redirecting to your main hub...</h1>
                </GenericPopup>}
        <form className="body" onSubmit={handleSubmit(onSubmit)}>
            
            <div className="login-container mt-40 flex flex-col  w-1/2">
                <h1 className="text-3xl mb-4 font-bold text-left">Welcome back</h1>
                <p className="text-gray-700">Sign in to continue your mindful journey.</p>
                <div className="relative w-full">
                    <MailIcon className="absolute left-2 top-8 text-zen-400" />
                    <input type="email" placeholder="Email" {...register("email")} className="pl-10 w-full" />
                </div>
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                <div className="relative w-full mt-4">
                    <LockIcon className="absolute left-2 top-8 text-zen-400" />
                    <input type="password" placeholder="Password" {...register("password")} className="pl-10 w-full" />
                </div>
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                <button className="button" type="submit" disabled={isSubmitting}>Login</button>
                {(errors.password || errors.email) && <p className="text-red-500 mt-2">Fill in all fields correctly</p>}
                {failed && <p className="text-red-500 mt-2 font-bold">Login failed. Please check your credentials and try again.</p>}
                
            </div>
            <p className="text-gray-500">Your privacy is our priority. All entries are encrypted and secure.</p>
        </form>
        </>
    )
}
export default LoginPage;