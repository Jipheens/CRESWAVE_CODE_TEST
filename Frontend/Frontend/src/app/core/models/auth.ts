import { Role } from "./role";

export class Auth {
  id: number;
  username: string;
  email: string;
  roles: [string];
  accessToken: string;
  tokenType: string;
  token: string;
  privileges: [string];
 
}
