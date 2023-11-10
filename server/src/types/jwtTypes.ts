export interface JwtPayload {
    user: {
      id: number;
      name: string;
      familyName: string;
      email: string;
      programName?: string;
    };
  }
