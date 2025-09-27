import auth from "../assets/images/auth.jpg"

import { useNavigate } from "react-router-dom"

import { useForm } from "react-hook-form"

import { useAuth } from "../../hooks/useAuth"

import CustomModal from "../utilities/CustomModal"

import { useState } from "react"

import Alert from "@mui/material/Alert"

import Snackbar from '@mui/material/Snackbar';

import toast from "react-hot-toast"


 

const LoginPage = () => {

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm()

    const { login } = useAuth();


 

    const onLogin = async (data) => {

        try {

            const res = await login(data);

            if (res.success === false) {

                toast.error(res.message)

            } else {

                toast.success(res.message)

            }

        } catch (error) {

            console.log(error);

        }

    }

    return <section className="min-vh-100 container-fluid p-0">

        <div className="row h-100 g-0">

            <div className="col-md-6 d-none d-md-block p-0">

                <img src={auth} alt="login-image" className="w-100 vh-100 object-fit-cover d-block" />

            </div>

            <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">

                <div className="w-75 w-md-50 mt-5 mt-md-0">

                    <h1 role="button" onClick={() => {

                        navigate("/")

                    }} className="display-6 text-center">Wealthwise</h1>

                    <h2 className="my-4 fs-2 display-6">Login</h2>

                    <form onSubmit={handleSubmit(onLogin)}>

                        <div className="mb-3 form-group">

                            <label htmlFor="email" className="form-label">Email</label>

                            <input type="email" className="form-control" placeholder="example@email.com" {...register("email", {

                                required: "Email is required",

                                pattern: {

                                    value: /^[a-z0-9._]{1,}@[a-z]+\.com$/,

                                    message: "Invalid Email Address"

                                }

                            })} />

                            {errors.email && <p className="text-end text-danger fs-6">{errors.email.message}</p>}

                        </div>

                        <div className="mb-3 form-group">

                            <label htmlFor="password" className="form-label">Password</label>

                            <input type="password" className="form-control" placeholder="*******" {

                                ...register("password", {

                                    required: "Password is required",

                                    minLength: {

                                        value: 6,

                                        message: "Password must be atleast 6 characters."

                                    }

                                })

                            } />

                            {errors.password && <p className="text-end text-danger fs-6">{errors.password.message}</p>}

                        </div>

                        <a onClick={() => setOpen(true)} className="text-end d-block pb-2 text-muted p-0 cursor-pointer" style={{

                            fontSize: "0.875rem"

                        }}>Forgot password?</a>

                        <div className="w-100">

                            <button className="btn btn-primary w-100">Login</button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

        <CustomModal open={open} handleClose={() => setOpen(false)} />

    </section>

}


 

export default LoginPage
