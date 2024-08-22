import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import useGitHubProfile from "@/hooks/useGitHubProfile";
import {useRouter} from "next/router";
import useWindowSize from "@/hooks/useWindowSize";

const GitHubLoginButton = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} className="btn btn-ghost rounded-btn">
        <GitHubIcon />
        <span>Se connecter avec GitHub</span>
    </button>
);

const GitHubProfileDropdown = ({ profile, onLogout, onProfile }: { profile: any, onLogout: () => void, onProfile: () => void }) => (
    <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
                {profile && (
                    <img src={profile.avatar_url} alt={profile.login} />
                )}
            </div>
        </div>
        <ul
            tabIndex={0}
            className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-52 p-2 shadow">
            <li><a onClick={onProfile}>Profil</a></li>
            <li><a className="text-error" onClick={onLogout}>Se déconnecter</a></li>
        </ul>
    </div>
);

interface HeaderProps {
    sidebarIsActive: boolean;
    toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarIsActive, toggleSidebar }) => {
    const { isConnected, isLoaded, profile, setIsLoaded, setIsConnected, setProfile } = useGitHubProfile();
    const router = useRouter();
    const size = useWindowSize();

    const handleGithubLogin = () => {
        if (localStorage.getItem('token')) {
            localStorage.removeItem('token');
            setIsLoaded(false);
        }
        window.location.href = `https://github.com/login/oauth/authorize?client_id=Ov23liFtgZPWgogGpEnq&scope=read:user,user:email,read:org`;
    };

    const handleProfile = () => {
        router.push('/user/profile').then(r => {});
    };

    const handleGithubLogout = () => {
        localStorage.removeItem('token');
        setIsConnected(false);
        setIsLoaded(true);
    };

    return (
        <header className="fixed navbar bg-base-100">
            <div className="navbar-start">
                <label className="btn btn-circle swap swap-rotate">
                    <input type="checkbox" checked={sidebarIsActive} readOnly onClick={toggleSidebar}/>
                    <svg
                        className="swap-off fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 512 512">
                        <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"/>
                    </svg>
                    <svg
                        className="swap-on fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 512 512">
                        <polygon
                            points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"/>
                    </svg>
                </label>
            </div>
            <div className={`navbar-center ${size.width && size.width < 768 ? 'hidden' : ''}`}>
                <a className="btn btn-ghost text-xl">HostaSphere</a>
            </div>
            <div className="navbar-end">
                <button className="btn btn-ghost btn-circle">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                </button>
                <button className="btn btn-ghost btn-circle">
                    <div className="indicator">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                        </svg>
                        <span className="badge badge-xs badge-primary indicator-item"></span>
                    </div>
                </button>

                <div className="ml-2">
                    <div className="flex items-stretch">
                        {isConnected ? (
                            <GitHubProfileDropdown profile={profile} onLogout={handleGithubLogout} onProfile={handleProfile}/>
                        ) : isLoaded && (
                            <GitHubLoginButton onClick={handleGithubLogin}/>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;