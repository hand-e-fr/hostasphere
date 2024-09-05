export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    password?: string;
    is_admin: boolean;
    created_at: number;
    needs_password_change: boolean;
}
