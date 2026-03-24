import { supabase, hasSupabase } from "../lib/supabase";

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "50766164212";

export function buildWhatsAppBookingMessage({ guestName, propertyName, checkIn, checkOut, total }) {
  return `Hello Saul Playa, new booking request from ${guestName} for ${propertyName}. Dates: ${checkIn} to ${checkOut}. Total: $${total}.`;
}

export function openWhatsAppMessage(message) {
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, "_blank", "noopener,noreferrer");
}

export async function logNotification(payload) {
  if (!hasSupabase) return { success: true, data: payload };
  const { data, error } = await supabase.from("notification_logs").insert([payload]).select().single();
  if (error) return { success: false, error };
  return { success: true, data };
}
