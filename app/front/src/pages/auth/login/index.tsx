import React from 'react';
import {useAuthController} from "@/hooks/useAuthController";
import {useRouter} from "next/router";

const Login = () => {
    const { login, error } = useAuthController();
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-md m-[2em]">
                <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
                <p className="mb-4 text-center">Enter your credentials to log in</p>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);
                    login(formData.get('email') as string, formData.get('password') as string).then((response) => {
                        if (response) {
                            localStorage.setItem('token', response.token);
                            if (response.needs_password_change) {
                                router.push('/auth/login/first-connection').then();
                                return;
                            }
                            router.push('/').then();
                        }
                    });
                }}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium">Email</label>
                        <input type="email" name="email" required className="input input-bordered w-full mt-1"/>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium">Password</label>
                        <input type="password" name="password" required className="input input-bordered w-full mt-1"/>
                    </div>
                    <button type="submit" className="mt-3 btn btn-secondary w-full">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;