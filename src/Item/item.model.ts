interface Item {
    SID: string;
    brand_id: number;
    status: string;
    quantity: number;
    edara: boolean;
    location: number;
    createdAt: Date;
    updatedAt: Date;
    addedBy: string;
}

export default Item;