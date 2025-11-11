"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserCircle } from "lucide-react";

export default function ProfileError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log error to error reporting service
		console.error("Profile page error:", error);
	}, [error]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-16">
			<div className="max-w-md text-center">
				{/* Error Icon */}
				<div className="mb-6 flex justify-center">
					<div className="rounded-full bg-red-100 p-4">
						<UserCircle className="h-12 w-12 text-red-600" />
					</div>
				</div>

				{/* Error Title */}
				<h1 className="mb-4 text-3xl font-bold text-gray-900">
					حدث خطأ ما
				</h1>

				{/* Error Message */}
				<p className="mb-6 text-lg text-gray-600">
					عذراً، حدث خطأ أثناء تحميل صفحة الملف الشخصي. يرجى المحاولة مرة أخرى.
				</p>

				{/* Error Details (Development only) */}
				{process.env.NODE_ENV === "development" && (
					<div className="mb-6 rounded-lg bg-red-50 p-4 text-right">
						<p className="text-sm font-mono text-red-800">
							{error.message}
						</p>
						{error.digest && (
							<p className="mt-2 text-xs text-red-600">
								Error ID: {error.digest}
							</p>
						)}
					</div>
				)}

				{/* Action Buttons */}
				<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
					<Button
						onClick={reset}
						className="bg-green-600 text-white hover:bg-green-700"
						size="lg"
					>
						حاول مرة أخرى
					</Button>
					<Button
						asChild
						variant="outline"
						size="lg"
						className="border-green-600 text-green-600 hover:bg-green-50"
					>
						<Link href="/home">العودة إلى الصفحة الرئيسية</Link>
					</Button>
				</div>

				{/* Additional Help */}
				<div className="mt-8 text-sm text-gray-500">
					<p>
						إذا استمرت المشكلة، يرجى{" "}
						<Link
							href="/profile/support"
							className="text-green-600 hover:underline"
						>
							الاتصال بالدعم الفني
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

