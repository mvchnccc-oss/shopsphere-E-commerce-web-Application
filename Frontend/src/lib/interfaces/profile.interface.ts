export interface GetProfileResponse {
  name: string;
  email: string;
  isSeller: boolean;
}

export type UpdateProfileResponse =
  | {
      success: true;
      token: string;
    }
  | { success: false; message?: string };

export type BecomeSellerResponse =
  | { success: true; token: string; isSeller: boolean }
  | { success: false; message?: string };
