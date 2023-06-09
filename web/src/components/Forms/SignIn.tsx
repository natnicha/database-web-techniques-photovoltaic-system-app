import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CiUser, CiLock  } from "react-icons/ci";
// import fetch from 'node-fetch';

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
        var response = fetch('http://localhost:8000/auth/login', {method: 'POST', body: data});
        console.log(data);
        console.log(response);
        console.log(data);
        navigate("/u")
    }
    const onHandleSubmit = () => {
       console.log("Click")
    }
        
    return (
    <div className="limiter">
		<div className="container-login100">
			<div className="wrap-login100 p-l-20 p-r-20 p-b-54">
				<form className="login100-form validate-form" onSubmit={onSubmit(handleSubmit)}>
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
                            <input className="input100" type="password" name="pass" placeholder="Type your password"/>
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
