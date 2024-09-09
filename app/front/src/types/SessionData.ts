export interface UsageAtTime {
    time: number;
    memoryusage: number;
}

export interface TrackAnnotation {
    annotation: string;
    time: number;
    color: string;
}

export interface SessionData {
    _id: string;
    sessionuuid: string;
    sessiontag: string;
    starttime: number;
    startdate: number;
    endtime: number;
    enddate: number;
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
    trackannotations: TrackAnnotation[];
}
