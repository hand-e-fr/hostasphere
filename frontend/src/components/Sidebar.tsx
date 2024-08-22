import { FiMail } from "react-icons/fi";
import Link from "next/link";
import { useContext } from "react";
import { useRouter } from "next/router";
import {SidebarContext, SidebarContextType} from "@/context/SidebarContext";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import DataArrayIcon from '@mui/icons-material/DataArray';
import HomeIcon from '@mui/icons-material/Home';
import SpaIcon from '@mui/icons-material/Spa';

interface SidebarItem {
    name: string;
    href: string;
    icon: React.ComponentType;
    requiresAuth?: boolean;
    requiresRoles?: string[];
}

const sidebarItems: SidebarItem[] = [
    {
        name: "Home",
        href: "/",
        icon: HomeIcon,
    },
    {
        name: "Functions",
        href: "/register",
        icon: DataArrayIcon,
        requiresAuth: true,
    },
    {
        name: "Accounts",
        href: "/accounts",
        icon: DataArrayIcon,
        requiresAuth: true,
    }
];

const ProfileIcon = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="dropdown dropdown-top fixed bottom-3">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full">
                        <img
                            alt="Tailwind CSS Navbar component"
                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"/>
                    </div>
                </div>
                <ul
                    tabIndex={0}
                    className="menu dropdown-content bg-base-300 rounded-box z-[1] mt-4 w-52 p-2 shadow">
                    <li><a>Profil</a></li>
                    <li><a className="text-error">Se déconnecter</a></li>
                </ul>
            </div>
        </div>
    )
}

const Sidebar = () => {
    const router = useRouter();
    const {isCollapsed, toggleSidebarcollapse} = useContext<SidebarContextType>(SidebarContext);

    return (
        <div className="relative">
            <button
                className="bg-base-200 absolute right-0 top-20 border-none w-6 h-6 border border-gray-300 rounded-full flex justify-center items-center cursor-pointer transform translate-x-1/2 text-xl"
                onClick={toggleSidebarcollapse}>
                {isCollapsed ? <ArrowCircleRightIcon/> : <ArrowCircleLeftIcon/>}
            </button>
            <aside
                className={`transition-all duration-400 ease-in-out overflow-hidden ${isCollapsed ? "w-20" : "w-64"} h-full bg-base-100 p-4 flex flex-col justify-between`}>
                <div className="flex flex-col w-full">
                    {!isCollapsed ? (
                        <p className="text-xl font-semibold flex items-center">
                            <SpaIcon className="mr-2"/>
                            Hostasphere
                        </p>
                    ) : (
                        <div className="text-xl font-semibold flex items-center justify-center">
                            <SpaIcon className="mr-2" />
                        </div>
                    )}
                    <div className="divider before:bg-white after:bg-white mt-3"></div>
                    <ul className="list-none">
                        {sidebarItems.map(({name, href, icon: Icon}) => (
                            <li key={name} className="mb-4">
                                <Link
                                    href={href}
                                    className={`btn btn-ghost p-0 rounded-btn flex items-center h-[3em] ${
                                        router.pathname === href ? "bg-secondary" : ""
                                    } ${isCollapsed ? "justify-center" : "justify-start pl-4"}`}>
                                    <div className="flex justify-center items-center">
                                        <span className="mt-1">
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
                    <ProfileIcon/>
                </div>
            </aside>
        </div>
    );
};

export default Sidebar;