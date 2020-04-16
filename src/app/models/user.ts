export interface UserData {
    name: string;
    telephone: string;
    email: string;
}

export interface userActivation {
    telephone: string;
    activationCode: string;
}

export interface pairedList {
    class: number,
    id: string,
    address: string,
    name: string
}