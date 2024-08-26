// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var github_account_service_pb = require('./github_account_service_pb.js');

function serialize_protofile_account_CreateGithubAccountRequest(arg) {
  if (!(arg instanceof github_account_service_pb.CreateGithubAccountRequest)) {
    throw new Error('Expected argument of type protofile.account.CreateGithubAccountRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protofile_account_CreateGithubAccountRequest(buffer_arg) {
  return github_account_service_pb.CreateGithubAccountRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protofile_account_CreateGithubAccountResponse(arg) {
  if (!(arg instanceof github_account_service_pb.CreateGithubAccountResponse)) {
    throw new Error('Expected argument of type protofile.account.CreateGithubAccountResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protofile_account_CreateGithubAccountResponse(buffer_arg) {
  return github_account_service_pb.CreateGithubAccountResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var GithubAccountServiceService = exports.GithubAccountServiceService = {
  createGithubAccount: {
    path: '/protofile.account.GithubAccountService/CreateGithubAccount',
    requestStream: false,
    responseStream: false,
    requestType: github_account_service_pb.CreateGithubAccountRequest,
    responseType: github_account_service_pb.CreateGithubAccountResponse,
    requestSerialize: serialize_protofile_account_CreateGithubAccountRequest,
    requestDeserialize: deserialize_protofile_account_CreateGithubAccountRequest,
    responseSerialize: serialize_protofile_account_CreateGithubAccountResponse,
    responseDeserialize: deserialize_protofile_account_CreateGithubAccountResponse,
  },
};

exports.GithubAccountServiceClient = grpc.makeGenericClientConstructor(GithubAccountServiceService);
