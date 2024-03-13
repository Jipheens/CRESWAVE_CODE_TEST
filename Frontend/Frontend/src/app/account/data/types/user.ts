export interface User {
  department?: any
  id?: number,
  firstname?: string,
  lastname?: string,
  username?: string,
  phonenumber?: string,
  email?: string,
  createdOn?: Date,
  modifiedby?: string,
  modifiedOn?: Date,
  deleteFlag?: string,
  roles?: [
    {
      id?: string,
      name?: string
    }
  ],
  acctActive?: boolean,
  acctLocked?: boolean
}
