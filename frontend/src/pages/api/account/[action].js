import { createAccount, login, listAccount, deleteAccount, getAccount, updateAccount } from '@/server/accountServiceClient';

export default async function handler(req, res) {
    const { action } = req.query;

    try {
        switch (action) {
            case 'create':
                const createResponse = await createAccount(req.body);
                return res.status(200).json(createResponse);
            case 'login':
                const loginResponse = await login(req.body);
                return res.status(200).json(loginResponse);
            case 'list':
                const listResponse = await listAccount(req.body);
                return res.status(200).json(listResponse);
            case 'delete':
                const deleteResponse = await deleteAccount(req.body);
                return res.status(200).json(deleteResponse);
            case 'get':
                const getResponse = await getAccount(req.body, req.headers.authorization);
                return res.status(200).json(getResponse);
            case 'update':
                const updateResponse = await updateAccount(req.body);
                return res.status(200).json(updateResponse);
            default:
                return res.status(400).json({ error: 'Invalid action' });
        }
    } catch (error) {
        console.error('Error in handler:', error);
        return res.status(500).json({ error: error.message });
    }
}
