import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CiUser, CiLock  } from "react-icons/ci";

    type ICreateUserData = {
        email: string;
        password: string;
    }
    
    const schema = yup.object({
        email: yup.string().required("Email field is required.").email("Please enter a valid e-mail."),
        password: yup.string().required("Password field is required.")
    })
    
export default function SignIn() {

    const navigate = useNavigate()
    
    const { register, 
        handleSubmit : onSubmit,
        setError,
        watch,
        formState: { errors }
        } = useForm<ICreateUserData>({resolver: yupResolver(schema)});
    
    const handleSubmit = (data: any) => {
        console.log(data);
        navigate("/u")
    }
    const onHandleSubmit = () => {
       console.log("Click")
    }
        
    return (
        // <div className="flex flex-col items-center">

    
        // <form onSubmit={onSubmit(handleSubmit)} className="flex h-[calc(100vh-95px)] flex-col justify-center items-center outline-none">
        
        // <span className="login100-form-title p-b-49">
		// 				Login
		// 			</span>
        // <div className="wrap-input100">
        // <p className="label-input100">Email</p>
        
        // <input
        //     {...register("email")}
        //     type="email"
        //     placeholder="Type your email"
        //     className={ errors.email ? "block peer rounded-[5px] w-[25rem]  mt-5 border-[#C93B32] focus:outline-none focus:border-[#C93B32]  focus:ring-1 focus:ring-[#C93B32]" : "block peer border-none w-[25rem] mt-5 focus:outline-none"}
        //     />
        // <span className="focus-input100" data-symbol="&#xf190;">
        //     {errors.email?.message}
        // </span>
        // </div>
        // <div className="wrap-input100">
        //     <p className="label-input100">Password</p>
        //     <input 
        //     {...register("password")}
        //     type="password"
        //     placeholder="Type your password"
        //     className={ errors.password ? "input100 block peer rounded-[5px] w-[25rem] mt-5 border-[#C93B32] focus:outline-none focus:border-[#C93B32]  focus:ring-1 focus:ring-[#C93B32]" : "block peer border-none w-[25rem] mt-5 focus:outline-none"}
        //     />
        //     </div>
        // <span className="focus-input100" data-symbol="&#xf190;">
        //     {errors.password?.message}
        // </span>
        // <Link to="/forgotpassword" className="place-self-end hover:text-[#2347C5] hover:underline">
        // <p className="text-[#5473E3]">Forgot Password?</p>
        // </Link>

        // <button
        //     type="submit"
        //     className={`rounded-full bg-[#3D5FD9] text-[#F5F7FF] w-[25rem] p-3 mt-5 hover:bg-[#2347C5] mb-5`}
        //     onClick={onHandleSubmit}
        //     >
        //     SIGN IN
        //     </button>

        //     <Link to="/signup" className="hover:text-[#2347C5] hover:underline">
        //         <p className="text-[#5473E3] mb-5">Don't have an account? Sign up</p>
        //     </Link>
        // </form>
        // </div>
          


    <div className="limiter">
		<div className="container-login100">
			<div className="wrap-login100 p-l-20 p-r-20 p-b-54">
				<form className="login100-form validate-form">
					<span className="login100-form-title p-b-49">
						Login
					</span>

					<div className="wrap-input100 validate-input m-b-23" data-validate = "Username is required">
						<span className="label-input100">Username</span>
                        <div className="input-icons">
                            <i className="icon"><CiUser/></i>
                            <input className="input100" type="text" name="username" placeholder="Type your username"/>
                            <span className="focus-input100"></span>
                        </div>
					</div>

					<div className="wrap-input100 validate-input" data-validate="Password is required">
						<span className="label-input100">Password</span>
                        <div className="input-icons">
                            <i className="icon"><CiLock/></i>
                            <input className="input100" type="text" name="pass" placeholder="Type your password"/>
                            <span className="focus-input100"></span>
                        </div>
					</div>
					
					<div className="container-login100-form-btn p-t-20">
						<div className="wrap-login100-form-btn">
							<div className="login100-form-bgbtn"></div>
							<button className="login100-form-btn">
								Login
							</button>
						</div>
					</div>

					<div className="flex-col-c p-t-10">
						<span className="txt1 p-b-17">
                            Don't have an account?
						</span>
						<Link to="/signup" className="txt2">
							Sign Up
						</Link>
					</div>
				</form>
			</div>
		</div>
	</div>
    )
}
