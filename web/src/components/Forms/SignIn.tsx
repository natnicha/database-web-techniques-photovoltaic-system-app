import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CiUser, CiLock } from "react-icons/ci";
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";

const url:string = 'https://jokes-by-api-ninjas.p.rapidapi.com/v1/jokes';
interface IAPIOptions {
	method: string,
	headers: {
		"X-RapidAPI-Key": string,
		"X-RapidAPI-Host": string
	}
}
const options: IAPIOptions = {
	method: 'GET',
	headers: {
	  'X-RapidAPI-Key': 'your-rapid-key',
	  'X-RapidAPI-Host': 'jokes-by-api-ninjas.p.rapidapi.com'
	}
  };

  type ICreateUserData = {
      email: string;
      password: string;
  }
  
  const schema = yup.object({
      email: yup.string()
          .required("Email field is required.")
          .email("Please enter a valid e-mail."),
      password: yup.string()
          .required("Password field is required.")
  })
    
export default function SignIn() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    let jwt = Cookies.get('jwt')?.toString();
    if (!(typeof (jwt) == 'undefined' && jwt == null)) {
      navigate("/projectlist");
      return;
    }
  }, []);

  const { register, handleSubmit: onSubmit, formState: { errors }
  } = useForm<ICreateUserData>({ resolver: yupResolver(schema) });


  const handleSubmit = (data: any) => {
    fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then((response) => {
        return response.json();
      }).then((data) => {
        if (data['access_token']){
          let jwt = data['access_token'];
          Cookies.set('jwt', jwt, { expires: 1 });
          navigate("/projectlist");
          return
        } else {
          setFeedback(data['error'])
        }
      })
      .catch((error) => {
        setFeedback("couldn't connect to the server")
        console.log('error: ' + error);
      });
  };
  const onHandleSubmit = () => {
  };

  const name = register("email");
  return (
    <div className="wrap-login100">
      <div className="container-login100">
        <div className="wrap-login100 p-l-20 p-r-20 p-b-54">
          <form onSubmit={onSubmit(handleSubmit)} className="login100-form validate-form">
            <span className="login100-form-title p-b-49">
              Login
            </span>

            <div className="wrap-input100 validate-input m-b-23">
              <span className="label-input100">Email</span>
              <div className="input-icons">
                <i className="icon"><CiUser /></i>
                <input {...register("email")}
                  className={errors.email ? "input100 block peer rounded-[5px] w-[25rem]  mt-5 border-[#C93B32] focus:outline-none focus:border-[#C93B32]  focus:ring-1 focus:ring-[#C93B32]" : "input100 block peer rounded-[5px] border-[#AEBBCD] w-[25rem] mt-5 focus:outline-none focus:ring-1"}
                  type="text" name="email" placeholder="Type your email" />
                <span className="focus-input100"></span>
                <span className="place-self-start text-[14px] text-[#C93B32]">
                  {errors.email?.message}
                </span>
              </div>
            </div>

            <div className="wrap-input100 validate-input">
              <span className="label-input100">Password</span>
              <div className="input-icons">
                <i className="icon"><CiLock /></i>
                <input {...register("password")}
                  className={errors.password ? "input100 block peer rounded-[5px] w-[25rem]  mt-5 border-[#C93B32] focus:outline-none focus:border-[#C93B32]  focus:ring-1 focus:ring-[#C93B32]" : "input100 block peer rounded-[5px] border-[#AEBBCD] w-[25rem] mt-5 focus:outline-none focus:ring-1"}
                  type="password" name="password" placeholder="Type your password" />
                <span className="focus-input100"></span>
                <span className="place-self-start text-[14px] text-[#C93B32]">
                  {errors.password?.message}
                </span>
              </div>
            </div>

            <div>
              <label className="feedback">{feedback}</label> 
            </div>

            <div className="container-login100-form-btn p-t-20">
              <div className="wrap-login100-form-btn">
                <div className="login100-form-bgbtn"></div>
                <button className="login100-form-btn" type="submit" onClick={onHandleSubmit}>
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
  );
}
