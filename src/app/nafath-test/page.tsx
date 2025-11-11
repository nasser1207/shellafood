'use client';

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';

// Constants
const API_ENDPOINTS = {
	INITIATE: '/api/v1/investor/nafath/initiate',
	CHECK_STATUS: '/api/v1/investor/nafath/checkStatus',
	CONTRACT_PDF: '/api/v1/investor/contract-pdf',
	REGISTER: '/api/v1/investor/register',
} as const;

const POLL_INTERVAL = 3000; // 3 seconds
const DEFAULT_BASE_URL = 'https://shellafood.com';
const DEFAULT_NATIONAL_ID = '1126305067';
const DEFAULT_PHONE = '966501234567';

const DEFAULT_FORM_DATA = {
	firstName: 'محمد',
	fatherName: 'احمد',
	grandfatherName: 'علي',
	familyName: 'السعودي',
	birthDate: '1990-01-15',
	email: 'investor@example.com',
	region: 'Riyadh',
	nationalAddressEmail: 'investor@elm.sa',
	bankName: 'Al Rajhi Bank',
	iban: 'SA1234567890123456789012',
	amount: 50000,
} as const;

// Types
type StatusType = 'success' | 'error' | 'pending' | 'info';

interface StatusState {
	show: boolean;
	message: string;
	type: StatusType;
}

interface FormData {
	firstName: string;
	fatherName: string;
	grandfatherName: string;
	familyName: string;
	birthDate: string;
	email: string;
	region: string;
	nationalAddressEmail: string;
	bankName: string;
	iban: string;
	amount: number | string;
}

interface ApiResponse {
	status?: string;
	request_id?: string;
	full_name_ar?: string;
	id?: string;
	phone?: string;
	email?: string;
	amount?: number;
	is_completed?: boolean;
}

// Status Box Component
const StatusBox: React.FC<{ status: StatusState }> = React.memo(({ status }) => {
	if (!status.show) return null;

	const statusColors: Record<StatusType, string> = {
		success: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
		error: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
		pending: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800',
		info: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
	};

	return (
		<div className={`mt-4 p-4 rounded-lg border whitespace-pre-line ${statusColors[status.type]}`}>
			{status.message}
		</div>
	);
});

StatusBox.displayName = 'StatusBox';

// Step Card Component
interface StepCardProps {
	stepNumber: number;
	title: string;
	children: React.ReactNode;
}

const StepCard: React.FC<StepCardProps> = React.memo(({ stepNumber, title, children }) => (
	<div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6 border-2 border-gray-200 dark:border-gray-700">
		<div className="flex items-center gap-3 mb-4">
			<span className="bg-purple-600 dark:bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
				{stepNumber}
			</span>
			<h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{title}</h2>
		</div>
		{children}
	</div>
));

StepCard.displayName = 'StepCard';

// Input Field Component
interface InputFieldProps {
	label: string;
	value: string | number;
	onChange: (value: string) => void;
	type?: string;
	placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = React.memo(({ label, value, onChange, type = 'text', placeholder }) => (
	<div>
		<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{label}</label>
		<input
			type={type}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder={placeholder}
			className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-colors"
		/>
	</div>
));

InputField.displayName = 'InputField';

export default function NafathTestPage() {
	// Configuration state
	const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL);
	const [nationalId, setNationalId] = useState(DEFAULT_NATIONAL_ID);
	const [phone, setPhone] = useState(DEFAULT_PHONE);
	const [requestId, setRequestId] = useState('');

	// Loading states
	const [loadingStates, setLoadingStates] = useState({
		step1: false,
		step2: false,
		step3: false,
		step4: false,
	});

	// Status states
	const [statusStates, setStatusStates] = useState<Record<string, StatusState>>({
		step1: { show: false, message: '', type: 'info' },
		step2: { show: false, message: '', type: 'info' },
		step3: { show: false, message: '', type: 'info' },
		step4: { show: false, message: '', type: 'info' },
	});

	// Step enablement
	const [stepEnabled, setStepEnabled] = useState({
		step2: false,
		step3: false,
		step4: false,
	});

	// Form data
	const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);

	// Poll interval ref
	const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (pollIntervalRef.current) {
				clearInterval(pollIntervalRef.current);
			}
		};
	}, []);

	// Helper functions
	const updateLoading = useCallback((step: keyof typeof loadingStates, value: boolean) => {
		setLoadingStates((prev) => ({ ...prev, [step]: value }));
	}, []);

	const updateStatus = useCallback((step: string, message: string, type: StatusType) => {
		setStatusStates((prev) => ({
			...prev,
			[step]: { show: true, message, type },
		}));
	}, []);

	const updateFormField = useCallback((field: keyof FormData, value: string | number) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	}, []);

	// API request helper
	const apiRequest = useCallback(
		async (endpoint: string, options: RequestInit = {}) => {
			const response = await fetch(`${baseUrl}${endpoint}`, {
				...options,
				headers: {
					'Content-Type': 'application/json',
					'X-LANG': 'ar',
					'Accept': 'application/json',
					...options.headers,
				},
			});

			if (!response.ok) {
				const text = await response.text();
				throw new Error(text || `HTTP ${response.status}`);
			}

			return response;
		},
		[baseUrl]
	);

	// Step 1: Initiate Nafath
	const initiateNafath = useCallback(async () => {
		updateLoading('step1', true);
		try {
			const response = await apiRequest(API_ENDPOINTS.INITIATE, {
				method: 'POST',
				body: JSON.stringify({ national_id: nationalId }),
			});

			const data: ApiResponse = await response.json();

			if (data.status === 'sent' && data.request_id) {
				setRequestId(data.request_id);
				updateStatus(
					'step1',
					`✅ Nafath initiated successfully!\nRequest ID: ${data.request_id}\n\n⏳ Please approve on your Nafath mobile app`,
					'success'
				);
				setStepEnabled((prev) => ({ ...prev, step2: true }));
			} else {
				updateStatus('step1', `❌ Error: ${JSON.stringify(data)}`, 'error');
			}
		} catch (error) {
			updateStatus('step1', `❌ Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
		} finally {
			updateLoading('step1', false);
		}
	}, [nationalId, apiRequest, updateLoading, updateStatus]);

	// Step 2: Check Status
	const checkStatus = useCallback(async () => {
		updateLoading('step2', true);
		try {
			const response = await apiRequest(API_ENDPOINTS.CHECK_STATUS, {
				method: 'POST',
				body: JSON.stringify({ national_id: nationalId }),
			});

			const data: ApiResponse = await response.json();

			if (data.status === 'approved') {
				updateStatus(
					'step2',
					`✅ NAFATH APPROVED!\nFull Name: ${data.full_name_ar || 'N/A'}\n\nYou can now proceed to step 3 or 4`,
					'success'
				);
				setStepEnabled((prev) => ({ ...prev, step3: true, step4: true }));

				// Clear polling interval
				if (pollIntervalRef.current) {
					clearInterval(pollIntervalRef.current);
					pollIntervalRef.current = null;
				}
			} else if (data.status === 'pending') {
				updateStatus('step2', '⏳ Still pending... Auto-polling every 3 seconds', 'pending');

				// Start polling if not already polling
				if (!pollIntervalRef.current) {
					pollIntervalRef.current = setInterval(() => {
						checkStatus();
					}, POLL_INTERVAL);
				}
			} else {
				updateStatus('step2', `❌ Status: ${data.status || 'unknown'}`, 'error');
			}
		} catch (error) {
			updateStatus('step2', `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
		} finally {
			updateLoading('step2', false);
		}
	}, [nationalId, apiRequest, updateLoading, updateStatus]);

	// Step 3: Preview Contract
	const previewContract = useCallback(async () => {
		updateLoading('step3', true);
		try {
			const response = await apiRequest(API_ENDPOINTS.CONTRACT_PDF, {
				method: 'POST',
				headers: {
					Accept: 'application/pdf',
				},
				body: JSON.stringify({
					first_name: formData.firstName,
					family_name: formData.familyName,
					father_name: formData.fatherName,
					grandfather_name: formData.grandfatherName,
					national_id: nationalId,
					birth_date: formData.birthDate,
					phone: phone,
					email: formData.email,
					region: formData.region,
					national_address_email: formData.nationalAddressEmail,
					bank_name: formData.bankName,
					iban: formData.iban,
					amount: typeof formData.amount === 'string' ? parseInt(formData.amount) : formData.amount,
				}),
			});

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'contract_preview.pdf';
			a.click();
			window.URL.revokeObjectURL(url);
			updateStatus('step3', '✅ PDF downloaded successfully!', 'success');
		} catch (error) {
			updateStatus('step3', `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
		} finally {
			updateLoading('step3', false);
		}
	}, [formData, nationalId, phone, apiRequest, updateLoading, updateStatus]);

	// Step 4: Complete Registration
	const completeRegistration = useCallback(async () => {
		updateLoading('step4', true);
		try {
			const response = await apiRequest(API_ENDPOINTS.REGISTER, {
				method: 'POST',
				body: JSON.stringify({
					first_name: formData.firstName,
					family_name: formData.familyName,
					father_name: formData.fatherName,
					grandfather_name: formData.grandfatherName,
					national_id: nationalId,
					birth_date: formData.birthDate,
					phone: phone,
					email: formData.email,
					region: formData.region,
					national_address_email: formData.nationalAddressEmail,
					bank_name: formData.bankName,
					iban: formData.iban,
					amount: typeof formData.amount === 'string' ? parseInt(formData.amount) : formData.amount,
				}),
			});

			const data: ApiResponse = await response.json();

			if (response.ok) {
				updateStatus(
					'step4',
					`✅ Registration completed!\n\nID: ${data.id || 'N/A'}\nPhone: ${data.phone || 'N/A'}\nEmail: ${data.email || 'N/A'}\nAmount: ${data.amount || 'N/A'} SAR\nStatus: ${data.is_completed ? 'Completed' : 'Pending'}`,
					'success'
				);
			} else {
				updateStatus('step4', `❌ Error: ${JSON.stringify(data)}`, 'error');
			}
		} catch (error) {
			if (error instanceof Error) {
				if (error.message.includes('403')) {
					updateStatus('step4', '❌ Nafath not approved yet', 'error');
				} else if (error.message.includes('404')) {
					updateStatus('step4', '❌ Nafath request not found', 'error');
				} else {
					updateStatus('step4', `❌ Network Error: ${error.message}`, 'error');
				}
			} else {
				updateStatus('step4', '❌ Unknown error occurred', 'error');
			}
		} finally {
			updateLoading('step4', false);
		}
	}, [formData, nationalId, phone, apiRequest, updateLoading, updateStatus]);

	// Memoized form fields configuration
	const formFields = useMemo(
		() => [
			{ key: 'firstName' as const, label: 'First Name', type: 'text' },
			{ key: 'fatherName' as const, label: 'Father Name', type: 'text' },
			{ key: 'grandfatherName' as const, label: 'Grandfather Name', type: 'text' },
			{ key: 'familyName' as const, label: 'Family Name', type: 'text' },
			{ key: 'birthDate' as const, label: 'Birth Date', type: 'date' },
			{ key: 'email' as const, label: 'Email', type: 'email' },
			{ key: 'region' as const, label: 'Region', type: 'text' },
			{ key: 'nationalAddressEmail' as const, label: 'National Address Email', type: 'email' },
			{ key: 'bankName' as const, label: 'Bank Name', type: 'text' },
			{ key: 'iban' as const, label: 'IBAN', type: 'text' },
			{ key: 'amount' as const, label: 'Amount (SAR)', type: 'number' },
		],
		[]
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-600 dark:from-purple-900 to-purple-900 dark:to-purple-950 p-6 transition-colors duration-200">
			<div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transition-colors duration-200">
				<h1 className="text-3xl font-bold text-center text-purple-600 dark:text-purple-400 mb-8">
					🔐 اختبار نفاذ - Nafath Test
				</h1>

				{/* Configuration */}
				<div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6 mb-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<InputField label="🌐 Base URL" value={baseUrl} onChange={setBaseUrl} />
						<InputField label="🆔 National ID" value={nationalId} onChange={setNationalId} />
						<InputField label="📱 Phone" value={phone} onChange={setPhone} />
					</div>
				</div>

				{/* Step 1 */}
				<StepCard stepNumber={1} title="Initiate Nafath">
					<button
						onClick={initiateNafath}
						disabled={loadingStates.step1}
						className="w-full bg-purple-600 dark:bg-purple-500 text-white py-3 rounded-lg font-bold hover:bg-purple-700 dark:hover:bg-purple-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
					>
						{loadingStates.step1 ? '⏳ Processing...' : 'Start Nafath'}
					</button>
					<StatusBox status={statusStates.step1} />
				</StepCard>

				{/* Step 2 */}
				<StepCard stepNumber={2} title="Check Status">
					<button
						onClick={checkStatus}
						disabled={!stepEnabled.step2 || loadingStates.step2}
						className="w-full bg-purple-600 dark:bg-purple-500 text-white py-3 rounded-lg font-bold hover:bg-purple-700 dark:hover:bg-purple-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
					>
						{loadingStates.step2 ? '⏳ Checking...' : 'Check Status'}
					</button>
					<StatusBox status={statusStates.step2} />
				</StepCard>

				{/* Step 3 */}
				<StepCard stepNumber={3} title="Preview Contract (Optional)">
					<button
						onClick={previewContract}
						disabled={!stepEnabled.step3 || loadingStates.step3}
						className="w-full bg-purple-600 dark:bg-purple-500 text-white py-3 rounded-lg font-bold hover:bg-purple-700 dark:hover:bg-purple-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
					>
						{loadingStates.step3 ? '⏳ Generating...' : 'Generate PDF Preview'}
					</button>
					<StatusBox status={statusStates.step3} />
				</StepCard>

				{/* Step 4 */}
				<StepCard stepNumber={4} title="Complete Registration">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						{formFields.map((field) => (
							<InputField
								key={field.key}
								label={field.label}
								value={formData[field.key]}
								onChange={(value) => updateFormField(field.key, field.type === 'number' ? parseInt(value) || 0 : value)}
								type={field.type}
							/>
						))}
					</div>

					<button
						onClick={completeRegistration}
						disabled={!stepEnabled.step4 || loadingStates.step4}
						className="w-full bg-purple-600 dark:bg-purple-500 text-white py-3 rounded-lg font-bold hover:bg-purple-700 dark:hover:bg-purple-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
					>
						{loadingStates.step4 ? '⏳ Processing...' : 'Complete Registration'}
					</button>
					<StatusBox status={statusStates.step4} />
				</StepCard>
			</div>
		</div>
	);
}

