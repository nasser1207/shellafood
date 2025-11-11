"use client";

export default function OrderCard({ lang, tab, data, active, onClick, t }: {
  lang: 'en'|'ar'; tab: 'scheduled'|'instant'; data: any; active: boolean; onClick: () => void; t: any;
}){
  const dir = lang==='ar'?'rtl':'ltr';
  return (
    <button onClick={onClick} className={`group flex w-full items-center gap-3 rounded-md border p-3 text-left shadow-sm transition-all hover:shadow-md dark:bg-gray-800 dark:border-gray-700 ${active?'border-[#0B64B3] dark:border-blue-500 ring-2 ring-[#0B64B3]/20 dark:ring-blue-500/20':''}`} dir={dir}>
      {/* logo */}
      <div className="h-10 w-10 overflow-hidden rounded bg-gray-100 dark:bg-gray-700">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={data.logo || '/restlogo.jpg'} alt="logo" className="h-full w-full object-contain dark:opacity-80 transition-opacity duration-300" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-gray-900 dark:text-gray-100">{data.name}</div>
          {tab==='instant' && (
            <span className="rounded-full bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 text-xs font-semibold text-orange-700 dark:text-orange-400">{t.instant}</span>
          )}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{t.orderNum}: {data.number}</div>
        {tab==='scheduled' ? (
          <div className="mt-1 text-xs text-blue-700 dark:text-blue-400">{t.scheduledFor}: {data.when}</div>
        ) : (
          <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">{t.eta} {data.etaMin} {t.minutes}</div>
        )}
      </div>
      {/* quick actions */}
      <div className="opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex items-center gap-2">
          <button className="rounded border border-gray-300 dark:border-gray-600 px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">{t.view}</button>
          {tab==='scheduled' ? (
            <button className="rounded border border-gray-300 dark:border-gray-600 px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">{t.reschedule}</button>
          ) : (
            <button className="rounded border border-gray-300 dark:border-gray-600 px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">{t.liveTracking}</button>
          )}
          <button className="rounded border border-rose-300 dark:border-rose-800 px-2 py-1 text-xs text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20">{t.cancel}</button>
        </div>
      </div>
    </button>
  );
}


