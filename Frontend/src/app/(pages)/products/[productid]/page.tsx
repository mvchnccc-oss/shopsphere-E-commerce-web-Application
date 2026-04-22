import AddToCartButton from "@/components/cart/add-button";
import { getProductById } from "@/lib/actions/products.actions";
import { Product } from "@/lib/interfaces/products.interface";
import ProductCarousel from "./_components/product-carousal";

export default async function page({ params }: { params: Promise<{ productid: number }> }) {
  const { productid } = await params;
  const product: Product = await getProductById(productid);

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProductCarousel images={product.images} title={product.title} />

        <div className="flex flex-col gap-4 justify-center">
          <span className="text-sm text-muted-foreground">{product.category.name}</span>
          <h1 className="text-2xl md:text-3xl font-bold">{product.title}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
          <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            E£{product.price}
          </span>
          <AddToCartButton id={product.id} title={product.title} price={product.price} dark />
        </div>
      </div>
    </div>
  );
}
