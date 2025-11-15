"use client";

import React, { useState, useEffect } from "react";
import {
	Wallet,
	RefreshCw,
	CreditCard,
	ArrowUpRight,
	ArrowDownLeft,
	ArrowLeftRight,
	CheckCircle2,
	Clock,
	AlertCircle,
	TrendingUp,
	Shield,
} from "lucide-react";
import { motion } from "framer-motion";

interface Transaction {
	id: string;
	type: "payment" | "deposit" | "transfer";
	description: string;
	amount: number;
	date: string;
	status: "completed" | "pending" | "failed";
}

export default function KaidhaWallet() {
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [progress, setProgress] = useState(50); // Progress percentage

	// Mock transactions data
	const transactions: Transaction[] = [
		{
			id: "1",
			type: "payment",
			description: "دفع خدمة - السباكة",
			amount: -250.00,
			date: "2024-01-15",
			status: "completed",
		},
		{
			id: "2",
			type: "deposit",
			description: "إضافة رصيد",
			amount: 1000.00,
			date: "2024-01-14",
			status: "completed",
		},
		{
			id: "3",
			type: "transfer",
			description: "تحويل إلى محفظة أخرى",
			amount: -150.00,
			date: "2024-01-13",
			status: "pending",
		},
		{
			id: "4",
			type: "payment",
			description: "دفع متجر - شلة",
			amount: -89.50,
			date: "2024-01-12",
			status: "completed",
		},
	];

	const totalBalance = 4800.09;
	const cardLimit = 2500;
	const availableBalance = 5500.00;
	const usedAmount = cardLimit - (availableBalance - totalBalance);
	const progressPercentage = (usedAmount / cardLimit) * 100;

	// Animate progress bar on mount
	useEffect(() => {
		setProgress(progressPercentage);
	}, [progressPercentage]);

	const handleRefresh = async () => {
		setIsRefreshing(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setIsRefreshing(false);
	};

	const getTransactionIcon = (type: string) => {
		switch (type) {
			case "payment":
				return <ArrowUpRight className="w-5 h-5" />;
			case "deposit":
				return <ArrowDownLeft className="w-5 h-5" />;
			case "transfer":
				return <ArrowLeftRight className="w-5 h-5" />;
			default:
				return <ArrowLeftRight className="w-5 h-5" />;
		}
	};

	const getTransactionColor = (type: string) => {
		switch (type) {
			case "payment":
				return "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30";
			case "deposit":
				return "text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-900/30";
			case "transfer":
				return "text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30";
			default:
				return "text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "completed":
				return <CheckCircle2 className="w-4 h-4 text-green-500" />;
			case "pending":
				return <Clock className="w-4 h-4 text-yellow-500" />;
			case "failed":
				return <AlertCircle className="w-4 h-4 text-red-500" />;
			default:
				return null;
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("ar-SA", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 dark:from-gray-900 via-green-50/20 dark:via-green-900/10 to-white dark:to-gray-900 p-4 md:p-6 lg:p-8" dir="rtl">
			<div className="max-w-6xl mx-auto space-y-6">
				{/* Header Section */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="flex items-center justify-between mb-6"
				>
					<div className="flex items-center gap-4">
						<div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
							<Wallet className="w-8 h-8 text-white" />
						</div>
						<h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100">محفظة قيدها</h2>
					</div>
					<button
						onClick={handleRefresh}
						disabled={isRefreshing}
						className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
						aria-label="تحديث الرصيد"
					>
						<RefreshCw
							className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isRefreshing ? "animate-spin" : ""}`}
						/>
					</button>
				</motion.div>

				{/* Balance Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="relative overflow-hidden rounded-2xl shadow-lg border border-gray-100 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-6 md:p-8 text-white"
				>
					{/* Decorative Pattern */}
					<div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
					<div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

					<div className="relative z-10">
						{/* Card Header */}
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-2">
								<Shield className="w-5 h-5" />
								<span className="text-sm font-medium opacity-90">محفظة قيدها</span>
							</div>
							<div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
								<div className="w-2 h-2 bg-green-400 rounded-full"></div>
								<span className="text-xs font-semibold">متاح</span>
							</div>
						</div>

						{/* Total Balance */}
						<div className="mb-6">
							<p className="text-sm font-medium opacity-80 mb-2">الرصيد الإجمالي</p>
							<h3 className="text-4xl md:text-5xl font-extrabold mb-2">
								SAR {totalBalance.toLocaleString("ar-SA", { minimumFractionDigits: 2 })}
							</h3>
						</div>

						{/* Card Number */}
						<div className="mb-6">
							<p className="text-xs font-medium opacity-70 mb-2">رقم البطاقة</p>
							<div className="flex items-center gap-2">
								<CreditCard className="w-5 h-5 opacity-80" />
								<span className="text-lg md:text-xl font-mono tracking-wider">
									5520 XXXX XXXX 7167
								</span>
							</div>
						</div>

						{/* Payment Button */}
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="w-full md:w-auto bg-white text-emerald-600 rounded-full px-8 py-4 font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
						>
							<ArrowUpRight className="w-5 h-5" />
							الدفع الآن
						</motion.button>
					</div>
				</motion.div>

				{/* Progress Bar Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-8"
				>
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-2">
							<TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
							<span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
								قيدها <span className="text-green-600 dark:text-green-400">متاح</span>
							</span>
						</div>
						<span className="text-sm font-bold text-gray-900 dark:text-gray-100">
							{progressPercentage.toFixed(0)}%
						</span>
					</div>
					<div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
						<motion.div
							initial={{ width: 0 }}
							animate={{ width: `${progress}%` }}
							transition={{ duration: 1, ease: "easeOut" }}
							className="absolute top-0 right-0 h-full bg-gradient-to-l from-green-500 to-emerald-600 rounded-full"
						></motion.div>
					</div>
				</motion.div>

				{/* Details Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="grid grid-cols-1 md:grid-cols-2 gap-4"
				>
					{/* Card Limit */}
					<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow">
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center gap-3">
								<div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
									<CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
								</div>
								<span className="text-sm font-semibold text-gray-600 dark:text-gray-400">حد البطاقة</span>
							</div>
						</div>
						<p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
							SAR {cardLimit.toLocaleString("ar-SA")}
						</p>
					</div>

					{/* Available Balance */}
					<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow">
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center gap-3">
								<div className="p-2.5 bg-green-50 dark:bg-green-900/30 rounded-xl">
									<Wallet className="w-5 h-5 text-green-600 dark:text-green-400" />
								</div>
								<span className="text-sm font-semibold text-gray-600 dark:text-gray-400">الرصيد المتاح</span>
							</div>
						</div>
						<p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
							SAR {availableBalance.toLocaleString("ar-SA", { minimumFractionDigits: 2 })}
						</p>
					</div>
				</motion.div>

				{/* Recent Transactions Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
					className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-8"
				>
					<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">عمليات المحفظة الأخيرة</h3>
					<div className="space-y-4">
						{transactions.map((transaction, index) => (
							<motion.div
								key={transaction.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
								className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
							>
								<div className="flex items-center gap-4 flex-1">
									{/* Transaction Icon */}
									<div
										className={`p-3 rounded-xl ${getTransactionColor(transaction.type)}`}
									>
										{getTransactionIcon(transaction.type)}
									</div>

									{/* Transaction Details */}
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											<p className="font-semibold text-gray-900 dark:text-gray-100">
												{transaction.description}
											</p>
											{getStatusIcon(transaction.status)}
										</div>
										<p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(transaction.date)}</p>
									</div>
								</div>

								{/* Amount */}
								<div className="text-left">
									<p
										className={`text-lg font-bold ${
											transaction.amount > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
										}`}
									>
										{transaction.amount > 0 ? "+" : ""}
										SAR {Math.abs(transaction.amount).toLocaleString("ar-SA", { minimumFractionDigits: 2 })}
									</p>
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
		</div>
	);
}
