
export async function getAllCategories() {
 try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`);

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
   console.log(error);
  }

}