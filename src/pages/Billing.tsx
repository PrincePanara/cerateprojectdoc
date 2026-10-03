import React from 'react';
import { CheckIcon } from 'lucide-react';
import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '/ month',
    description: 'Perfect for exploring and small personal projects.',
    features: ['1 project per month', 'Basic templates', 'Standard export format'],
    buttonText: 'Downgrade',
    active: false,
    primary: false,
  },
  {
    name: 'Pro',
    price: '$15',
    period: '/ month',
    description: 'Ideal for professionals needing regular documentation.',
    features: ['15 projects per month', 'Premium templates', 'Custom branding', 'Priority support'],
    buttonText: 'Current Plan',
    active: true,
    primary: true,
  },
  {
    name: 'Team',
    price: '$49',
    period: '/ month',
    description: 'For teams building documentation collaboratively.',
    features: ['Unlimited projects', 'All Premium features', 'Team collaboration', 'API Access'],
    buttonText: 'Upgrade',
    active: false,
    primary: false,
  }
];

export function Billing() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full">
      <header>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">Billing</h1>
        <p className="text-[13.5px] text-ink2 mt-1">Manage your subscription, invoices, and payment details.</p>
      </header>

      <section>
        <h2 className="text-[16px] font-semibold text-ink mb-4">Available Plans</h2>
        <div className="grid md:grid-cols-3 gap-5 items-stretch">
          {PLANS.map((plan) => (
            <div 
              key={plan.name} 
              className={`flex flex-col rounded-xl border p-5 ${
                plan.active ? 'border-brand bg-brandSoft/20 shadow-sm relative' : 'border-line bg-surface'
              }`}
            >
              {plan.active && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-brand text-brandInk text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Current
                </span>
              )}
              <h3 className="text-[15px] font-semibold text-ink">{plan.name}</h3>
              <p className="text-[12.5px] text-ink2 mt-1 min-h-[38px]">{plan.description}</p>
              <div className="mt-4 mb-5 flex items-baseline gap-1">
                <span className="text-[28px] font-bold tracking-[-0.02em] text-ink">{plan.price}</span>
                <span className="text-[13px] text-ink2 font-medium">{plan.period}</span>
              </div>
              <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-ink2 leading-snug">
                    <CheckIcon className="w-4 h-4 text-brand shrink-0 mt-0.5" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                variant={plan.primary ? 'primary' : 'outline'} 
                className="w-full justify-center"
                disabled={plan.active}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <Panel title="Subscription Status" description="Your current active plan and usage.">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-line2 pb-4">
              <div>
                <p className="text-[14px] font-medium text-ink">Pro Plan</p>
                <p className="text-[13px] text-ink2 mt-1">Active · Renews on Nov 15, 2026</p>
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
      </div>

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
