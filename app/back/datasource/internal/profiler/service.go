package profiler

import (
	"context"
	"fmt"
	"openHostaLogs/proto"
)

type Server struct {
	proto.UnimplementedProfilerServer
}

/*
syntax = "proto3";

package profiler_output;

option go_package = "./proto";

service Profiler {
  rpc SendProfilerOutput (ProfilerOutputRequest) returns (Response);
}

message FuncParams {
  repeated string args = 1;
  repeated string kwargs = 2;
}

message ProfilerOutput {
  string function_name = 1;
  float start_time = 2;
  float end_time = 3;
  float memory_usage = 4;
  float cpu_usage = 5;
  repeated FuncParams func_params = 6;
}

message ProfilerOutputRequest {
  string token = 1;
  ProfilerOutput profiler_output = 3;
}

message Response {
  bool ok = 1;
  string message = 2;
}

*/

func (s *Server) SendProfilerOutput(ctx context.Context, in *proto.ProfilerOutputRequest) (*proto.Response, error) {
	fmt.Printf("Received profiler output from %s :\n {FunctionName: %s,\n StartTime: %f,\n EndTime: %f,\n MemoryUsage: %f,\n CpuUsage: %f,\n FuncParams:",
		in.ProfilerOutput.GetFunctionName(),
		in.ProfilerOutput.GetFunctionName(),
		in.ProfilerOutput.GetStartTime(),
		in.ProfilerOutput.GetEndTime(),
		in.ProfilerOutput.GetMemoryUsage(),
		in.ProfilerOutput.GetCpuUsage(),
	)

	for _, param := range in.ProfilerOutput.GetFuncParams() {
		fmt.Printf("\n Args: %v,\n Types: %v,\n Kwargs: %v", param.GetArgs(), param.Types, param.GetKwargs())
	}
	fmt.Println("}")

	return &proto.Response{Ok: true, Message: "Profiler output received"}, nil
}
