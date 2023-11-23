export interface JwtPayload {
    patient: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
    };
  }
