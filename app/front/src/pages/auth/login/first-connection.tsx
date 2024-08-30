import React from 'react';
import {useAuthController} from "@/hooks/useAuthController";
import {useRouter} from "next/router";

const FirstConnection = () => {
    const { firstConnect, error } = useAuthController();
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-base-100 shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4 text-center">First connection</h1>
                <p className="mb-4 text-center">Please enter your new password</p>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);
                    firstConnect(formData.get('password') as string).then((response) => {
                        if (response) {
                            localStorage.setItem('token', response.token);
                            router.push('/').then();
                        }
                    });
                }}>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium">Password</label>
                        <input type="password" name="password" required className="input input-bordered w-full mt-1"/>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password-confirm" className="block text-sm font-medium">Password confirmation</label>
                        <input type="password" name="password-confirm" required className="input input-bordered w-full mt-1" onChange={(e) => {
                            const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
                            const error = document.getElementById('error') as HTMLParagraphElement;
                            const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
                            if (passwordInput.value !== e.target.value) {
                                error.innerText = "Passwords don't match";
                                submitButton.disabled = true;
                            } else {
                                error.innerText = "";
                                submitButton.disabled = false;
                            }
                        }}/>
                        <p className="link-error" id="error"></p>
                    </div>
                    <button type="submit" className="mt-3 btn btn-secondary w-full">Save</button>
                </form>
            </div>
        </div>
    );
};

export default FirstConnection;