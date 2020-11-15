
export interface Roles { 
    [key: string]: any;
    subscriber?: boolean;
    editor?: boolean;
    admin?: boolean;
    assistant?: boolean;
    accountant?: boolean;
    supporter?: boolean;
    issuer?: boolean;
 }
 export interface User {
    id?: string;
    uid?: string;
    email: string;
    lastName: string;
    firstName: string;
    nickname: string;
    phone: number;
    position?: string;
    roles: Roles;
    departmentId?: string;
    departmentName?: string;
    departmentAcronym?: string;
}