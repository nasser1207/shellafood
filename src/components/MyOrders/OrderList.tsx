"use client";

import OrderCard from "./OrderCard";

export default function OrderList({ lang, tab, data, selectedId, onSelect, t }: {
  lang: 'en'|'ar';
  tab: 'scheduled'|'instant';
  data: any[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  t: any;
}){
  const dir = lang==='ar'?'rtl':'ltr';
  return (
    <div className="rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 p-3 shadow-sm" dir={dir}>
      <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">{tab==='scheduled'?t.scheduled:t.instant}</div>
      <div className="space-y-2">
        {data.map((o) => (
          <OrderCard key={o.id} lang={lang} tab={tab} data={o} active={o.id===selectedId} onClick={() => onSelect(o.id)} t={t} />
        ))}
        {data.length===0 && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">No orders</div>
        )}
      </div>
    </div>
  );
}


