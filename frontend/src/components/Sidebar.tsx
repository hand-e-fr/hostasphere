import Link from "next/link";
import {useContext} from "react";
import {useRouter} from "next/router";
import {SidebarContext, SidebarContextType} from "@/context/SidebarContext";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import DataArrayIcon from '@mui/icons-material/DataArray';
import HomeIcon from '@mui/icons-material/Home';
import SpaIcon from '@mui/icons-material/Spa';
import Person2Icon from '@mui/icons-material/Person2';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import {UserContext, UserContextType} from "@/context/UserContext";

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
        icon: PeopleAltIcon,
        requiresAuth: true,
        requiresRoles: ["admin"],
    },
    {
        name: "My Account",
        href: "/accounts/me",
        icon: Person2Icon,
        requiresAuth: true,
    }
];

const Sidebar = () => {
    const router = useRouter();
    const {isCollapsed, toggleSidebarcollapse} = useContext<SidebarContextType>(SidebarContext);
    const { isAuth, haveRoles } = useContext<UserContextType>(UserContext);

    return (
        <div className="relative">
            <button
                className="bg-base-200 absolute right-0 top-20 border-none w-6 h-6 border border-gray-300 rounded-full flex justify-center items-center cursor-pointer transform translate-x-1/2 text-xl"
                onClick={toggleSidebarcollapse}>
                {isCollapsed ? <ArrowCircleRightIcon/> : <ArrowCircleLeftIcon/>}
            </button>
            <aside
                className={`transition-all duration-400 ease-in-out overflow-hidden ${isCollapsed ? "w-20" : "w-64"} min-h-screen bg-base-100 p-4 flex flex-col justify-between`}>
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
                        {sidebarItems
                            .filter(({requiresAuth}) => !requiresAuth || (requiresAuth && isAuth))
                            .filter(({requiresRoles}) => !requiresRoles || haveRoles(requiresRoles))
                            .map(({name, href, icon: Icon}) => (
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
            </aside>
        </div>
    );
};

export default Sidebar;