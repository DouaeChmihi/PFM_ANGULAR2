export class User {
    _id?: string;
    name: string;
    email: string;
    password: string;
    role: string; // Ajouter la propriété role

    constructor(id: string, n: string, e:string, p:string, role: string){
        this._id = id;
        this.email= e;
        this.name = n;
        this.password = p;
        this.role = role; // Initialiser la propriété role
    }
}
