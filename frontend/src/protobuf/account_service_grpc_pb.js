// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var account_service_pb = require('./account_service_pb.js');

function serialize_protofile_account_AddRoleRequest(arg) {
  if (!(arg instanceof account_service_pb.AddRoleRequest)) {
    throw new Error('Expected argument of type protofile.account.AddRoleRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protofile_account_AddRoleRequest(buffer_arg) {
  return account_service_pb.AddRoleRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protofile_account_CreateAccountRequest(arg) {
  if (!(arg instanceof account_service_pb.CreateAccountRequest)) {
    throw new Error('Expected argument of type protofile.account.CreateAccountRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protofile_account_CreateAccountRequest(buffer_arg) {
  return account_service_pb.CreateAccountRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protofile_account_CreateAccountResponse(arg) {
  if (!(arg instanceof account_service_pb.CreateAccountResponse)) {
    throw new Error('Expected argument of type protofile.account.CreateAccountResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protofile_account_CreateAccountResponse(buffer_arg) {
  return account_service_pb.CreateAccountResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protofile_account_DeleteAccountRequest(arg) {
  if (!(arg instanceof account_service_pb.DeleteAccountRequest)) {
    throw new Error('Expected argument of type protofile.account.DeleteAccountRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protofile_account_DeleteAccountRequest(buffer_arg) {
  return account_service_pb.DeleteAccountRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protofile_account_DeleteAccountResponse(arg) {
  if (!(arg instanceof account_service_pb.DeleteAccountResponse)) {
    throw new Error('Expected argument of type protofile.account.DeleteAccountResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protofile_account_DeleteAccountResponse(buffer_arg) {
  return account_service_pb.DeleteAccountResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protofile_account_GetAccountRequest(arg) {
  if (!(arg instanceof account_service_pb.GetAccountRequest)) {
    throw new Error('Expected argument of type protofile.account.GetAccountRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protofile_account_GetAccountRequest(buffer_arg) {
  return account_service_pb.GetAccountRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protofile_account_GetAccountResponse(arg) {
  if (!(arg instanceof account_service_pb.GetAccountResponse)) {
    throw new Error('Expected argument of type protofile.account.GetAccountResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protofile_account_GetAccountResponse(buffer_arg) {
  return account_service_pb.GetAccountResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protofile_account_ListAccountRequest(arg) {
  if (!(arg instanceof account_service_pb.ListAccountRequest)) {
    throw new Error('Expected argument of type protofile.account.ListAccountRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protofile_account_ListAccountRequest(buffer_arg) {
  return account_service_pb.ListAccountRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protofile_account_ListAccountResponse(arg) {
  if (!(arg instanceof account_service_pb.ListAccountResponse)) {
    throw new Error('Expected argument of type protofile.account.ListAccountResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protofile_account_ListAccountResponse(buffer_arg) {
  return account_service_pb.ListAccountResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protofile_account_LoginRequest(arg) {
  if (!(arg instanceof account_service_pb.LoginRequest)) {
    throw new Error('Expected argument of type protofile.account.LoginRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protofile_account_LoginRequest(buffer_arg) {
  return account_service_pb.LoginRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protofile_account_LoginResponse(arg) {
  if (!(arg instanceof account_service_pb.LoginResponse)) {
    throw new Error('Expected argument of type protofile.account.LoginResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protofile_account_LoginResponse(buffer_arg) {
  return account_service_pb.LoginResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protofile_account_UpdateAccountRequest(arg) {
  if (!(arg instanceof account_service_pb.UpdateAccountRequest)) {
    throw new Error('Expected argument of type protofile.account.UpdateAccountRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protofile_account_UpdateAccountRequest(buffer_arg) {
  return account_service_pb.UpdateAccountRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protofile_account_UpdateAccountResponse(arg) {
  if (!(arg instanceof account_service_pb.UpdateAccountResponse)) {
    throw new Error('Expected argument of type protofile.account.UpdateAccountResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protofile_account_UpdateAccountResponse(buffer_arg) {
  return account_service_pb.UpdateAccountResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var AccountServiceService = exports.AccountServiceService = {
  createAccount: {
    path: '/protofile.account.AccountService/CreateAccount',
    requestStream: false,
    responseStream: false,
    requestType: account_service_pb.CreateAccountRequest,
    responseType: account_service_pb.CreateAccountResponse,
    requestSerialize: serialize_protofile_account_CreateAccountRequest,
    requestDeserialize: deserialize_protofile_account_CreateAccountRequest,
    responseSerialize: serialize_protofile_account_CreateAccountResponse,
    responseDeserialize: deserialize_protofile_account_CreateAccountResponse,
  },
  login: {
    path: '/protofile.account.AccountService/Login',
    requestStream: false,
    responseStream: false,
    requestType: account_service_pb.LoginRequest,
    responseType: account_service_pb.LoginResponse,
    requestSerialize: serialize_protofile_account_LoginRequest,
    requestDeserialize: deserialize_protofile_account_LoginRequest,
    responseSerialize: serialize_protofile_account_LoginResponse,
    responseDeserialize: deserialize_protofile_account_LoginResponse,
  },
  listAccount: {
    path: '/protofile.account.AccountService/ListAccount',
    requestStream: false,
    responseStream: false,
    requestType: account_service_pb.ListAccountRequest,
    responseType: account_service_pb.ListAccountResponse,
    requestSerialize: serialize_protofile_account_ListAccountRequest,
    requestDeserialize: deserialize_protofile_account_ListAccountRequest,
    responseSerialize: serialize_protofile_account_ListAccountResponse,
    responseDeserialize: deserialize_protofile_account_ListAccountResponse,
  },
  deleteAccount: {
    path: '/protofile.account.AccountService/DeleteAccount',
    requestStream: false,
    responseStream: false,
    requestType: account_service_pb.DeleteAccountRequest,
    responseType: account_service_pb.DeleteAccountResponse,
    requestSerialize: serialize_protofile_account_DeleteAccountRequest,
    requestDeserialize: deserialize_protofile_account_DeleteAccountRequest,
    responseSerialize: serialize_protofile_account_DeleteAccountResponse,
    responseDeserialize: deserialize_protofile_account_DeleteAccountResponse,
  },
  getAccount: {
    path: '/protofile.account.AccountService/GetAccount',
    requestStream: false,
    responseStream: false,
    requestType: account_service_pb.GetAccountRequest,
    responseType: account_service_pb.GetAccountResponse,
    requestSerialize: serialize_protofile_account_GetAccountRequest,
    requestDeserialize: deserialize_protofile_account_GetAccountRequest,
    responseSerialize: serialize_protofile_account_GetAccountResponse,
    responseDeserialize: deserialize_protofile_account_GetAccountResponse,
  },
  updateAccount: {
    path: '/protofile.account.AccountService/UpdateAccount',
    requestStream: false,
    responseStream: false,
    requestType: account_service_pb.UpdateAccountRequest,
    responseType: account_service_pb.UpdateAccountResponse,
    requestSerialize: serialize_protofile_account_UpdateAccountRequest,
    requestDeserialize: deserialize_protofile_account_UpdateAccountRequest,
    responseSerialize: serialize_protofile_account_UpdateAccountResponse,
    responseDeserialize: deserialize_protofile_account_UpdateAccountResponse,
  },
  addRole: {
    path: '/protofile.account.AccountService/AddRole',
    requestStream: false,
    responseStream: false,
    requestType: account_service_pb.AddRoleRequest,
    responseType: account_service_pb.UpdateAccountResponse,
    requestSerialize: serialize_protofile_account_AddRoleRequest,
    requestDeserialize: deserialize_protofile_account_AddRoleRequest,
    responseSerialize: serialize_protofile_account_UpdateAccountResponse,
    responseDeserialize: deserialize_protofile_account_UpdateAccountResponse,
  },
};

exports.AccountServiceClient = grpc.makeGenericClientConstructor(AccountServiceService);
