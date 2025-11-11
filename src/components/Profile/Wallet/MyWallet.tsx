"use client";

import { useEffect, useState } from "react";
import {
	Wallet,
	Plus,
	Minus,
	ArrowUpRight,
	ArrowDownLeft,
	CheckCircle2,
	Clock,
	AlertCircle,
	History,
	CreditCard,
	Receipt,
	RefreshCw,
	TrendingUp,
	Shield,
	Activity,
	Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AddBalanceModal from "../AddBalanceModal";
import Toast from "../Toast";

interface Transaction {
	id: string;
	type: "deposit" | "withdraw" | "payment";
	description: string;
	amount: number;
	date: string;
	status: "completed" | "pending" | "failed";
}

type FilterType = "all" | "deposit" | "withdraw" | "payment";

export default function MyWallet() {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [activeFilter, setActiveFilter] = useState<FilterType>("all");
	const [walletStatus, setWalletStatus] = useState<"active" | "pending" | "frozen">("active");

	// Monthly limit and usage
	const monthlyLimit = 5000;
	const [monthlyUsage, setMonthlyUsage] = useState<number>(0);

	// Load balance from localStorage, or default to 0
	const [balance, setBalance] = useState<number>(() => {
		if (typeof window !== "undefined") {
			const savedBalance = localStorage.getItem("walletBalance");
			return savedBalance ? parseFloat(savedBalance) : 0;
		}
		return 0;
	});

	const [toastState, setToastState] = useState<{
		message: string;
		type: "success" | "failure";
	} | null>(null);

	// Mock transactions data (in real app, this would come from API)
	const [transactions] = useState<Transaction[]>([
		{
			id: "1",
			type: "deposit",
			description: "إضافة رصيد",
			amount: 500.0,
			date: "2024-01-15",
			status: "completed",
		},
		{
			id: "2",
			type: "payment",
			description: "دفع طلب من متجر - شلة",
			amount: -89.5,
			date: "2024-01-14",
			status: "completed",
		},
		{
			id: "3",
			type: "deposit",
			description: "إضافة رصيد",
			amount: 200.0,
			date: "2024-01-13",
			status: "completed",
		},
		{
			id: "4",
			type: "payment",
			description: "دفع خدمة - السباكة",
			amount: -250.0,
			date: "2024-01-12",
			status: "completed",
		},
		{
			id: "5",
			type: "withdraw",
			description: "سحب رصيد",
			amount: -150.0,
			date: "2024-01-11",
			status: "pending",
		},
		{
			id: "6",
			type: "deposit",
			description: "إضافة رصيد",
			amount: 1000.0,
			date: "2024-01-10",
			status: "completed",
		},
	]);

	// Calculate monthly usage from transactions
	useEffect(() => {
		const currentMonth = new Date().getMonth();
		const currentYear = new Date().getFullYear();
		const monthlyTransactions = transactions.filter((t) => {
			const transactionDate = new Date(t.date);
			return (
				transactionDate.getMonth() === currentMonth &&
				transactionDate.getFullYear() === currentYear &&
				t.status === "completed"
			);
		});
		const totalUsed = monthlyTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
		setMonthlyUsage(totalUsed);
	}, [transactions]);

	// Save balance to localStorage whenever it changes
	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("walletBalance", balance.toString());
		}
	}, [balance]);

	// Auto-hide toast after 3 seconds
	useEffect(() => {
		if (toastState) {
			const timer = setTimeout(() => {
				setToastState(null);
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [toastState]);

	const handleAddBalance = async (amount: string): Promise<boolean> => {
		setIsLoading(true);
		return new Promise((resolve) => {
			setTimeout(() => {
				const numericAmount = parseFloat(amount);
				setBalance((prevBalance) => prevBalance + numericAmount);
				setIsLoading(false);
				setToastState({
					message: `تم إضافة ${numericAmount.toFixed(2)} ر.س إلى المحفظة بنجاح`,
					type: "success",
				});
				resolve(true);
			}, 1500);
		});
	};

	const handleWithdraw = () => {
		setToastState({
			message: "سيتم تفعيل سحب الرصيد قريباً",
			type: "failure",
		});
	};

	const handlePay = () => {
		setToastState({
			message: "سيتم تفعيل الدفع من المحفظة قريباً",
			type: "failure",
		});
	};

	const getTransactionIcon = (type: string) => {
		switch (type) {
			case "deposit":
				return <ArrowDownLeft className="w-5 h-5" />;
			case "withdraw":
				return <ArrowUpRight className="w-5 h-5" />;
			case "payment":
				return <Receipt className="w-5 h-5" />;
			default:
				return <CreditCard className="w-5 h-5" />;
		}
	};

	const getTransactionColor = (type: string) => {
		switch (type) {
			case "deposit":
				return "text-green-600 bg-green-50";
			case "withdraw":
				return "text-red-600 bg-red-50";
			case "payment":
				return "text-blue-600 bg-blue-50";
			default:
				return "text-gray-600 bg-gray-50";
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

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "active":
				return (
					<div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold">
						<div className="w-2 h-2 bg-green-500 rounded-full"></div>
						نشط
					</div>
				);
			case "pending":
				return (
					<div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full text-xs font-semibold">
						<div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
						قيد الانتظار
					</div>
				);
			case "frozen":
				return (
					<div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-full text-xs font-semibold">
						<div className="w-2 h-2 bg-red-500 rounded-full"></div>
						مجمّد
					</div>
				);
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

	const filteredTransactions =
		activeFilter === "all"
			? transactions
			: transactions.filter((t) => t.type === activeFilter);

	const usagePercentage = (monthlyUsage / monthlyLimit) * 100;
	const currentMonthTotal = transactions.filter((t) => {
		const transactionDate = new Date(t.date);
		const currentMonth = new Date().getMonth();
		const currentYear = new Date().getFullYear();
		return (
			transactionDate.getMonth() === currentMonth &&
			transactionDate.getFullYear() === currentYear
		);
	}).length;

	const filters: { key: FilterType; label: string; icon: React.ReactNode }[] = [
		{ key: "all", label: "الكل", icon: <Filter className="w-4 h-4" /> },
		{ key: "deposit", label: "إيداع", icon: <ArrowDownLeft className="w-4 h-4" /> },
		{ key: "withdraw", label: "سحب", icon: <ArrowUpRight className="w-4 h-4" /> },
		{ key: "payment", label: "دفع", icon: <Receipt className="w-4 h-4" /> },
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-white p-4 md:p-6 lg:p-8" dir="rtl">
			<div className="max-w-6xl mx-auto space-y-6">
				{/* Header Section */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="mb-6"
				>
					<h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">محفظتي</h2>
					<p className="text-gray-600 text-sm md:text-base">إدارة رصيدك بسهولة وأمان</p>
				</motion.div>

				{/* Premium Wallet Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="relative overflow-hidden rounded-2xl shadow-xl border border-gray-100 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 p-6 md:p-8 text-white"
				>
					{/* Decorative Elements */}
					<div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
					<div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
					<div className="absolute top-4 left-4 w-32 h-32 bg-white/5 rounded-full"></div>

					<div className="relative z-10">
						{/* Card Header */}
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-3">
								<div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
									<Wallet className="w-6 h-6" />
								</div>
								<div>
									<span className="text-sm font-semibold opacity-90 block">محفظة شلة</span>
									{getStatusBadge(walletStatus)}
								</div>
							</div>
							<button
								onClick={() => setIsModalOpen(true)}
								className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all"
								aria-label="إضافة رصيد"
							>
								<Plus className="w-5 h-5" />
							</button>
						</div>

						{/* Balance Display */}
						<div className="mb-8">
							<p className="text-sm font-medium opacity-80 mb-2">الرصيد المتاح</p>
							<div className="flex items-baseline gap-2">
								<motion.span
									key={balance}
									initial={{ scale: 1.1 }}
									animate={{ scale: 1 }}
									className="text-4xl md:text-5xl font-extrabold"
								>
									{balance.toFixed(2)}
								</motion.span>
								<span className="text-xl md:text-2xl font-bold opacity-90">ر.س</span>
							</div>
						</div>

						{/* Quick Actions */}
						<div className="grid grid-cols-3 gap-3">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setIsModalOpen(true)}
								disabled={isLoading}
								className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 font-semibold text-sm hover:bg-white/30 transition-all flex flex-col items-center gap-2 disabled:opacity-50"
							>
								{isLoading ? (
									<RefreshCw className="w-5 h-5 animate-spin" />
								) : (
									<Plus className="w-5 h-5" />
								)}
								<span>إيداع</span>
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleWithdraw}
								className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 font-semibold text-sm hover:bg-white/30 transition-all flex flex-col items-center gap-2"
							>
								<Minus className="w-5 h-5" />
								<span>سحب</span>
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handlePay}
								className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 font-semibold text-sm hover:bg-white/30 transition-all flex flex-col items-center gap-2"
							>
								<Receipt className="w-5 h-5" />
								<span>دفع</span>
							</motion.button>
						</div>
					</div>
				</motion.div>

				{/* Monthly Limit & Usage Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8"
				>
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-3">
							<div className="p-2.5 bg-green-50 rounded-xl">
								<Activity className="w-5 h-5 text-green-600" />
							</div>
							<div>
								<h3 className="text-lg font-bold text-gray-900">الحد الشهري</h3>
								<p className="text-sm text-gray-500">استخدامك لهذا الشهر</p>
							</div>
						</div>
						<div className="text-left">
							<p className="text-2xl font-extrabold text-gray-900">
								{monthlyUsage.toFixed(2)} / {monthlyLimit.toFixed(2)} ر.س
							</p>
							<p className="text-xs text-gray-500 mt-1">
								{currentMonthTotal} معاملة هذا الشهر
							</p>
						</div>
					</div>
					<div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
						<motion.div
							initial={{ width: 0 }}
							animate={{ width: `${Math.min(usagePercentage, 100)}%` }}
							transition={{ duration: 1, ease: "easeOut" }}
							className={`absolute top-0 right-0 h-full rounded-full ${
								usagePercentage >= 90
									? "bg-red-500"
									: usagePercentage >= 70
										? "bg-yellow-500"
										: "bg-green-500"
							}`}
						></motion.div>
					</div>
					<div className="flex items-center justify-between mt-2 text-xs text-gray-500">
						<span>المستخدم</span>
						<span>{usagePercentage.toFixed(1)}%</span>
					</div>
				</motion.div>

				{/* Transactions Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8"
				>
					{/* Section Header */}
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
							<History className="w-6 h-6 text-green-600" />
							سجل المعاملات
						</h3>
						<button className="flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">
							<History className="w-4 h-4" />
							<span>عرض الكل</span>
						</button>
					</div>

					{/* Filter Pills */}
					<div className="flex flex-wrap gap-2 mb-6">
						{filters.map((filter) => (
							<button
								key={filter.key}
								onClick={() => setActiveFilter(filter.key)}
								className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
									activeFilter === filter.key
										? "bg-green-600 text-white shadow-md"
										: "bg-gray-100 text-gray-700 hover:bg-gray-200"
								}`}
							>
								{filter.icon}
								<span>{filter.label}</span>
							</button>
						))}
					</div>

					{/* Transactions List */}
					{filteredTransactions.length > 0 ? (
						<div className="space-y-3">
							{filteredTransactions.map((transaction, index) => (
								<motion.div
									key={transaction.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.3, delay: index * 0.05 }}
									className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
								>
									<div className="flex items-center gap-4 flex-1">
										{/* Transaction Icon */}
										<div className={`p-3 rounded-xl ${getTransactionColor(transaction.type)}`}>
											{getTransactionIcon(transaction.type)}
										</div>

										{/* Transaction Details */}
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<p className="font-semibold text-gray-900">{transaction.description}</p>
												{getStatusIcon(transaction.status)}
											</div>
											<p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
										</div>
									</div>

									{/* Amount */}
									<div className="text-left">
										<p
											className={`text-lg font-bold ${
												transaction.amount > 0 ? "text-green-600" : "text-red-600"
											}`}
										>
											{transaction.amount > 0 ? "+" : ""}
											{transaction.amount.toFixed(2)} ر.س
										</p>
									</div>
								</motion.div>
							))}
						</div>
					) : (
						/* Empty State */
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3 }}
							className="flex flex-col items-center justify-center py-16 px-4"
						>
							<div className="relative mb-6">
								<div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full blur-2xl opacity-50"></div>
								<div className="relative p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
									<CreditCard className="w-16 h-16 text-green-600" />
								</div>
							</div>
							<p className="text-lg font-semibold text-gray-700 mb-2">لا توجد معاملات</p>
							<p className="text-sm text-gray-500 text-center max-w-md">
								{activeFilter === "all"
									? "لم يتم إجراء أي معاملات حتى الآن. ابدأ بإضافة رصيد إلى محفظتك."
									: `لا توجد معاملات من نوع "${filters.find((f) => f.key === activeFilter)?.label}"`}
							</p>
						</motion.div>
					)}
				</motion.div>

				{/* Modals */}
				<AddBalanceModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					onAddBalance={handleAddBalance}
				/>

				{/* Toast Notification - Top Center */}
				<AnimatePresence>
					{toastState && (
						<motion.div
							initial={{ opacity: 0, y: -100 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -100 }}
							className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
							dir="rtl"
						>
							<Toast message={toastState.message} type={toastState.type} />
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
