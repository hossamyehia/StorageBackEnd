interface Document {
    id?: number;
    rank: string;
    name: string;
    sid: string;
    officer?: number;
    custodian: number;
    manager?: number;
    tagged: boolean;
    ratified: boolean;
    closed: boolean;
    location: number;
    createdAt: Date;
    updatedAt: Date;
}

export default Document;