import React from 'react';
import {RegisterAppRequest, RegisterAppResponse, useAppController} from "@/hooks/useAppController";

type InstallationProps = {
    onInstalled: () => void;
};

const Installation: React.FC<InstallationProps> = ({onInstalled}) => {
    const {registerApp, error} = useAppController();

    const handleInstall = () => {
        onInstalled();
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-base-100 shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4 text-center">Installation</h1>
                <p className="mb-4 text-center">Complete the form below to install the app</p>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);
                    const appData: RegisterAppRequest = {
                        name: formData.get('name') as string,
                        license: {
                            id: formData.get('licenseId') as string,
                            secret: formData.get('licenseSecretId') as string,
                        },
                        admin_user: {
                            email: formData.get('adminEmail') as string,
                            first_name: formData.get('adminFirstName') as string,
                            last_name: formData.get('adminLastName') as string,
                            password: formData.get('adminPassword') as string,
                        },
                    };
                    registerApp(appData).then((response: RegisterAppResponse) => {
                        if (response.ok) {
                            handleInstall();
                        }
                    });
                }}>
                    <div>
                        <h2 className="text-lg font-semibold mb-1.5">App details</h2>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium">Organization name</label>
                            <input type="text" name="name" required className="input input-bordered w-full mt-1"/>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-1.5">License details</h2>
                        <div className="mb-4">
                            <label htmlFor="licenseId" className="block text-sm font-medium">License ID</label>
                            <input type="text" name="licenseId" required className="input input-bordered w-full mt-1"/>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="licenseSecretId" className="block text-sm font-medium">License Secret
                                ID</label>
                            <input type="text" name="licenseSecretId" required
                                   className="input input-bordered w-full mt-1"/>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-1.5">Admin User</h2>
                        <div className="mb-4">
                            <label htmlFor="adminEmail" className="block text-sm font-medium">Email</label>
                            <input type="email" name="adminEmail" required
                                   className="input input-bordered w-full mt-1"/>
                        </div>
                        <div className="flex w-full">
                            <div className="card grid h-20 flex-grow place-items-center">
                                <div className="mb-4">
                                    <label htmlFor="adminFirstName" className="block text-sm font-medium">First
                                        Name</label>
                                    <input type="text" name="adminFirstName" required
                                           className="input input-bordered w-full mt-1"/>
                                </div>
                            </div>
                            <div className="divider divider-horizontal"></div>
                            <div className="card grid h-20 flex-grow place-items-center">
                                <div className="mb-4">
                                    <label htmlFor="adminLastName" className="block text-sm font-medium">Last
                                        Name</label>
                                    <input type="text" name="adminLastName" required
                                           className="input input-bordered w-full mt-1"/>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="adminPassword" className="block text-sm font-medium">Password</label>
                            <input type="password" name="adminPassword" required
                                   className="input input-bordered w-full mt-1"/>
                        </div>
                    </div>
                    <button type="submit" className="mt-3 btn btn-secondary w-full">Install</button>
                </form>
            </div>
        </div>
    );
};

export default Installation;