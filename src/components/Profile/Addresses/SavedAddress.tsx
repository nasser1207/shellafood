"use client";
import {
	Autocomplete,
	GoogleMap,
	Marker,
	useJsApiLoader,
} from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";

interface Address {
	id: string;
	address: string;
	createdAt: string;
	formattedAddress?: string; // العنوان النصي المنسق
}

interface SavedAddressProps {
	setActivePage?: (page: string) => void;
}

export default function SavedAddress({ setActivePage }: SavedAddressProps) {
	const [addresses, setAddresses] = useState<Address[]>([]);
	const [location, setLocation] = useState<string>(""); // lat,lng
	const [addressText, setAddressText] = useState<string>(""); // النص
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
	const [isAddingNew, setIsAddingNew] = useState(false);

	const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

	// تحميل مكتبة جوجل
	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
		libraries: ["places", "geometry"],
	});

	// دالة لتحويل الإحداثيات إلى عنوان نصي
	async function convertCoordinatesToAddress(coordinates: string): Promise<string> {
		if (!isLoaded) return coordinates;
		
		try {
			const [lat, lng] = coordinates.split(",").map(Number);
			const geocoder = new google.maps.Geocoder();
			
			return new Promise((resolve) => {
				geocoder.geocode({ location: { lat, lng } }, (results, status) => {
					if (results && results.length > 0) {
						resolve(results[0].formatted_address);
					} else {
						resolve(coordinates); // إذا فشل التحويل، نرجع الإحداثيات
					}
				});
			});
		} catch (error) {
			console.error("Error converting coordinates:", error);
			return coordinates;
		}
	}

	// جلب جميع العناوين من DB
	useEffect(() => {
		async function fetchAddresses() {
			try {
				const { getAddressesAction } = await import("@/app/actions/address");
				const result = await getAddressesAction();
				if (!result.success) {
					return;
				}
				const addressesData = result.data?.addresses || [];
				
				// تحويل جميع العناوين إلى نصوص
				const addressesWithFormatted = await Promise.all(
					addressesData.map(async (address: Address) => {
						const formattedAddress = await convertCoordinatesToAddress(address.address);
						return { ...address, formattedAddress };
					})
				);
				
				setAddresses(addressesWithFormatted);
				// إذا كان هناك عناوين، نعرض أول عنوان على الخريطة
				if (addressesWithFormatted.length > 0) {
					setLocation(addressesWithFormatted[0].address);
				}
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}
		fetchAddresses();
	}, [isLoaded]);

	// دالة مساعدة لإعادة الجلب والتطبيق بعد عمليات الإضافة/التحديث/الحذف
	async function refetchAndApplyAddresses() {
		try {
			const { getAddressesAction } = await import("@/app/actions/address");
			const result = await getAddressesAction();
			if (!result.success) {
				return;
			}
			const addressesData = result.data?.addresses || [];
			const addressesWithFormatted = await Promise.all(
				addressesData.map(async (address: Address) => {
					const formattedAddress = await convertCoordinatesToAddress(address.address);
					return { ...address, formattedAddress };
				})
			);
			setAddresses(addressesWithFormatted);
			if (addressesWithFormatted.length > 0) {
				setLocation(addressesWithFormatted[0].address);
			}
		} catch (err) {
			console.error(err);
		}
	}

	// تحويل الإحداثيات إلى عنوان نصي
	useEffect(() => {
		if (!isLoaded || !location) return;

		const geocoder = new google.maps.Geocoder();
		const [lat, lng] = location.split(",").map(Number);

		geocoder.geocode({ location: { lat, lng } }, (results, status) => {
			if (!results || results.length === 0) {
				setAddressText("عنوان غير متوفر");
				return;
			}
			setAddressText(results[0].formatted_address);
		});
	}, [isLoaded, location]);

	// عند اختيار مكان من البحث
	function handlePlaceChanged() {
		const place = autocompleteRef.current?.getPlace();
		if (place?.geometry?.location) {
			const lat = place.geometry.location.lat();
			const lng = place.geometry.location.lng();
			setLocation(`${lat},${lng}`);
		}
	}

	// إضافة عنوان جديد
	async function handleAddAddress() {
		try {
			const { addAddressAction } = await import("@/app/actions/address");
			const result = await addAddressAction({ address: location });
			if (result.success) {
				alert("تم إضافة العنوان بنجاح!");
				// إعادة جلب العناوين وتطبيقها
				await refetchAndApplyAddresses();
				setIsAddingNew(false);
				setIsEditing(false);
				setLocation("");
			} else {
				alert(result.error || "حدث خطأ أثناء إضافة العنوان");
			}
		} catch (err) {
			console.error(err);
			alert("حدث خطأ أثناء إضافة العنوان");
		}
	}

	// تحديث عنوان موجود
	async function handleUpdateAddress() {
		if (!editingAddressId) return;
		
		try {
			const { updateAddressAction } = await import("@/app/actions/address");
			const result = await updateAddressAction({ addressId: editingAddressId, address: location });
			if (result.success) {
				alert("تم تحديث العنوان بنجاح!");
				// إعادة جلب العناوين وتطبيقها
				await refetchAndApplyAddresses();
				setIsEditing(false);
				setEditingAddressId(null);
			} else {
				alert(result.error || "حدث خطأ أثناء تحديث العنوان");
			}
		} catch (err) {
			console.error(err);
			alert("حدث خطأ أثناء تحديث العنوان");
		}
	}

	// حذف عنوان
	async function handleDeleteAddress(addressId: string) {
		if (!confirm("هل أنت متأكد من حذف هذا العنوان؟")) return;
		
		try {
			const { deleteAddressAction } = await import("@/app/actions/address");
			const result = await deleteAddressAction(addressId);
			if (result.success) {
				alert("تم حذف العنوان بنجاح!");
				// إعادة جلب العناوين وتطبيقها
				await refetchAndApplyAddresses();
			} else {
				alert(result.error || "حدث خطأ أثناء حذف العنوان");
			}
		} catch (err) {
			console.error(err);
			alert("حدث خطأ أثناء حذف العنوان");
		}
	}

	// بدء تعديل عنوان
	async function startEditing(address: Address) {
		setEditingAddressId(address.id);
		setLocation(address.address);
		// تحديث العنوان النصي للعنوان المحدد
		const formattedAddress = await convertCoordinatesToAddress(address.address);
		setAddressText(formattedAddress);
		setIsEditing(true);
		setIsAddingNew(false);
	}

	// بدء إضافة عنوان جديد
	function startAddingNew() {
		setIsAddingNew(true);
		setIsEditing(true);
		setEditingAddressId(null);
		setLocation("");
		setAddressText("");
	}

	// إلغاء التعديل
	function cancelEditing() {
		setIsEditing(false);
		setIsAddingNew(false);
		setEditingAddressId(null);
		setLocation(addresses.length > 0 ? addresses[0].address : "");
	}

	if (loading) return <div className="p-8 text-center">جارٍ التحميل...</div>;

	const lat = parseFloat(location.split(",")[0]) || 24.7136;
	const lng = parseFloat(location.split(",")[1]) || 46.6753;

	return (
		<div className="flex flex-col">
			<div className="mb-6 flex items-center justify-between">
				<h2 className="text-right text-2xl font-bold text-gray-800">
					العناوين المحفوظة
				</h2>
				<button
					onClick={startAddingNew}
					className="rounded-md bg-green-600 px-4 py-2 font-bold text-white transition-colors hover:bg-green-700"
				>
					+ إضافة عنوان جديد
				</button>
			</div>

			{/* قائمة العناوين */}
			{!isEditing && (
				<div className="mb-6">
					{addresses.length === 0 ? (
						<div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
							<p className="text-gray-500 mb-4">لا توجد عناوين محفوظة</p>
							<button
								onClick={startAddingNew}
								className="rounded-md bg-green-600 px-4 py-2 font-bold text-white transition-colors hover:bg-green-700"
							>
								إضافة عنوان جديد
							</button>
						</div>
					) : (
						<div className="grid gap-4 md:grid-cols-2">
							{addresses.map((address) => (
								<div key={address.id} className="rounded-lg border border-gray-200 p-4">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<p className="text-sm text-gray-500 mb-1">
												{new Date(address.createdAt).toLocaleDateString('ar-SA')}
											</p>
											<p className="text-gray-800 font-medium">
												📍 {address.formattedAddress || address.address}
											</p>
										</div>
										<div className="flex gap-2">
											<button
												onClick={() => startEditing(address)}
												className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
											>
												تعديل
											</button>
											<button
												onClick={() => handleDeleteAddress(address.id)}
												className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
											>
												حذف
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			)}

			{/* الخريطة */}
			{!isEditing && addresses.length > 0 && (
				<div className="mb-6">
					<h3 className="mb-4 text-right text-lg font-bold text-gray-800">
						العنوان على الخريطة
					</h3>
					<div className="h-[300px] w-full overflow-hidden rounded-lg shadow">
						{isLoaded && (
							<GoogleMap
								mapContainerStyle={{ width: "100%", height: "100%" }}
								center={{ lat, lng }}
								zoom={14}
							>
								<Marker position={{ lat, lng }} />
							</GoogleMap>
						)}
					</div>
					<p className="mt-2 text-center text-gray-700">
						📍 {addressText || "جارٍ جلب العنوان..."}
					</p>
				</div>
			)}

			{/* وضع التعديل/الإضافة */}
			{isEditing && (
				<div className="mt-6">
					<h3 className="mb-4 text-right text-lg font-bold text-gray-800">
						{isAddingNew ? "إضافة عنوان جديد" : "تعديل العنوان"}
					</h3>
					
					<div className="relative h-[400px] w-full">
						{isLoaded && (
							<div className="absolute top-2 left-1/2 z-50 flex w-[320px] -translate-x-1/2 gap-2">
								{/* البحث */}
								<Autocomplete
									onLoad={(ac) => (autocompleteRef.current = ac)}
									onPlaceChanged={handlePlaceChanged}
								>
									<input
										type="text"
										placeholder="ابحث عن موقعك..."
										className="w-full rounded-lg border bg-white px-4 py-2 shadow focus:outline-none"
									/>
								</Autocomplete>

								{/* زر موقعي */}
								<button
									onClick={() => {
										if (navigator.geolocation) {
											navigator.geolocation.getCurrentPosition(
												(pos) => {
													const lat = pos.coords.latitude;
													const lng = pos.coords.longitude;
													setLocation(`${lat},${lng}`);
												},
												() => alert("تعذر تحديد موقعك!"),
											);
										} else {
											alert("المتصفح لا يدعم تحديد الموقع");
										}
									}}
									className="rounded-lg bg-green-600 px-3 py-2 text-white shadow hover:bg-green-700"
								>
									موقعي
								</button>
							</div>
						)}

						{isLoaded ? (
							<GoogleMap
								mapContainerStyle={{ width: "100%", height: "100%" }}
								center={{ lat, lng }}
								zoom={12}
								onClick={(e) => {
									if (e.latLng) {
										const lat = e.latLng.lat();
										const lng = e.latLng.lng();
										setLocation(`${lat},${lng}`);
									}
								}}
							>
								{location && <Marker position={{ lat, lng }} />}
							</GoogleMap>
						) : (
							<p>جارٍ تحميل الخريطة...</p>
						)}
					</div>

					{/* الأزرار */}
					<div className="mt-6 flex flex-col-reverse items-center gap-4 md:flex-row-reverse">
						<button
							onClick={isAddingNew ? handleAddAddress : handleUpdateAddress}
							className="w-full rounded-md bg-green-600 px-6 py-3 font-bold text-white transition-colors hover:bg-green-700 md:w-auto"
						>
							{isAddingNew ? "إضافة العنوان" : "تحديث العنوان"}
						</button>
						<button
							onClick={cancelEditing}
							className="w-full rounded-md border border-gray-300 bg-white px-6 py-3 font-bold text-gray-700 transition-colors hover:bg-gray-100 md:w-auto"
						>
							إلغاء
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
