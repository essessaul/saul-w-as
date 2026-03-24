import { supabase, hasSupabase } from "../lib/supabase";

const base = import.meta.env.VITE_AIRBNB_SYNC_API_BASE || "";
const apiKey = import.meta.env.VITE_AIRBNB_SYNC_API_KEY || "";

export async function createCalendarSyncLog(payload) {
  if (!hasSupabase) return { success: true, data: payload };
  const { data, error } = await supabase.from("calendar_sync_logs").insert([payload]).select().single();
  if (error) return { success: false, error };
  return { success: true, data };
}

export async function triggerAirbnbStyleSync(propertyId) {
  if (!base || !apiKey) {
    return { success: false, error: new Error("Airbnb-style sync API is not configured.") };
  }
  const result = await fetch(`${base}/sync/${propertyId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ propertyId, channel: "airbnb" }),
  });
  if (!result.ok) return { success: false, error: new Error("Sync request failed.") };
  const json = await result.json().catch(() => ({}));
  return { success: true, data: json };
}
