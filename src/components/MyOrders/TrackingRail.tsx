"use client";

export default function TrackingRail({ lang, current, steps, t }: { lang:'en'|'ar'; current: string; steps: string[]; t: any }){
  const dir = lang==='ar'?'rtl':'ltr';
  const idx = Math.max(0, steps.findIndex(s=>s===current));
  return (
    <div className="flex items-start gap-3" dir={dir}>
      <div className="relative w-8">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-0.5 bg-gray-200 dark:bg-gray-700" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-0.5 w-0.5" />
      </div>
      <div className="flex-1">
        {steps.map((s, i) => (
          <div key={s} className="relative mb-4 flex items-center">
            <div className={`mr-3 h-3 w-3 rounded-full ${i<=idx? 'bg-[#0B64B3] dark:bg-blue-500':'bg-gray-300 dark:bg-gray-600'}`} />
            <div className={`text-sm ${i<=idx? 'text-[#0B64B3] dark:text-blue-400 font-medium':'text-gray-600 dark:text-gray-400'}`}>{t[s] || s}</div>
            {i===idx && (
              <span className="ml-2 animate-pulse text-xs text-[#0B64B3] dark:text-blue-400">●</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


