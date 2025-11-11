import { FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";

export default function HelpAndSupport() {
	return (
		<div className="flex flex-col">
			<h2 className="mb-8 text-right text-2xl font-bold text-gray-800">
				المساعدة والدعم
			</h2>

			{/* صورة الدعم Placeholder */}
			<div className="mb-8 flex justify-center">
				<img
					src="helpsupport.jpg"
					alt="Support"
					className="h-auto w-full rounded-lg"
				/>
			</div>

			<div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
				{/* قسم العناوين */}
				<div className="flex-row- flex items-center justify-between border-b border-gray-200 pb-4">
					<div className="flex-row- flex items-center space-x-2">
						<FaMapMarkerAlt className="text-2xl text-green-600" />
						<div className="flex flex-col text-right">
							<span className="text-lg font-semibold text-gray-900">
								عناويننا
							</span>
							<span className="text-sm text-gray-500">
								ksa, saudi arabia , umm al hammam
							</span>
						</div>
					</div>
				</div>

				{/* قسم الهاتف */}
				<div className="flex-row- flex items-center justify-between border-b border-gray-200 pb-4">
					<div className="flex-row- flex items-center space-x-2">
						<FaPhone className="text-2xl text-green-600" />
						<div className="flex flex-col text-right">
							<span className="text-lg font-semibold text-gray-900">
								اتصل بنا
							</span>
							<span className="text-sm text-gray-500">920000000</span>
						</div>
					</div>
				</div>

				{/* قسم البريد الإلكتروني */}
				<div className="flex-row- flex items-center justify-between pb-4">
					<div className="flex-row- flex items-center space-x-2">
						<FaEnvelope className="text-2xl text-green-600" />
						<div className="flex flex-col text-right">
							<span className="text-lg font-semibold text-gray-900">
								راسلنا
							</span>
							<span className="text-sm text-gray-500">
								support@shilla.com
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
