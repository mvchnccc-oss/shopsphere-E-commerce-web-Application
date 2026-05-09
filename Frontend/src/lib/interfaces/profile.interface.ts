export interface GetProfileResponse {
  name: string;
  email: string;
  role: string;
}

export type UpdateProfileResponse =
  | {
      success: true;
      token: string;
    }
  | { success: false; message?: string };

export type BecomeSellerResponse =
  | { success: true; token: string; role: string; accessTokenExpires: number }
  | { success: false; message?: string };
