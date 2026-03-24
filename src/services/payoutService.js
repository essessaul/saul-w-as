import { supabase, hasSupabase } from "../lib/supabase";

export async function listPayoutRecords() {
  if (!hasSupabase) return { success: false, error: new Error("Supabase is not configured.") };
  const { data, error } = await supabase.from("payout_records").select("*").order("created_at", { ascending: false });
  if (error) return { success: false, error };
  return { success: true, data: data || [] };
}
