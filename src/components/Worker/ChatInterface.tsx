"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
	Send, 
	Paperclip, 
	Smile, 
	Phone, 
	Video, 
	MoreVertical,
	Clock,
	Check,
	CheckCheck,
	Image as ImageIcon,
	FileText
} from "lucide-react";

interface ChatInterfaceProps {
	workerId: string;
}

interface Message {
	id: string;
	text: string;
	sender: 'user' | 'worker';
	timestamp: Date;
	status: 'sent' | 'delivered' | 'read';
	type: 'text' | 'image' | 'file';
	imageUrl?: string;
	fileName?: string;
}

/**
 * Chat Interface Component
 * Comprehensive chat interface with RTL/LTR support and responsive design
 */
const ChatInterface: React.FC<ChatInterfaceProps> = ({ workerId }) => {
	const { language, t } = useLanguage();
	const isArabic = language === "ar";
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);
	const [isTyping, setIsTyping] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Mock worker data
	const worker = {
		id: workerId,
		name: isArabic ? "أحمد محمد" : "Ahmed Mohammed",
		avatar: "/worker1.jpg",
		status: isArabic ? "متاح الآن" : "Available Now",
		lastSeen: isArabic ? "آخر ظهور منذ دقيقتين" : "Last seen 2 minutes ago",
		rating: 4.8,
		responseTime: isArabic ? "متوسط وقت الاستجابة: 5 دقائق" : "Average response time: 5 minutes"
	};

	// Mock initial messages
	useEffect(() => {
		const initialMessages: Message[] = [
			{
				id: "1",
				text: isArabic ? "مرحباً! كيف يمكنني مساعدتك اليوم؟" : "Hello! How can I help you today?",
				sender: 'worker',
				timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
				status: 'read',
				type: 'text'
			},
			{
				id: "2",
				text: isArabic ? "أهلاً! أريد استشارة حول عقد العمل" : "Hi! I need consultation about an employment contract",
				sender: 'user',
				timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
				status: 'read',
				type: 'text'
			},
			{
				id: "3",
				text: isArabic ? "بالطبع! يمكنني مساعدتك في ذلك. هل يمكنك إرسال نسخة من العقد؟" : "Of course! I can help you with that. Can you send a copy of the contract?",
				sender: 'worker',
				timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
				status: 'read',
				type: 'text'
			}
		];
		setMessages(initialMessages);
	}, [isArabic]);

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const handleSendMessage = () => {
		if (message.trim()) {
			const newMessage: Message = {
				id: Date.now().toString(),
				text: message,
				sender: 'user',
				timestamp: new Date(),
				status: 'sent',
				type: 'text'
			};
			setMessages(prev => [...prev, newMessage]);
			setMessage("");

			// Simulate worker typing
			setIsTyping(true);
			setTimeout(() => {
				setIsTyping(false);
				const workerResponse: Message = {
					id: (Date.now() + 1).toString(),
					text: isArabic ? "شكراً لك! سأراجع العقد وأعود إليك قريباً" : "Thank you! I'll review the contract and get back to you soon",
					sender: 'worker',
					timestamp: new Date(),
					status: 'delivered',
					type: 'text'
				};
				setMessages(prev => [...prev, workerResponse]);
			}, 2000);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Simulate file upload
			const newMessage: Message = {
				id: Date.now().toString(),
				text: isArabic ? `تم إرسال الملف: ${file.name}` : `File sent: ${file.name}`,
				sender: 'user',
				timestamp: new Date(),
				status: 'sent',
				type: 'file',
				fileName: file.name
			};
			setMessages(prev => [...prev, newMessage]);
		}
	};

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString(isArabic ? 'ar-SA' : 'en-US', {
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	const getStatusIcon = (status: Message['status']) => {
		switch (status) {
			case 'sent':
				return <Check className="w-4 h-4 text-gray-400 dark:text-gray-500" />;
			case 'delivered':
				return <CheckCheck className="w-4 h-4 text-gray-400 dark:text-gray-500" />;
			case 'read':
				return <CheckCheck className="w-4 h-4 text-blue-500" />;
			default:
				return null;
		}
	};

	return (
		<div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isArabic ? "rtl" : "ltr"}`} dir={isArabic ? "rtl" : "ltr"}>
			{/* Header */}
			<div className="relative bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200/80 dark:border-gray-700/80 overflow-hidden sticky top-0 z-10">
				{/* Decorative background elements */}
				<div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-transparent to-emerald-50/20 dark:from-green-900/10 dark:via-transparent dark:to-emerald-900/10"></div>
				<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#31A342]/20 to-transparent"></div>
				
				<div className="relative px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between py-5 sm:py-6">
						<div className="flex items-center gap-3 sm:gap-4">
							<div className="relative">
								<Image
									src={worker.avatar}
									alt={worker.name}
									width={48}
									height={48}
									className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-[#31A342]/20 dark:ring-[#31A342]/30 shadow-md"
								/>
								<div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
							</div>
							<div>
								<h1 className={`text-lg sm:text-xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight ${isArabic ? "text-right" : "text-left"}`}>
									{worker.name}
								</h1>
								<div className="flex items-center gap-2 mt-0.5">
									<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
									<p className={`text-sm font-medium text-[#31A342] dark:text-green-400 ${isArabic ? "text-right" : "text-left"}`}>
										{worker.status}
									</p>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex items-center gap-1.5 sm:gap-2">
							<button 
								className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation group"
								aria-label={isArabic ? "اتصال" : "Call"}
							>
								<Phone className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-[#31A342] dark:group-hover:text-green-400 transition-colors" />
							</button>
							<button 
								className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation group"
								aria-label={isArabic ? "فيديو" : "Video"}
							>
								<Video className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-[#31A342] dark:group-hover:text-green-400 transition-colors" />
							</button>
							<button 
								className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation group"
								aria-label={isArabic ? "المزيد" : "More"}
							>
								<MoreVertical className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-[#31A342] dark:group-hover:text-green-400 transition-colors" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Chat Container */}
			<div className="flex flex-col h-[calc(100vh-80px)]">
				{/* Messages Area */}
				<div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="max-w-4xl mx-auto">
						{/* Service Info Banner */}
						<div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm border border-gray-200 dark:border-gray-700">
							<div className="flex items-center justify-between">
								<div className={`${isArabic ? "text-right" : "text-left"}`}>
									<p className="text-sm text-gray-600 dark:text-gray-400">{worker.responseTime}</p>
								</div>
								<div className="flex items-center gap-1">
									{[...Array(5)].map((_, i) => (
										<div
											key={i}
											className={`w-4 h-4 ${
												i < Math.floor(worker.rating)
													? "text-yellow-400"
													: "text-gray-300"
											}`}
										>
											★
										</div>
									))}
									<span className="text-sm text-gray-600 dark:text-gray-400 ml-1">{worker.rating}</span>
								</div>
							</div>
						</div>

						{/* Messages */}
						<div className="space-y-4">
							{messages.map((msg) => (
								<div
									key={msg.id}
									className={`flex ${msg.sender === 'user' ? (isArabic ? "justify-start" : "justify-end") : (isArabic ? "justify-end" : "justify-start")}`}
								>
									<div className={`flex items-end gap-2 max-w-xs sm:max-w-md ${msg.sender === 'user' ? (isArabic ? "flex-row-reverse" : "flex-row") : (isArabic ? "flex-row-reverse" : "flex-row")}`}>
										{msg.sender === 'worker' && (
											<Image
												src={worker.avatar}
												alt={worker.name}
												width={32}
												height={32}
												className="w-8 h-8 rounded-full object-cover flex-shrink-0"
											/>
										)}
										<div className={`${msg.sender === 'user' ? "bg-[#31A342] dark:bg-green-600" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"} rounded-2xl px-4 py-2 shadow-sm`}>
											{msg.type === 'text' && (
												<p className={`text-sm ${msg.sender === 'user' ? "text-white" : "text-gray-900 dark:text-gray-100"} ${isArabic ? "text-right" : "text-left"}`}>
													{msg.text}
												</p>
											)}
											{msg.type === 'file' && (
												<div className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : "flex-row"}`}>
													<FileText className={`w-4 h-4 ${msg.sender === 'user' ? "text-white" : "text-gray-600 dark:text-gray-400"}`} />
													<span className={`text-sm ${msg.sender === 'user' ? "text-white" : "text-gray-900 dark:text-gray-100"}`}>
														{msg.fileName}
													</span>
												</div>
											)}
											<div className={`flex items-center gap-1 mt-1 ${isArabic ? "justify-end" : "justify-start"}`}>
												<span className={`text-xs ${msg.sender === 'user' ? "text-white/70" : "text-gray-500 dark:text-gray-400"}`}>
													{formatTime(msg.timestamp)}
												</span>
												{msg.sender === 'user' && getStatusIcon(msg.status)}
											</div>
										</div>
									</div>
								</div>
							))}

							{/* Typing Indicator */}
							{isTyping && (
								<div className={`flex ${isArabic ? "justify-end" : "justify-start"}`}>
									<div className={`flex items-end gap-2 ${isArabic ? "flex-row-reverse" : "flex-row"}`}>
										<Image
											src={worker.avatar}
											alt={worker.name}
											width={32}
											height={32}
											className="w-8 h-8 rounded-full object-cover flex-shrink-0"
										/>
										<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2 shadow-sm">
											<div className="flex items-center gap-1">
												<div className="flex gap-1">
													<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
													<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
													<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
												</div>
												<span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
													{isArabic ? "يكتب..." : "typing..."}
												</span>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
						<div ref={messagesEndRef} />
					</div>
				</div>

				{/* Message Input */}
				<div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4">
					<div className="max-w-4xl mx-auto">
						<div className="flex items-end gap-3">
							{/* File Upload Button */}
							<button
								onClick={() => fileInputRef.current?.click()}
								className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex-shrink-0"
							>
								<Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
							</button>
							<input
								ref={fileInputRef}
								type="file"
								className="hidden"
								onChange={handleFileUpload}
								accept="image/*,.pdf,.doc,.docx"
							/>

							{/* Message Input */}
							<div className="flex-1 relative">
								<textarea
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									onKeyPress={handleKeyPress}
									placeholder={isArabic ? "اكتب رسالتك..." : "Type your message..."}
									className={`w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-2xl resize-none focus:ring-2 focus:ring-[#31A342] dark:focus:ring-green-500 focus:border-transparent ${isArabic ? "text-right" : "text-left"}`}
									rows={1}
									style={{ minHeight: '48px', maxHeight: '120px' }}
								/>
								<button className="absolute top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors duration-200" style={{ [isArabic ? 'left' : 'right']: '8px' }}>
									<Smile className="w-5 h-5 text-gray-600 dark:text-gray-400" />
								</button>
							</div>

							{/* Send Button */}
							<button
								onClick={handleSendMessage}
								disabled={!message.trim()}
								className="p-3 bg-[#31A342] hover:bg-[#2a8f3a] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors duration-200 flex-shrink-0"
							>
								<Send className="w-5 h-5" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatInterface;
