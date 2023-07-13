type WorkingGroupRow = {
    key: string,
    role: string,
    responsibilities: string,
    stakeholders: string[]
}

type WorkingGroupTable = {
    id: string,
    name: string,
    rows: WorkingGroupRow[]
}