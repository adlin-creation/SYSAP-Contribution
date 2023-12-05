export interface JwtPayload {
    user: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
    };
  }
