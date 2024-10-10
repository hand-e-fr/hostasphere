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
    _id: string
    architecture: string
    boottime: number
    cpucount: number
    currentuser: string
    diskusage: UsageAtTime[]
    enddate: number
    endtime: number
    executiontime: number
    hostname: string
    kernelversion: string
    cpuusage: UsageAtTime[]
    memoryusage: UsageAtTime[]
    networkusage: UsageAtTime[]
    tokensusage: UsageAtTime[]
    trackannotations: TrackAnnotation[]
    os: string
    osversion: string
    pid: number
    processor: string
    pythonversion: string
    sessiontag: string
    sessionuuid: string
    startdate: number
    starttime: number
    tokenid: string
    totaltokens: number | undefined
}
