
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react";

const badgeDeltaVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      deltaType: {
        increase: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        moderateIncrease: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        decrease: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        moderateDecrease: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        unchanged: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      },
      size: {
        default: "text-xs py-0.5 px-2.5",
        sm: "text-[10px] py-0 px-2",
      },
    },
    defaultVariants: {
      deltaType: "unchanged",
      size: "default",
    },
  }
);

export interface BadgeDeltaProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeDeltaVariants> {
  children?: React.ReactNode;
  showIcon?: boolean;
}

export function BadgeDelta({
  className,
  deltaType,
  size,
  children,
  showIcon = true,
  ...props
}: BadgeDeltaProps) {
  const DeltaIcon = () => {
    if (!showIcon) return null;
    
    switch (deltaType) {
      case "increase":
      case "moderateIncrease":
        return <ArrowUpIcon className="mr-1 h-3 w-3" />;
      case "decrease":
      case "moderateDecrease":
        return <ArrowDownIcon className="mr-1 h-3 w-3" />;
      default:
        return <MinusIcon className="mr-1 h-3 w-3" />;
    }
  };

  return (
    <div className={cn(badgeDeltaVariants({ deltaType, size }), className)} {...props}>
      <DeltaIcon />
      {children}
    </div>
  );
}
