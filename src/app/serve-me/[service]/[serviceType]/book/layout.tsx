"use client";

import { BookingProvider } from "@/contexts/BookingContext";

export default function BookLayout({ children }: { children: React.ReactNode }) {
	return <BookingProvider>{children}</BookingProvider>;
}

