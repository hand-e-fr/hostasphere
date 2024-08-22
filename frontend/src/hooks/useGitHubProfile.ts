import { useEffect, useState } from 'react';

interface GitHubProfile {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    name: string;
    company: string;
    blog: string;
    location: string;
    email: string | null;
    hireable: string | null;
    bio: string;
    twitter_username: string | null;
    notification_email: string | null;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
    private_gists: number;
    total_private_repos: number;
    owned_private_repos: number;
    disk_usage: number;
    collaborators: number;
    two_factor_authentication: boolean;
    plan: {
        name: string;
        space: number;
        collaborators: number;
        private_repos: number;
    };
}

const useGitHubProfile = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [profile, setProfile] = useState<GitHubProfile | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setIsConnected(false);
            setIsLoaded(true);
            return;
        }

        const fetchGitHubProfile = async () => {
            try {
                const response = await fetch('https://api.github.com/user', {
                    headers: {
                        Authorization: `token ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Token invalide ou expiré');
                }

                const data: GitHubProfile = await response.json();
                setProfile(data);
                setIsConnected(true);
                setIsLoaded(true);
            } catch (err: unknown) {
                setError((err as Error).message);
                setIsConnected(false);
                setIsLoaded(true);
            }
        };

        fetchGitHubProfile();
    }, []);

    return { isConnected, isLoaded, profile, error, setIsConnected, setIsLoaded, setProfile };
};

export default useGitHubProfile;