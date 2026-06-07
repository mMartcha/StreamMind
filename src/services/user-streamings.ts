import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

import type { PlatformKey } from '@/src/data/content';
import { request } from '@/src/services/api';

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

const USER_STREAMINGS_STORAGE_KEY = '@streammind:user_streamings';
const defaultProviderIds = [8, 119];

let selectedProviderIds = new Set<number>(defaultProviderIds);
let selectedProvidersSnapshot = buildSelectedProvidersSnapshot();
const listeners = new Set<() => void>();
let hydratePromise: Promise<void> | null = null;
let stateVersion = 0;
let persistVersion = 0;
let remotePersistTimer: ReturnType<typeof setTimeout> | null = null;

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

function parseStoredProviderIds(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed) && parsed.every((providerId) => typeof providerId === 'number')) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

function updateSubscribedUserStreamings(providerIds: number[]) {
  selectedProviderIds = new Set(providerIds);
  selectedProvidersSnapshot = buildSelectedProvidersSnapshot();
  stateVersion += 1;
  emitChange();
}

function saveSubscribedUserStreamingsLocally(providerIds: number[]) {
  void AsyncStorage.setItem(USER_STREAMINGS_STORAGE_KEY, JSON.stringify(providerIds));
}

function scheduleRemotePersist(providerIds: number[]) {
  persistVersion += 1;
  const currentPersistVersion = persistVersion;

  if (remotePersistTimer) {
    clearTimeout(remotePersistTimer);
  }

  remotePersistTimer = setTimeout(() => {
    void persistSubscribedUserStreamingsRemotely(providerIds, currentPersistVersion);
  }, 350);
}

async function persistSubscribedUserStreamingsRemotely(
  providerIds: number[],
  currentPersistVersion: number,
) {
  try {
    const streamings = await request<UserStreamingProvider[]>('/user-streamings', {
      method: 'PUT',
      body: JSON.stringify({ providerIds }),
    });
    const remoteProviderIds = streamings.map((provider) => provider.providerId);

    if (currentPersistVersion !== persistVersion) {
      return;
    }

    await AsyncStorage.setItem(USER_STREAMINGS_STORAGE_KEY, JSON.stringify(remoteProviderIds));
    updateSubscribedUserStreamings(remoteProviderIds);
  } catch {
    // AsyncStorage is the offline fallback while the backend endpoint is unavailable.
  }
}

export async function hydrateSubscribedUserStreamings() {
  if (hydratePromise) {
    return hydratePromise;
  }

  hydratePromise = (async () => {
    const storedProviderIds = parseStoredProviderIds(
      await AsyncStorage.getItem(USER_STREAMINGS_STORAGE_KEY),
    );

    if (storedProviderIds) {
      updateSubscribedUserStreamings(storedProviderIds);
    }

    try {
      const versionBeforeRemoteLoad = stateVersion;
      const streamings = await request<UserStreamingProvider[]>('/user-streamings');
      const remoteProviderIds = streamings.map((provider) => provider.providerId);

      if (versionBeforeRemoteLoad !== stateVersion) {
        return;
      }

      await AsyncStorage.setItem(USER_STREAMINGS_STORAGE_KEY, JSON.stringify(remoteProviderIds));
      updateSubscribedUserStreamings(remoteProviderIds);
    } catch {
      if (!storedProviderIds) {
        updateSubscribedUserStreamings(defaultProviderIds);
      }
    }
  })();

  await hydratePromise;
  hydratePromise = null;
}

export function setSubscribedUserStreamings(providerIds: number[]) {
  updateSubscribedUserStreamings(providerIds);
  saveSubscribedUserStreamingsLocally(providerIds);
  scheduleRemotePersist(providerIds);
}

export function toggleSubscribedUserStreaming(providerId: number) {
  const nextSelectedProviderIds = new Set(selectedProviderIds);

  if (nextSelectedProviderIds.has(providerId)) {
    nextSelectedProviderIds.delete(providerId);
  } else {
    nextSelectedProviderIds.add(providerId);
  }

  setSubscribedUserStreamings([...nextSelectedProviderIds]);
}

export function useSubscribedUserStreamings() {
  return useSyncExternalStore(subscribe, getSubscribedUserStreamings, getSubscribedUserStreamings);
}
