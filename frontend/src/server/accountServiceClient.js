const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(
    './src/protobuf/protofile/account_service.proto',
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    }
);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const accountService = protoDescriptor.protofile.account.AccountService;
const client = new accountService(
    'localhost:50051',  // Ensure this is the correct address and port
    grpc.credentials.createInsecure()
);

const createAccount = (data) => {
    return new Promise((resolve, reject) => {
        client.CreateAccount(data, (error, response) => {
            if (error) {
                console.error('gRPC Error:', error);
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
};

const login = (data) => {
    return new Promise((resolve, reject) => {
        client.Login(data, (error, response) => {
            if (error) {
                console.error('gRPC Error:', error);
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
};

const listAccount = (data) => {
    return new Promise((resolve, reject) => {
        client.ListAccount(data, (error, response) => {
            if (error) {
                console.error('gRPC Error:', error);
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
};

const deleteAccount = (data) => {
    return new Promise((resolve, reject) => {
        client.DeleteAccount(data, (error, response) => {
            if (error) {
                console.error('gRPC Error:', error);
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
};

const getAccount = (data, authorization) => {
    return new Promise((resolve, reject) => {
        const metadata = new grpc.Metadata();
        metadata.add('authorization', authorization);

        client.GetAccount(data, metadata, (error, response) => {
            if (error) {
                console.error('gRPC Error:', error);
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
};

const updateAccount = (data) => {
    return new Promise((resolve, reject) => {
        client.UpdateAccount(data, (error, response) => {
            if (error) {
                console.error('gRPC Error:', error);
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
};

module.exports = {
    createAccount,
    login,
    listAccount,
    deleteAccount,
    getAccount,
    updateAccount,
};
