package profiler

import (
	"context"
	"fmt"
	config "openHostaLogs/internal/db"
	"openHostaLogs/proto"
)

type Server struct {
	proto.UnimplementedProfilerServer
}

func (s *Server) SendProfilerOutput(ctx context.Context, in *proto.ProfilerOutputRequest) (*proto.Response, error) {
	fmt.Printf("Received profiler output from %s (%s) :\n StartTime: %f\n EndTime: %f\n MemoryUsage: %f\n CpuUsage: %f\n FuncParams:\n",
		in.ProfilerOutput.GetFunctionName(),
		in.ProfilerOutput.GetFunctionId(),
		in.ProfilerOutput.GetStartTime(),
		in.ProfilerOutput.GetEndTime(),
		in.ProfilerOutput.GetMemoryUsage(),
		in.ProfilerOutput.GetCpuUsage(),
	)

	for _, param := range in.ProfilerOutput.GetFuncParams() {
		fmt.Printf("  %v: %v (%v)\n", param.GetArgName(), param.GetArg(), param.GetType())
	}

	fmt.Println("Execution time: ", in.ProfilerOutput.GetExecutionTime(), "milliseconds")
	fmt.Println("Called by: ", in.ProfilerOutput.GetFunctionCaller())

	// save to mongoDB
	collection := config.GetCollection("profiler")
	_, err := collection.InsertOne(context.Background(), in.ProfilerOutput)
	if err != nil {
		return &proto.Response{Ok: false, Message: "Failed to save profiler output"}, err
	}
	return &proto.Response{Ok: true, Message: "Profiler output received"}, nil
}
