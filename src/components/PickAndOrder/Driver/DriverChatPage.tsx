"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import {
	ArrowLeft,
	Send,
	Paperclip,
	Smile,
	Phone,
	MoreVertical,
	Check,
	CheckCheck,
	Truck,
	Bike,
} from "lucide-react";

interface Message {
	id: string;
	senderId: string;
	text: string;
	timestamp: Date;
	status: "sent" | "delivered" | "read";
}

interface DriverChatPageProps {
	driverId: string;
}

export default function DriverChatPage({ driverId }: DriverChatPageProps) {
	const { language } = useLanguage();
	const router = useRouter();
	const isArabic = language === "ar";
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLTextAreaElement>(null);

	const [driver, setDriver] = useState<{
		id: string;
		name: string;
		avatar: string;
		online: boolean;
		vehicleType: "truck" | "motorbike";
		lastSeen: Date;
		phone?: string;
	}>({
		id: driverId,
		name: isArabic ? "أحمد محمد" : "Ahmed Mohammed",
		avatar: "/driver1.jpg",
		online: true,
		vehicleType: "truck",
		lastSeen: new Date(),
	});

	// Load driver data from sessionStorage
	useEffect(() => {
		const storedDriverData = sessionStorage.getItem(`driver_${driverId}`);
		
		if (storedDriverData) {
			try {
				const parsedDriver = JSON.parse(storedDriverData);
				setDriver({
					id: parsedDriver.id || driverId,
					name: isArabic ? (parsedDriver.nameAr || parsedDriver.name) : (parsedDriver.name || parsedDriver.nameAr),
					avatar: parsedDriver.avatar || "/driver1.jpg",
					online: true,
					vehicleType: parsedDriver.vehicleType === "motorbike" ? "motorbike" : "truck",
					lastSeen: new Date(),
					phone: parsedDriver.phone,
				});
			} catch (error) {
				console.error("Error parsing stored driver data:", error);
			}
		}
	}, [driverId, isArabic]);

	const [messages, setMessages] = useState<Message[]>([
		{
			id: "1",
			senderId: driverId,
			text: isArabic
				? "مرحباً! أنا جاهز لتوصيل طلبك. كيف يمكنني مساعدتك؟"
				: "Hello! I'm ready to deliver your order. How can I help you?",
			timestamp: new Date(Date.now() - 10000),
			status: "read",
		},
	]);

	const [newMessage, setNewMessage] = useState("");
	const [isTyping, setIsTyping] = useState(false);

	// Auto scroll to bottom
	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messages, scrollToBottom]);

	// Mock typing indicator
	useEffect(() => {
		if (isTyping) {
			const timer = setTimeout(() => setIsTyping(false), 3000);
			return () => clearTimeout(timer);
		}
	}, [isTyping]);

	const handleSend = useCallback(() => {
		if (!newMessage.trim()) return;

		const message: Message = {
			id: Date.now().toString(),
			senderId: "me",
			text: newMessage,
			timestamp: new Date(),
			status: "sent",
		};

		setMessages((prev) => [...prev, message]);
		setNewMessage("");

		// Simulate driver typing
		setTimeout(() => setIsTyping(true), 1000);

		// Simulate driver response
		setTimeout(() => {
			setIsTyping(false);
			const response: Message = {
				id: (Date.now() + 1).toString(),
				senderId: driverId,
				text: isArabic
					? "فهمت! سأكون هناك في الوقت المحدد."
					: "Got it! I'll be there on time.",
				timestamp: new Date(),
				status: "delivered",
			};
			setMessages((prev) => [...prev, response]);
		}, 3000);

		// Update message status
		setTimeout(() => {
			setMessages((prev) =>
				prev.map((msg) =>
					msg.id === message.id ? { ...msg, status: "delivered" } : msg
				)
			);
		}, 1000);

		setTimeout(() => {
			setMessages((prev) =>
				prev.map((msg) =>
					msg.id === message.id ? { ...msg, status: "read" } : msg
				)
			);
		}, 2000);
	}, [newMessage, driverId, isArabic]);

	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				handleSend();
			}
		},
		[handleSend]
	);

	const VehicleIcon = driver.vehicleType === "truck" ? Truck : Bike;
	const vehicleColor = driver.vehicleType === "truck" ? "#31A342" : "#FA9D2B";

	return (
		<div className={`min-h-screen flex flex-col ${isArabic ? "rtl" : "ltr"}`} dir={isArabic ? "rtl" : "ltr"}>
			{/* Header */}
			<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
				<div className="max-w-5xl mx-auto px-4 py-3 sm:py-4">
					<div className="flex items-center gap-3 sm:gap-4">
						{/* Back Button */}
						<button
							onClick={() => router.back()}
							className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
						>
							<ArrowLeft className={`w-5 h-5 ${isArabic ? "rotate-180" : ""}`} />
						</button>

						{/* Driver Info */}
						<div className="flex items-center gap-3 flex-1 min-w-0">
							<div className="relative flex-shrink-0">
								<Image
									src={driver.avatar}
									alt={driver.name}
									width={48}
									height={48}
									className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
								/>
								<div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
									<VehicleIcon className="w-3 h-3" style={{ color: vehicleColor }} />
								</div>
								{driver.online && (
									<div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
								)}
							</div>
							<div className="flex-1 min-w-0">
								<h2 className="font-bold text-gray-900 dark:text-gray-100 truncate">
									{driver.name}
								</h2>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									{driver.online
										? isArabic
											? "متصل الآن"
											: "Online now"
										: isArabic
										? "آخر ظهور منذ 5 دقائق"
										: "Last seen 5 min ago"}
								</p>
							</div>
						</div>

						{/* Actions */}
						<div className="flex items-center gap-2">
							<button
								onClick={() => {
									if (driver.phone) {
										window.location.href = `tel:${driver.phone}`;
									}
								}}
								disabled={!driver.phone}
								className="p-2 sm:p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
							</button>
							<button className="p-2 sm:p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
								<MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Messages Area */}
			<div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
				<div className="max-w-5xl mx-auto px-4 py-6">
					<div className="space-y-4">
						{/* Date Divider */}
						<div className="flex items-center justify-center">
							<span className="px-4 py-1.5 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs rounded-full shadow-sm">
								{isArabic ? "اليوم" : "Today"}
							</span>
						</div>

						{/* Messages */}
						{messages.map((message) => {
							const isMe = message.senderId === "me";
							return (
								<motion.div
									key={message.id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className={`flex ${isMe ? "justify-end" : "justify-start"}`}
								>
									<div
										className={`max-w-[70%] sm:max-w-md ${
											isMe
												? "bg-[#31A342] text-white"
												: "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
										} rounded-2xl px-4 py-2.5 shadow-sm`}
									>
										<p className="text-sm sm:text-base leading-relaxed break-words">
											{message.text}
										</p>
										<div
											className={`flex items-center gap-1 mt-1 ${
												isMe ? "justify-end" : "justify-start"
											}`}
										>
											<span
												className={`text-[10px] sm:text-xs ${
													isMe
														? "text-white/70"
														: "text-gray-500 dark:text-gray-400"
												}`}
											>
												{message.timestamp.toLocaleTimeString(
													isArabic ? "ar-SA" : "en-US",
													{
														hour: "2-digit",
														minute: "2-digit",
													}
												)}
											</span>
											{isMe && (
												<span className="text-white/70">
													{message.status === "sent" && (
														<Check className="w-3 h-3" />
													)}
													{message.status === "delivered" && (
														<CheckCheck className="w-3 h-3" />
													)}
													{message.status === "read" && (
														<CheckCheck className="w-3 h-3 text-blue-300" />
													)}
												</span>
											)}
										</div>
									</div>
								</motion.div>
							);
						})}

						{/* Typing Indicator */}
						{isTyping && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className="flex justify-start"
							>
								<div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm">
									<div className="flex items-center gap-1">
										<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
										<div
											className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
											style={{ animationDelay: "0.1s" }}
										></div>
										<div
											className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
											style={{ animationDelay: "0.2s" }}
										></div>
									</div>
								</div>
							</motion.div>
						)}

						<div ref={messagesEndRef} />
					</div>
				</div>
			</div>

			{/* Input Area */}
			<div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sticky bottom-0">
				<div className="max-w-5xl mx-auto px-4 py-3 sm:py-4">
					<div className="flex items-end gap-2 sm:gap-3">
						{/* Attachment Button */}
						<button className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0">
							<Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
						</button>

						{/* Input */}
						<div className="flex-1 relative">
							<textarea
								ref={inputRef}
								value={newMessage}
								onChange={(e) => setNewMessage(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder={isArabic ? "اكتب رسالة..." : "Type a message..."}
								rows={1}
								className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#31A342] transition-colors resize-none text-sm sm:text-base"
								style={{ maxHeight: "120px" }}
							/>
							<button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
								<Smile className="w-5 h-5 text-gray-600 dark:text-gray-400" />
							</button>
						</div>

						{/* Send Button */}
						<button
							onClick={handleSend}
							disabled={!newMessage.trim()}
							className="p-3 bg-[#31A342] hover:bg-[#2a8f38] disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-xl transition-colors shadow-md disabled:cursor-not-allowed flex-shrink-0"
						>
							<Send className={`w-5 h-5 ${isArabic ? "rotate-180" : ""}`} />
						</button>
					</div>

					{/* Quick Replies (Optional) */}
					<div className="flex flex-wrap gap-2 mt-3">
						{[
							isArabic ? "شكراً" : "Thanks",
							isArabic ? "في الطريق" : "On my way",
							isArabic ? "وصلت" : "Arrived",
						].map((text, idx) => (
							<button
								key={idx}
								onClick={() => setNewMessage(text)}
								className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-xs sm:text-sm font-medium transition-colors"
							>
								{text}
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

