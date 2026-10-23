import type { FormTypeId } from "./config";

export interface PendingSubmission {
  userId: string;
  channelId: string;
  formType: FormTypeId;
  expiresAt: number;
}

/** In-memory map of users waiting to upload a screenshot */
const pending = new Map<string, PendingSubmission>();

const TTL_MS = 5 * 60 * 1000;

export function setPending(
  userId: string,
  channelId: string,
  formType: FormTypeId
): void {
  pending.set(userId, {
    userId,
    channelId,
    formType,
    expiresAt: Date.now() + TTL_MS,
  });
}

export function getPending(userId: string): PendingSubmission | undefined {
  const entry = pending.get(userId);
  if (!entry) {
    return undefined;
  }
  if (Date.now() > entry.expiresAt) {
    pending.delete(userId);
    return undefined;
  }
  return entry;
}

export function clearPending(userId: string): void {
  pending.delete(userId);
}

export function getSubmissionWindowMinutes(): number {
  return TTL_MS / 60_000;
}
