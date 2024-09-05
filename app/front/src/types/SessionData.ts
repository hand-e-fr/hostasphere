export interface UsageAtTime {
    time: number;
    value: number;
}

export interface SessionData {
    _id: string;
    sessionuuid: string;
    sessiontag: string;
    starttime: number;
    endtime: number;
    executiontime: number;
    memoryusage: UsageAtTime[];
    cpuusage: UsageAtTime[];
    diskusage: UsageAtTime[];
    networkusage: UsageAtTime[];
    tokenid: string;
    pid: number;
    hostname: string;
    os: string;
    osversion: string;
    kernelversion: string;
    architecture: string;
    pythonversion: string;
    processor: string;
    cpucount: number;
    boottime: number;
    currentuser: string;
    date: number;
}
