export interface GetProfileResponse {
  name: string;
  email: string;
}

export type UpdateProfileResponse =
  | {
      success: true;
      token: string;
    }
  | { success: false; message?: string };
