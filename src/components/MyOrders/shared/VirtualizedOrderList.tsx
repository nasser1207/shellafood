"use client";

import React, { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { motion } from "framer-motion";

interface VirtualizedOrderListProps<T> {
	items: T[];
	renderItem: (item: T, index: number) => React.ReactNode;
	estimateSize?: number;
	overscan?: number;
	className?: string;
}

export function VirtualizedOrderList<T>({
	items,
	renderItem,
	estimateSize = 200,
	overscan = 5,
	className = "",
}: VirtualizedOrderListProps<T>) {
	const parentRef = useRef<HTMLDivElement>(null);

	const virtualizer = useVirtualizer({
		count: items.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => estimateSize,
		overscan,
	});

	return (
		<div ref={parentRef} className={`h-[600px] overflow-auto ${className}`}>
			<div
				style={{
					height: `${virtualizer.getTotalSize()}px`,
					position: "relative",
				}}
			>
				{virtualizer.getVirtualItems().map((virtualItem) => (
					<div
						key={virtualItem.key}
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: `${virtualItem.size}px`,
							transform: `translateY(${virtualItem.start}px)`,
						}}
					>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: virtualItem.index * 0.02, duration: 0.3 }}
						>
							{renderItem(items[virtualItem.index], virtualItem.index)}
						</motion.div>
					</div>
				))}
			</div>
		</div>
	);
}

