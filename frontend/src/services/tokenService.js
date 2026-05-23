/**
 * tokenService.js — Fetches LiveKit access tokens from the backend.
 *
 * Follows the Service pattern — encapsulates HTTP calls to the token server.
 */

import { LIVEKIT_CONFIG } from "../utils/constants";

/**
 * Fetch a LiveKit access token from the backend.
 *
 * @param {string} [roomName] - Room to join (defaults to discovery room)
 * @param {string} [participantName] - Display name for the participant
 * @returns {Promise<{token: string, url: string, room_name: string, identity: string}>}
 */
export async function fetchToken(roomName, participantName) {
  const params = new URLSearchParams();
  params.set("room_name", roomName || LIVEKIT_CONFIG.DEFAULT_ROOM);
  if (participantName) {
    params.set("participant_name", participantName);
  }

  const response = await fetch(
    `${LIVEKIT_CONFIG.TOKEN_ENDPOINT}?${params.toString()}`,
    { method: "POST" }
  );

  if (!response.ok) {
    const errorMessage = await readTokenError(response);
    throw new Error(errorMessage);
  }

  const data = await response.json();

  if (!data?.token || !data?.url) {
    throw new Error(
      "The token server responded without LiveKit connection details. Check LIVEKIT_URL in agent/.env and restart the backend."
    );
  }

  return data;
}

async function readTokenError(response) {
  try {
    const payload = await response.json();
    const detail = payload?.detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (detail?.message) {
      const missing = Array.isArray(detail.missing) && detail.missing.length
        ? ` Missing: ${detail.missing.join(", ")}.`
        : "";
      const hint = detail.hint ? ` ${detail.hint}` : "";
      return `${detail.message}.${missing}${hint}`;
    }
  } catch {
    // Fall through to a generic message.
  }

  return `Token fetch failed (${response.status}). Confirm the Python backend is running on port 8081.`;
}
