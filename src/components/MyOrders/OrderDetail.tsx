"use client";

import TrackingRail from "./TrackingRail";
import LiveMap from "./LiveMap";
import { useMemo, useState } from "react";

export default function OrderDetail({ lang, tab, orderId, scheduled, instant, t }: {
  lang: 'en'|'ar'; tab: 'scheduled'|'instant'; orderId: string|null; scheduled: any[]; instant: any[]; t: any;
}){
  const dir = lang==='ar'?'rtl':'ltr';
  const data = useMemo(() => {
    if(!orderId) return null;
    return tab==='scheduled' ? scheduled.find(o=>o.id===orderId) : instant.find(o=>o.id===orderId);
  }, [orderId, tab, scheduled, instant]);

  if(!data) return (
    <div className="rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 p-4 text-center text-sm text-gray-500 dark:text-gray-400 shadow-sm" dir={dir}>Select an order</div>
  );

  if(tab==='scheduled'){
    return (
      <div className="rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 p-4 shadow-sm" dir={dir}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={data.logo} alt="logo" className="h-10 w-10 rounded object-contain" />
            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">{data.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{t.orderNum}: {data.number}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded border border-gray-300 dark:border-gray-600 px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">{t.edit}</button>
            <button className="rounded border border-gray-300 dark:border-gray-600 px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">{t.reschedule}</button>
          </div>
        </div>
        <div className="mb-4 text-sm text-blue-700 dark:text-blue-400">{t.scheduledFor}: {data.when}</div>
        <TrackingRail lang={lang} current={data.statusKey} steps={data.steps} t={t} />
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 p-4 shadow-sm" dir={dir}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={data.logo} alt="logo" className="h-10 w-10 rounded object-contain" />
          <div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">{data.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t.orderNum}: {data.number}</div>
          </div>
        </div>
        <span className="rounded-full bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 text-xs font-semibold text-orange-700 dark:text-orange-400">{t.instant}</span>
      </div>
      <div className="mb-3 text-sm text-gray-700 dark:text-gray-300">{t.eta} <strong>{data.etaMin}</strong> {t.minutes}</div>
      <LiveMap />
    </div>
  );
}


