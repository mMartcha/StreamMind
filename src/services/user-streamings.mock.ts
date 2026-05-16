import { useSyncExternalStore } from 'react';

import type { PlatformKey } from '@/src/data/content';

export type UserStreamingProvider = {
  providerId: number;
  providerName: string;
  platformKey: PlatformKey;
  logoUrl?: string | null;
};

export const userStreamingOptions: UserStreamingProvider[] = [
  { providerId: 8, providerName: 'Netflix', platformKey: 'Netflix' },
  { providerId: 119, providerName: 'Prime Video', platformKey: 'Prime Video' },
  { providerId: 337, providerName: 'Disney+', platformKey: 'Disney+' },
  { providerId: 1899, providerName: 'Max', platformKey: 'Max' },
  { providerId: 350, providerName: 'Apple TV+', platformKey: 'Apple TV+' },
  { providerId: 307, providerName: 'Globoplay', platformKey: 'Globoplay' },
];

let selectedProviderIds = new Set<number>([8, 119]);
let selectedProvidersSnapshot = buildSelectedProvidersSnapshot();
const listeners = new Set<() => void>();

function buildSelectedProvidersSnapshot() {
  return userStreamingOptions.filter((provider) => selectedProviderIds.has(provider.providerId));
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getSubscribedUserStreamings() {
  return selectedProvidersSnapshot;
}

export function setSubscribedUserStreamings(providerIds: number[]) {
  selectedProviderIds = new Set(providerIds);
  selectedProvidersSnapshot = buildSelectedProvidersSnapshot();
  emitChange();
}

export function toggleSubscribedUserStreaming(providerId: number) {
  const nextSelectedProviderIds = new Set(selectedProviderIds);

  if (nextSelectedProviderIds.has(providerId)) {
    nextSelectedProviderIds.delete(providerId);
  } else {
    nextSelectedProviderIds.add(providerId);
  }

  selectedProviderIds = nextSelectedProviderIds;
  selectedProvidersSnapshot = buildSelectedProvidersSnapshot();
  emitChange();
}

export function useSubscribedUserStreamings() {
  return useSyncExternalStore(subscribe, getSubscribedUserStreamings, getSubscribedUserStreamings);
}
