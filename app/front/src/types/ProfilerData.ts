export interface FuncParam {
    arg: string;
    argname: string;
    type: string;
}

export interface ReturnedValue {
    type: string;
    value: string;
}

export interface FunctionCall {
    callerfile: string;
    callerline: number;
    caller: string;
}

export interface CustomTracerData {
    OpenHostaTracer: {
        data: {
            _last_request: string;
            _last_response: string;
        }
    }
}

export interface ProfilerData {
    _id: string;
    cpuusage: number;
    endtime: number;
    enddate: number;
    executiontime: number;
    funcparams: FuncParam[];
    functioncallers: FunctionCall[];
    functionid: string;
    functionname: string;
    memoryusage: number;
    returnedvalue: ReturnedValue;
    starttime: number;
    startdate: number;
    tokenid: string;
    sessionuuid: string;
    sourcecode: string
    customtracerdata: CustomTracerData;
}