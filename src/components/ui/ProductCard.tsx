import Image from "next/image";
import Link from "next/link";

type TProductCardProps = {
  id: number;
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
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
      {/* Image area */}
      <div className="bg-gray-50 flex items-center justify-center h-44 p-4 group-hover:bg-gray-100 transition-colors cursor-pointer">
        {image ? (
          <Image
            src={image}
            alt={name}
            width={120}
            height={140}
            className="object-contain h-36 w-auto"
          />
        ) : (
          <div className="flex items-end justify-center gap-1 h-36">
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

      {/* Info */}
      <div className="px-3 py-3">
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-sm font-semibold text-gray-900">{name}</p>
            <p className="text-xs text-gray-400">{variant}</p>
          </div>
          <p className="text-sm font-bold" style={{ color: "#C70A24" }}>
            {price}
          </p>
        </div>

        {/* View Details button */}
        <Link
          href={`/shop/product/${id}`}
          className="w-full mt-2 py-2 rounded-lg text-white text-xs font-semibold transition-opacity hover:opacity-90 active:opacity-80 block text-center cursor-pointer mb-2"
          style={{ backgroundColor: "#C70A24" }}
        >
          View Details
        </Link>

        {/* Add to Cart button */}
        <button
          onClick={onAddToCart}
          className="w-full py-2 rounded-lg text-white text-xs font-semibold transition-opacity hover:opacity-90 active:opacity-80 cursor-pointer"
          style={{ backgroundColor: "#C70A24" }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
