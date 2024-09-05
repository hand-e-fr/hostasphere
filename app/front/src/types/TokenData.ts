export interface Token {
    id: string;
    name: string;
    value: string;
    created_at: number;
    last_used: number;
    owner: string;
}