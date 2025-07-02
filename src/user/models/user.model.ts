export interface UserModel {
  userId?: string;
  identificationNumber: string;
  fullName: string;
  email: string;
  roleType: string;
  password?: string;
  confirmPassword?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface UserModelComplete {
  userId?: string;
  identificationNumber: string;
  fullName: string;
  email: string;
  roleType: RoleType;
  password?: string;
  confirmPassword?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface UpdateUserModel {
  identificationNumber: string;
  fullName: string;
  email: string;
  dateOfBirth: Date;
  roleType: string;
}

export interface RoleType {
  roleTypeId?: string;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface ChangePasswordModel {
  id?: string;
  password?: string;
  confirmPassword?: string;
}

export interface UserFiltersModel {
  where?: UserWhereModel;
  relations?: 'roles';
}

export interface UserWhereModel {
  id?: string;
  identification?: string;
  email?: string;
}
