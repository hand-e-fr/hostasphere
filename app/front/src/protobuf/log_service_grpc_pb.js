// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var log_service_pb = require('./log_service_pb.js');

function serialize_protofile_log_LogRequest(arg) {
  if (!(arg instanceof log_service_pb.LogRequest)) {
    throw new Error('Expected argument of type protofile.log.LogRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protofile_log_LogRequest(buffer_arg) {
  return log_service_pb.LogRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protofile_log_LogResponse(arg) {
  if (!(arg instanceof log_service_pb.LogResponse)) {
    throw new Error('Expected argument of type protofile.log.LogResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protofile_log_LogResponse(buffer_arg) {
  return log_service_pb.LogResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var LogServiceService = exports.LogServiceService = {
  sendLogRequest: {
    path: '/protofile.log.LogService/SendLogRequest',
    requestStream: false,
    responseStream: false,
    requestType: log_service_pb.LogRequest,
    responseType: log_service_pb.LogResponse,
    requestSerialize: serialize_protofile_log_LogRequest,
    requestDeserialize: deserialize_protofile_log_LogRequest,
    responseSerialize: serialize_protofile_log_LogResponse,
    responseDeserialize: deserialize_protofile_log_LogResponse,
  },
};

exports.LogServiceClient = grpc.makeGenericClientConstructor(LogServiceService);
