"use client";
import CountUp from "react-countup";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface AnimatedCounterProps {
	end: number;
	duration?: number;
	suffix?: string;
	prefix?: string;
	decimals?: number;
}

export default function AnimatedCounter({
	end,
	duration = 2,
	suffix = "",
	prefix = "",
	decimals = 0,
}: AnimatedCounterProps) {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	return (
		<span ref={ref}>
			{isInView && (
				<CountUp
					start={0}
					end={end}
					duration={duration}
					suffix={suffix}
					prefix={prefix}
					decimals={decimals}
				/>
			)}
		</span>
	);
}

