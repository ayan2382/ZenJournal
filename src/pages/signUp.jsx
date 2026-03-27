import { registrationSchema } from "../store/schemas/loginSchema";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registration } from "../store/slices/authSlice";
import { set } from "zod";
import { User2Icon, MailIcon, KeyIcon } from "lucide-react";

const CustomInputField = ({icon: Icon, type, placeholder, register, errors, typeOfInput}) => {
    return (
        <div className="relative">
            {Icon && <Icon className="absolute left-2 top-9 w-4 h-4 text-gray-400"/>}
            <input className={Icon ? "pl-7" : ""} type={type} placeholder={placeholder} {...register} /> 
            {errors[typeOfInput] && <p className="text-red-500">{errors[typeOfInput].message}</p>} 
        </div>
        
    );
}
   
const SignUpPage = () => {
    const dptch = useDispatch();
    const nav = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [failed, setFailed] = useState(false);
    const [succeeded, setSucceeded] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    });
    const onSub = async(data) => {
        try {
            console.log(data);
            setIsSubmitting(true);
            await dptch(registration(data)).unwrap();
            reset();
            setFailed(false);
            setSucceeded(true);
            setTimeout(() => { nav("/") }, 2000);
        } catch (error) {
            setFailed(true);
            setTimeout(() => { setFailed(false) }, 500);
            console.error("Registration failed:", failed, error);
        } finally {
            setIsSubmitting(false);
            setSucceeded(false);
            setFailed(false);
        }
    }
    return (
        <form className="body" onSubmit={handleSubmit(onSub)}>
            <div className="login-container mt-40 flex flex-col w-1/2">
                <h1 className="text-3xl mb-4 font-bold">Sign Up</h1>
                <p className="border-4 border-red-200 bg-white p-1 rounded shadow-md">You're <em><strong>always</strong></em> welcome here!</p>
                <CustomInputField icon={User2Icon} type="text" placeholder="Name" register={register("name")} errors={errors} typeOfInput="name" />
                <CustomInputField icon={MailIcon} type="email" placeholder="Email" register={register("email")} errors={errors} typeOfInput="email" />
                <CustomInputField icon={KeyIcon} type="password" placeholder="Password" register={register("password")} errors={errors} typeOfInput="password" />
                <button className="button" type="submit">Sign Up</button>
                {(errors.password || errors.email || errors.name) && <p className="text-red-500 mt-2">Fill in all fields correctly</p>}
                {failed && <p className="text-red-500 mt-2 font-bold">Registration failed. Please check your credentials and try again.</p>}
                {succeeded && <p className="text-green-500 mt-2 font-bold">Registration successful! Redirecting to login...</p>}
            </div>
        </form>
    )
}
export default SignUpPage;