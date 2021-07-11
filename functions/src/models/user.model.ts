/* eslint-disable linebreak-style */
export interface Roles {
  [key: string]: unknown;
  subscriber?: boolean;
  editor?: boolean;
  admin?: boolean;
  assistant?: boolean;
  accountant?: boolean;
  supporter?: boolean;
  issuer?: boolean;
}

export interface NewUser {
name: string;
email: string;
roles: Roles;
date?: Date;
}

export interface RegData {
id?: string;
invitationId: string;
lastName: string;
firstName: string;
nickname: string;
phone: number;
position?: string;
email: string;
password: string;
roles: Roles;
hint?: string;
registered?: Date;
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
