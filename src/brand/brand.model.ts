interface Brand{
    id?: number;    
    name: string;  
    model: string; 
    type: number;  // Category ID
    quantityType: string;  // Quantity Type ('بالعدد', 'بالرول', 'بالمتر')
    total?: number;  // Total Number Of Devices of Brand
}

export default Brand;