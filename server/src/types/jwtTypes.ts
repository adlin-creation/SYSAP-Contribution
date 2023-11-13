export interface JwtPayload {
    patient: {
      id: number;
      name: string;
      familyName: string;
      email: string;
      programName?: string;
    };
  }
