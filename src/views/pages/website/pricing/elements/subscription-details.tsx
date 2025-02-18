import { Check, Info, X } from "lucide-react";
import { InfoTooltip } from "./tooltip";
import type { Plan } from "../data";

interface SubscriptionDetailsProps {
  plan: Plan;
  billingPeriod: "annual" | "monthly";
}

export function SubscriptionDetails({ plan, billingPeriod }: SubscriptionDetailsProps) {
  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center gap-2">
        <h3 className="text-white font-semibold -mt-0.5">{plan.name}</h3>
        <span className="text-gray-400 text-xs">
          ${Intl.NumberFormat("en-US").format(plan.price[billingPeriod] * (billingPeriod === "annual" ? 12 : 1))} /{" "}
          {billingPeriod === "annual" ? "year" : "month"}
        </span>
        <InfoTooltip content={plan.description} />
      </div>

      <div className="space-y-2.5">
        {plan.features.map((feature, index) => (
          <div key={feature.name} className={`flex items-center gap-2 ${!feature.included && "opacity-30"}`}>
            {feature.included ? <Check className="h-5 w-5 text-theme-pink shrink-0" /> : <X className="h-4 w-4 text-theme-pink shrink-0" />}
            <p className="text-xs">
              <span className="text-white font-semibold">{feature.name}</span>{" "}
              {feature.description && <span className="text-gray-400">{feature.description}</span>}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
