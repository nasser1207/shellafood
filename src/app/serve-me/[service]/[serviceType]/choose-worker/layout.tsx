"use client";

import { BookingProvider } from "@/contexts/BookingContext";

export default function ChooseWorkerLayout({ children }: { children: React.ReactNode }) {
	return <BookingProvider>{children}</BookingProvider>;
}

