/** Corporate payment tiers — slider selects index 0..2 (Essential / Professional / Enterprise). */
export const PAYMENT_PRICING_TIERS = [
  {
    key: 'essential',
    name: 'Essential',
    subtitle: 'Solo expansion',
    price: 2999,
    period: 'per year',
    features: ['1 additional business slot', 'Standard marketplace listing', 'Email support'],
  },
  {
    key: 'professional',
    name: 'Professional',
    subtitle: 'Growing tailor',
    price: 4999,
    period: 'per year',
    popular: true,
    features: ['2 additional business slots', 'Priority discovery placement', 'Promotions toolkit access'],
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    subtitle: 'Studios & brands',
    price: 7999,
    period: 'per year',
    features: ['Up to 5 additional slots', 'Dedicated onboarding', 'Custom branding options'],
  },
];
