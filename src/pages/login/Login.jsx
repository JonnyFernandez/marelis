import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {

    // const auth = useAuth()
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm();

    const { signin, isAuthenticated, errors: signinErrors } = useAuth()


    useEffect(() => {
        if (isAuthenticated) navigate('/')
    }, [isAuthenticated])



    const onSubmit = async (values) => {
        signin(values)
        // console.log(values);

    };
    return (
        <div className='' >
            <div className=''>
                {
                    signinErrors?.length >= 1 ? signinErrors?.map((item, i) => <div key={i} className=''>{item}</div>) : ''
                }
                <h1 className=''>Login</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type='email'
                        {...register('email', { required: true })}
                        className=''
                        placeholder='Email'
                    />
                    {errors.email && <p className=''>email is required</p>}
                    <input
                        type='password'
                        {...register('password', { required: true })}
                        className=''
                        placeholder='Password'
                    />
                    {errors.password && <p className=''>password is required</p>}


                    <button type='submit' className=''>Login</button>
                </form>
                <p className=''>Don´t have acount? <Link className='' to={'/register'}>Sign up</Link> </p>
            </div>

        </div>
    );
}

export default Login