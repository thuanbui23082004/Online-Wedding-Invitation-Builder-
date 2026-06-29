"use client";
import * as React from "react";
import { cn } from "../lib/utils";
import {
    motion,
    useAnimationFrame,
    useMotionTemplate,
    useMotionValue,
    useTransform,
} from "framer-motion";

// ----------------------
// 🔹 Moving Border Core
// ----------------------
function MovingBorder({
                          children,
                          duration = 4000,
                          rx,
                          ry,
                      }: {
    children: React.ReactNode;
    duration?: number;
    rx?: string;
    ry?: string;
}) {
    const pathRef = React.useRef<SVGRectElement>(null);
    const progress = useMotionValue(0);

    useAnimationFrame((time) => {
        const length = pathRef.current?.getTotalLength();
        if (length) {
            const pxPerMs = length / duration;
            progress.set((time * pxPerMs) % length);
        }
    });

    const x = useTransform(progress, (v) => pathRef.current?.getPointAtLength(v)?.x ?? 0);
    const y = useTransform(progress, (v) => pathRef.current?.getPointAtLength(v)?.y ?? 0);
    const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className="absolute h-full w-full"
                width="100%"
                height="100%"
            >
                <rect fill="none" width="100%" height="100%" rx={rx} ry={ry} ref={pathRef} />
            </svg>
            <motion.div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    display: "inline-block",
                    transform,
                }}
            >
                {children}
            </motion.div>
        </>
    );
}

// ----------------------
// 🔹 Card with Moving Border
// ----------------------
function Card({
                  className,
                  borderColor = "var(--sky-500)",
                  duration = 4000,
                  borderRadius = "0.75rem",
                  children,
                  ...props
              }: React.ComponentProps<"div"> & {
    borderColor?: string;
    duration?: number;
    borderRadius?: string;
}) {
    return (
        <div
            data-slot="card"
            className={cn("relative p-[2px] overflow-hidden rounded-xl", className)}
            style={{ borderRadius }}
            {...props}
        >
            <div className="absolute inset-0">
                <MovingBorder duration={duration} rx="15%" ry="15%">
                    <div
                        className="h-32 w-32 opacity-[0.5]"
                        style={{
                            background: `radial-gradient(${borderColor} 40%, transparent 60%)`,
                        }}
                    />
                </MovingBorder>
            </div>

            <motion.div
                className={cn(
                    "relative bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 dark:border-slate-800 py-6 shadow-sm",
                    // Thêm transition cho shadow và transform để mượt mà hơn
                    "transition-all duration-300 ease-in-out"
                )}
                style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}


                whileHover={{
                    scale: 1.03,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",// Tăng bóng đổ nhẹ
                    transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
            >
                {children}
            </motion.div>
        </div>
    );
}

// ----------------------
// 🔹 Other Card Parts
// ----------------------
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-header"
            className={cn(
                "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
                className
            )}
            {...props}
        />
    );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div data-slot="card-title" className={cn("leading-none font-semibold", className)} {...props} />
    );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-description"
            className={cn("text-muted-foreground text-sm", className)}
            {...props}
        />
    );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-action"
            className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
            {...props}
        />
    );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
    return <div data-slot="card-content" className={cn("px-6", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-footer"
            className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
            {...props}
        />
    );
}

// ----------------------
// 🔹 Export
// ----------------------
export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardAction,
    CardDescription,
    CardContent,
};