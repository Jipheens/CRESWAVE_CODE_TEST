import { privileges } from "./privileges";

export const userJSON = {
  type: "Bearer",
  id: 1,
  username: "soaadmin",
  email: "wahomejipheens@gmail.com",
  roles: ["ROLE_ADMIN"],
  privileges: privileges,
  systemGenPassword: false,
};
