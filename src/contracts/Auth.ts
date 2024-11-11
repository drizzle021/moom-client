export interface ApiToken {
    type: 'bearer'
    token: string
    expires_at?: string
    expires_in?: number
  }
  
  export interface RegisterData {
    name:string,
    surname: string,
    nickname: string;
    email: string,
    status: string;
    icon: string;
    password: string;
    passwordConfirmation: string
  }
  
  export interface LoginCredentials {
    email: string
    password: string
    remember: boolean
  }

  export interface User {
    name:string,
    surname: string,
    nickname: string;
    email: string,
    status: string;
    icon: string;
    state: string;
  }
  
  
 /*  export interface User {
    id: number
    email: string
    createdAt: string,
    updatedAt: string
  } */
 