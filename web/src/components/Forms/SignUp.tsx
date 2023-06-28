import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import regex from '../../utils/regex';
import notRed from "../../assets/not-red.svg";
import checkGreen from "../../assets/check-green.svg";

type ICreateUserData = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const schema = yup.object({
    first_name: yup.string()
        .required("First name field is required.")
        .min(3, "The first name field must contain at least 3 characters."),
    last_name: yup.string()
        .required("Last name field is required.")
        .min(3, "The last name field must contain at least 3 characters."),
    email: yup.string()
        .required("Email field is required.")
        .email("Please enter a valid e-mail."),
    password: yup.string()
        .required("Password field is required.")
        .min(8, "Enter a password of at least 8 characters.")
        .matches(regex.number, "Enter at least 1 number.")
        .matches(regex.lowerCase, "Enter at least 1 lowercase character.")
        .matches(regex.upperCase, "Enter at least 1 uppercase character.")
        .matches(regex.specialCharacter, "Enter at least 1 special character."),
    confirmPassword: yup.string()
        .required("Confirm password field is required.")
        .oneOf([yup.ref("password")], "Passwords are not the same.")
    
})

export default function SignUp() {
    const navigate = useNavigate()

    const { register, 
            handleSubmit : onSubmit,
            formState: { errors }
        } = useForm<ICreateUserData>({resolver: yupResolver(schema)});

    const handleSubmit = (data: any) => {
        console.log(data);
        fetch('http://localhost:8000/auth/register', {
            method: 'POST', 
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(data)})
            .then((response) => {
                console.log(response)
                if (response.ok) {
                    navigate("/registered")
                }
              })
              .catch((error) => {
                console.log('error: ' + error);
              });
    }
    const onHandleSubmit = () => {
        console.log("Click")
    }

    return (
        <div className="wrap-login100 container-login100 flex flex-col items-center">

            <form onSubmit={onSubmit(handleSubmit)} className="login100-form validate-form">
                
                <span className="login100-form-title p-b-49">
                    Register
                </span>
                <div className="wrap-input100 validate-input m-b-23">
                    <span className="label-input100">First Name</span>
                    <input 
                        {...register("first_name")}
                        type="text"
                        placeholder="First Name"
                        className={ errors.first_name ? "input100 block peer rounded-[5px] w-[25rem] mt-5 border-[#C93B32] focus:outline-none focus:border-[#C93B32]  focus:ring-1 focus:ring-[#C93B32]" : "input100 block peer rounded-[5px] mt-5 border-[#AEBBCD] w-[25rem] focus:outline-none focus:ring-1"}
                    />
                    <span className="place-self-start text-[14px] text-[#C93B32]">
                        {errors.first_name?.message}
                    </span>
                </div>

                <div className="wrap-input100 validate-input m-b-23">
                    <span className="label-input100">Last Name</span>
                    <input 
                        {...register("last_name")}
                        type="text"
                        placeholder="Last Name"
                        className={ errors.last_name ? "input100 block peer rounded-[5px] w-[25rem] mt-5 border-[#C93B32] focus:outline-none focus:border-[#C93B32]  focus:ring-1 focus:ring-[#C93B32]" : "input100 block peer rounded-[5px] mt-5 border-[#AEBBCD] w-[25rem] focus:outline-none focus:ring-1"}
                    />
                    <span className="place-self-start text-[14px] text-[#C93B32]">
                        {errors.last_name?.message}
                    </span>
                </div>

                <div className="wrap-input100 validate-input m-b-23">
                    <span className="label-input100">Email</span>
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="Email"
                        className={ errors.email ? "input100 block peer rounded-[5px] w-[25rem]  mt-5 border-[#C93B32] focus:outline-none focus:border-[#C93B32]  focus:ring-1 focus:ring-[#C93B32]" : "input100 block peer rounded-[5px] border-[#AEBBCD] w-[25rem] mt-5 focus:outline-none focus:ring-1"}
                        />
                    <span className="place-self-start text-[14px] text-[#C93B32]">
                        {errors.email?.message}
                    </span>
                </div>
                <div className="wrap-input100 validate-input m-b-23">
                    <span className="label-input100">Password</span>
                    <input 
                        {...register("password")}
                        type="password"
                        placeholder="Password"
                        className={ errors.password ? "input100 block peer rounded-[5px] w-[25rem] mt-5 border-[#C93B32] focus:outline-none focus:border-[#C93B32]  focus:ring-1 focus:ring-[#C93B32]" : "input100 block peer rounded-[5px] border-[#AEBBCD] w-[25rem] mt-5 focus:outline-none focus:ring-1"}
                        />
                    <span className="place-self-start text-[14px] text-[#C93B32]">
                        {errors.password?.message}
                    </span>
                </div>
                
                <div className="wrap-input100 validate-input m-b-23">
                    <span className="label-input100">Confirm Password</span>
                    <input
                        {...register("confirmPassword")}
                        type="password"
                        placeholder="Confirme Password"
                        className={ errors.confirmPassword ? "input100 block peer rounded-[5px] w-[25rem] mt-5 border-[#C93B32] focus:outline-none focus:border-[#C93B32]  focus:ring-1 focus:ring-[#C93B32]" : "input100 block peer rounded-[5px] border-[#AEBBCD] w-[25rem] mt-5 focus:outline-none focus:ring-1"}
                        />
                    <span className="place-self-start text-[14px] text-[#C93B32]">
                        {errors.confirmPassword?.message}
                    </span>
                </div>
                <div className="container-login100-form-btn p-t-20">
                    <div className="wrap-login100-form-btn">
                        <div className="login100-form-bgbtn"></div>
                        <button className="login100-form-btn" type="submit" onClick={onHandleSubmit}>
                            SIGN UP
                        </button>
                    </div>
                </div>
            
                <div className="flex-col-c p-t-10">
                    <span className="txt1 p-b-17">
                        Have an account?
                    </span>
                    <Link to="/" className="txt2">
                        Sign In
                    </Link>
                </div>
                
            </form>

            <div className="p-t-20" >
                    
                <label className="text-[#404B5A]">Password must contain:</label>
                            
                <div className="mt-2 ">
                    <img  src={errors.password?.message ? notRed : checkGreen} className="inline-block mr-2" />
                    <p className="inline-block">Enter a password of at least 8 characters.</p>
                </div>
                        
                <div>
                    <img src={ errors.password?.message ? notRed : checkGreen } className="inline-block mr-2"/>
                    <p className="inline-block">Enter at least 1 number.</p>
                </div>
                            
                <div>
                    <img src={ errors.password?.message ? notRed : checkGreen } className="inline-block mr-2"/>
                    <p className="inline-block">Enter at least 1 lowercase character.</p>
                </div>
        
                <div>
                    <img src={ errors.password?.message ? notRed : checkGreen } className="inline-block mr-2"/>
                    <p className="inline-block">Enter at least 1 uppercase character.</p>
                </div>
                            
                <div>
                    <img src={ errors.password?.message ? notRed : checkGreen } className="inline-block mr-2"/>
                    <p className="inline-block">Enter at least 1 special character.</p>
                </div>
            </div>
            
        </div>

    )
}