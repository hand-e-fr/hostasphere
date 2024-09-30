import Link from "next/link";
import React, {useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {SidebarContext, SidebarContextType} from "@/context/SidebarContext";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import DataArrayIcon from '@mui/icons-material/DataArray';
import HomeIcon from '@mui/icons-material/Home';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import {useAppContext} from "@/context/AppContext";

interface SidebarItem {
    name: string;
    href: string;
    icon: React.ComponentType;
    requiresAuth?: boolean;
    requireNonAuth?: boolean;
    requireAdmin?: boolean;
}

const sidebarItems: SidebarItem[] = [
    {
        name: "Home",
        href: "/",
        icon: HomeIcon,
    },
    {
        name: "Login",
        href: "/auth/login",
        icon: LoginIcon,
        requireNonAuth: true,
    },
    {
        name: "Dashboard",
        href: "/dashboard",
        requiresAuth: true,
        icon: DataArrayIcon,
    },
    {
        name: "Accounts",
        href: "/accounts",
        icon: PeopleAltIcon,
        requiresAuth: true,
        requireAdmin: true,
    },
    {
        name: "Tokens",
        href: "/settings/tokens",
        icon: VpnKeyIcon,
        requiresAuth: true,
    }
];

const Sidebar = () => {
    const router = useRouter();
    const {authInfo} = useAppContext();
    const {isCollapsed, toggleSidebarcollapse} = useContext<SidebarContextType>(SidebarContext);
    const [isAuth, setIsAuth] = useState(false);
    const [isAdmin, setAdmin] = useState(false);

    useEffect(() => {
        if (authInfo) {
            setIsAuth(authInfo.ok || false);
            setAdmin(authInfo.is_admin || false);
        }
    }, [authInfo]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/auth/login").then();
    }

    const isCurrentPath = (href: string) => {
        if (href === "/") {
            return router.pathname === "/";
        }
        return router.pathname.startsWith(href);
    }

    return (
        <div className="relative">
            <button
                className="absolute right-0 top-20 border-none w-6 h-6 border border-gray-300 rounded-full flex justify-center items-center cursor-pointer transform translate-x-1/2 text-xl"
                onClick={toggleSidebarcollapse}>
                {isCollapsed ? <ArrowCircleRightIcon/> : <ArrowCircleLeftIcon/>}
            </button>
            <aside
                className={`min-h-screen bg-base-100 p-4 flex flex-col justify-between transition-all duration-400 ease-in-out overflow-hidden ${isCollapsed ? "w-20" : "w-44"}`}>
                <div className="flex flex-col w-full">
                    {!isCollapsed ? (
                        <p className="text-xl font-semibold flex items-center">
                            HostaSphere
                        </p>
                    ) : (
                        <div className="text-xs font-semibold flex items-center justify-center">
                            Hosta<br/>Sphere.
                        </div>
                    )}
                    <div className="divider"></div>
                    <ul className="list-none">
                        {sidebarItems
                            .filter(({requiresAuth}) => !requiresAuth || isAuth)
                            .filter(({requireNonAuth}) => !requireNonAuth || !isAuth)
                            .filter(({requireAdmin}) => !requireAdmin || (isAuth && isAdmin))
                            .map(({name, href, icon: Icon}) => (
                                <li key={name} className="mb-4">
                                    <Link
                                        href={href}
                                        className={`btn btn-ghost p-0 rounded-btn flex items-center h-[3em] ${
                                            isCurrentPath(href) ? "bg-secondary" : ""
                                        } ${isCollapsed ? "justify-center" : "justify-start pl-2"}`}>
                                        <div className="flex justify-center items-center">
                                        <span className="mt-1 max-w-7">
                                            <Icon/>
                                        </span>
                                            {!isCollapsed && <span className="mt-2 ml-2">{name}</span>}
                                        </div>
                                    </Link>
                                </li>
                            ))}
                    </ul>
                </div>
                <div>
                    {isAuth && (
                        <div className="mb-4">
                            <button
                                className={`btn btn-ghost p-0 rounded-btn flex items-center h-[3em] hover:bg-error w-full
                                ${isCollapsed ? "justify-center" : "justify-start pl-4"}`} onClick={handleLogout}>
                                <div className="flex justify-center items-center">
                                        <span className="mt-1">
                                            <LogoutIcon/>
                                        </span>
                                    {!isCollapsed && <span className="mt-2 ml-2">Logout</span>}
                                </div>
                            </button>
                        </div>
                    )}
                    <div className="divider"></div>
                    <div className="text-center mt-4">
                        <p className="text-xs text-gray-500">Hostasphere © 2024</p>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default Sidebar;