export interface FuncParam {
    arg: string;
    argname: string;
    type: string;
}

export interface ReturnedValue {
    type: string;
    value: string;
}

export interface ProfilerData {
    _id: string;
    cpuusage: number;
    endtime: number;
    enddate: number;
    executiontime: number;
    funcparams: FuncParam[];
    functioncaller: string;
    functionid: string;
    functionname: string;
    memoryusage: number;
    returnedvalue: ReturnedValue;
    starttime: number;
    startdate: number;
    tokenid: string;
    sessionuuid: string;
}