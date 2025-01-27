import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const { signup, isAuthenticated, errors: registerErrors } = useAuth()



    // Redirigir si el usuario está autenticado
    useEffect(() => {
        if (isAuthenticated) navigate('/');
    }, [isAuthenticated, navigate]);


    // Manejo del envío del formulario
    const onSubmit = (values) => {
        signup(values);


    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 shadow-md rounded-md max-w-md w-full">
                {/* Mensajes de error de registro */}
                {registerErrors?.length > 0 && (
                    <div className="mb-4">
                        {registerErrors.map((error, i) => (
                            <div key={i} className="text-red-500 text-sm">{error}</div>
                        ))}
                    </div>
                )}

                <h1 className="text-3xl font-bold text-center mb-6">Register</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Campo de Nombre */}
                    <div>
                        <input
                            type="text"
                            {...register('name', { required: 'Name is required' })}
                            className="w-full p-2 border rounded"
                            placeholder="Name"
                            autoComplete="off"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Campo de Email */}
                    <div>
                        <input
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            className="w-full p-2 border rounded"
                            placeholder="Email"
                            autoComplete="on"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Campo de Contraseña */}
                    <div>
                        <input
                            type="password"
                            {...register('password', { required: 'Password is required' })}
                            className="w-full p-2 border rounded"
                            placeholder="Password"
                            autoComplete="off"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Campo de Tipo (Opcional) */}
                    <div>
                        <input
                            type="text"
                            {...register('type')}
                            className="w-full p-2 border rounded"
                            placeholder="Type (optional)"
                            autoComplete="off"
                        />
                    </div>

                    {/* Botón de registro */}
                    <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Register
                    </button>
                </form>

                <p className="text-center mt-4">
                    Already have an account?{' '}
                    <Link className="text-blue-500 hover:underline" to="/login">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
