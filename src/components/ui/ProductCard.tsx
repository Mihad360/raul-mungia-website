import Image from "next/image";
import Link from "next/link";

type TProductCardProps = {
  id: number | string;
  name: string;
  variant: string;
  price: string;
  image?: string;
  onAddToCart?: () => void;
};

const ProductCard = ({
  id,
  name,
  variant,
  price,
  image,
  onAddToCart,
}: TProductCardProps) => {
  const href = `/shop/product/${id}`;

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
      <Link href={href} className="block">
        <div className="relative bg-neutral-50 w-full h-72 group-hover:bg-neutral-100 transition-colors">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain p-4"
              sizes="(min-width: 768px) 25vw, 50vw"
            />
          ) : (
            <div className="flex items-end justify-center gap-1 h-full">
              <div
                className="w-16 h-32 rounded-t-lg shadow-md"
                style={{
                  background:
                    "linear-gradient(180deg, #9ca3af 0%, #6b7280 30%, #374151 100%)",
                  borderTop: "5px solid #C70A24",
                }}
              />
            </div>
          )}
        </div>
      </Link>

      <div className="px-3 py-3 flex flex-col flex-1">
        <Link href={href} className="block mb-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                {name}
              </p>
              <p className="text-xs text-gray-400">{variant}</p>
            </div>
            <p className="text-sm font-bold shrink-0" style={{ color: "#C70A24" }}>
              {price}
            </p>
          </div>
        </Link>

        <Link
          href={href}
          className="w-full mt-auto py-2 rounded-lg text-xs font-semibold text-center border border-neutral-300 bg-neutral-100 text-neutral-800 hover:bg-neutral-200 hover:border-neutral-400 transition-colors"
        >
          View Details
        </Link>

        {onAddToCart && (
          <button
            type="button"
            onClick={onAddToCart}
            className="w-full mt-2 py-2 rounded-lg text-white text-xs font-semibold transition-opacity hover:opacity-90 active:opacity-80"
            style={{ backgroundColor: "#C70A24" }}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
