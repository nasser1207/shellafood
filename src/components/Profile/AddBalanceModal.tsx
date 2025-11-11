"use client";

import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

interface AddBalanceModalProps {
	isOpen: boolean;
	onClose: () => void;
	onAddBalance: (amount: string) => Promise<boolean>;
}

export default function AddBalanceModal({
	isOpen,
	onClose,
	onAddBalance,
}: AddBalanceModalProps) {
	const [amount, setAmount] = useState<string>("");
	const [isOtherSelected, setIsOtherSelected] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null); // New state for validation errors

	if (!isOpen) {
		return null;
	}

	const buttonBaseClasses =
		"py-2 px-6 rounded-md border w-[200px] text-lg font-semibold transition-colors";
	const selectedButtonClasses =
		"border-orange-400 text-orange-600 bg-orange-50";
	const defaultButtonClasses =
		"border-gray-300 text-gray-700 bg-gray-50 hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50";

	const handleAddBalance = async () => {
		// --- ADDED VALIDATION LOGIC HERE ---
		const numericAmount = parseFloat(amount);
		if (isNaN(numericAmount) || numericAmount <= 0) {
			setError("الرجاء إدخال مبلغ صحيح.");
			return;
		}
		if (numericAmount > 1000) {
			setError("الحد الأقصى للإضافة هو 1000 ر.س");
			return;
		}
		// --- END OF VALIDATION LOGIC ---

		setError(null); // Clear any previous errors
		setIsLoading(true);
		await onAddBalance(amount);
		setIsLoading(false);
		onClose();
	};

	return (
		<div className="bg-opacity-50 fixed inset-0 z-50 flex h-full w-full items-center justify-center overflow-y-auto bg-gray-600">
			<div className="relative mx-auto h-[450px] w-[1000px] gap-1.5 rounded-lg bg-white p-10 shadow-xl">
				<button
					onClick={onClose}
					className="absolute top-4 left-4 text-gray-400 transition-colors hover:text-gray-600"
				>
					<FaTimes className="text-2xl" />
				</button>

				<div className="flex flex-col items-center space-y-6">
					<h2 className="w-full text-right text-xl font-bold text-gray-800">
						إضافة رصيد
					</h2>
					<span className="w-full text-right text-sm text-gray-500">
						مبلغ الشحن
					</span>

					{/* Amount Options */}
					<div className="flex w-full flex-row-reverse items-center justify-between space-x-2">
						<button
							className={`${buttonBaseClasses} ${amount === "30" && !isOtherSelected ? selectedButtonClasses : defaultButtonClasses}`}
							onClick={() => {
								setAmount("30");
								setIsOtherSelected(false);
							}}
							style={{ direction: "ltr" }}
						>
							30 ر.س
						</button>
						<button
							className={`${buttonBaseClasses} ${amount === "60" && !isOtherSelected ? selectedButtonClasses : defaultButtonClasses}`}
							onClick={() => {
								setAmount("60");
								setIsOtherSelected(false);
							}}
							style={{ direction: "ltr" }}
						>
							60 ر.س
						</button>
						<button
							className={`${buttonBaseClasses} ${amount === "100" && !isOtherSelected ? selectedButtonClasses : defaultButtonClasses}`}
							onClick={() => {
								setAmount("100");
								setIsOtherSelected(false);
							}}
							style={{ direction: "ltr" }}
						>
							100 ر.س
						</button>
						<button
							className={`flex items-center space-x-1 rounded-md px-4 py-2 font-semibold text-orange-600 ${isOtherSelected ? "bg-orange-50" : "hover:bg-gray-100"}`}
							onClick={() => {
								setAmount("");
								setIsOtherSelected(true);
							}}
						>
							<svg
								className="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M15 19l-7-7 7-7"
								/>
							</svg>
							<span>أخرى</span>
						</button>
					</div>

					{/* Manual input */}
					<div className="relative w-full">
						<input
							type="text"
							value={amount}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setAmount(e.target.value)
							}
							className="w-full rounded-md border border-gray-300 px-12 py-2 text-right placeholder:text-right focus:ring-2 focus:ring-green-500 focus:outline-none"
							placeholder="مبلغ التحويل"
						/>
						<span className="absolute top-2.5 left-3 text-gray-500">ر.س</span>
					</div>
					{/* Display error message here */}
					{error && (
						<p className="mt-1 self-end text-sm text-red-500">{error}</p>
					)}

					<p className="self-end text-xs text-gray-400">
						الحد الأقصى 1000.00 ر.س
					</p>

					{/* Add Balance Button */}
					<button
						className="w-full rounded-md bg-green-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-600 disabled:opacity-50"
						onClick={handleAddBalance}
						disabled={isLoading || !amount}
					>
						{isLoading ? "جاري الإضافة..." : "إضافة الرصيد"}
					</button>
				</div>
			</div>
		</div>
	);
}
