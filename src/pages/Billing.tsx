import React from 'react';
import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';

export function Billing() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <header>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">Billing</h1>
        <p className="text-[13.5px] text-ink2 mt-1">Manage your subscription, invoices, and payment details.</p>
      </header>

      <Panel title="Subscription Status" description="Your current active plan and usage.">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-line2 pb-4">
            <div>
              <p className="text-[14px] font-medium text-ink">Pro Plan</p>
              <p className="text-[13px] text-ink2 mt-1">Active · Renews on Nov 15, 2026</p>
            </div>
            <div className="text-right">
              <p className="text-[14px] font-medium text-ink">$15.00 / month</p>
              <Button size="sm" variant="ghost" className="mt-2 text-brand">Change Plan</Button>
            </div>
          </div>
          <div>
            <p className="text-[13px] text-ink">Documentation Quota</p>
            <div className="mt-2 h-2 w-full bg-line2 rounded-full overflow-hidden">
              <div className="h-full bg-brand w-1/3 rounded-full" />
            </div>
            <p className="text-[12px] text-ink3 mt-1.5">5 / 15 projects generated this month</p>
          </div>
        </div>
      </Panel>

      <Panel title="Payment Method" actions={<Button size="sm">Update</Button>}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-8 rounded border border-line flex items-center justify-center bg-surface2 text-ink3 text-[11px] font-bold">
            VISA
          </div>
          <div>
            <p className="text-[13.5px] font-medium text-ink">Visa ending in 4242</p>
            <p className="text-[12.5px] text-ink2 mt-0.5">Expires 12/28</p>
          </div>
        </div>
      </Panel>

      <Panel title="Invoices">
        <ul className="divide-y divide-line2">
          {[
            { date: 'Oct 15, 2026', amount: '$15.00', status: 'Paid', invoiceId: 'INV-2026-10' },
            { date: 'Sep 15, 2026', amount: '$15.00', status: 'Paid', invoiceId: 'INV-2026-09' },
            { date: 'Aug 15, 2026', amount: '$15.00', status: 'Paid', invoiceId: 'INV-2026-08' },
          ].map((inv) => (
            <li key={inv.invoiceId} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-[13.5px] font-medium text-ink">{inv.date}</p>
                <p className="text-[12px] text-ink3 mt-0.5">{inv.invoiceId}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[13px] font-medium text-ink">{inv.amount}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 font-medium">{inv.status}</span>
                <Button size="sm" variant="ghost">Download</Button>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
