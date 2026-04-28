"use server";
import { CheckoutFormData } from "@/app/(pages)/checkout/page";
import fetchApi from "../fetchApi";

export async function getOrdersAction() {
  const result = await fetchApi("orders", "GET", {
    includeToken: true,
  });

  if (result.status === "Success") {
    return { ...result.data, success: true };
  }

  return { success: false };
}

export async function placeOrderAction(formData: CheckoutFormData) {
  const result = await fetchApi("orders", "POST", {
    includeToken: true,
    body: {
      firstname: formData.firstName,
      lastname: formData.lastName,
      street: formData.street,
      city: formData.city,
    },
  });

  return { success: result.status === "Success" };
}
