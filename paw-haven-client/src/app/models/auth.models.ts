export interface LoginModel {
  Email: string;
  Password: string;
}

export interface RegisterUserModel {
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
}

export interface UserTokenDataModel {
  Token: string;
  RefreshToken: string;
}

export interface RefreshTokenModel {
  OldToken: string;
  RefreshToken: string;
}