interface User{
    id?:number;
    rank: string;
    name:string;
    username:string;
    password?:string;
    role: string;
}

export default User;