import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: conversations, error } = await supabase
    .from("conversations")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error || !conversations?.length) {
    return Response.json([]);
  }

  const ids = conversations.map((c) => c.id);

  // Single query for all last messages instead of N+1
  const { data: msgs } = await supabase
    .from("messages")
    .select("conversation_id, content")
    .in("conversation_id", ids)
    .order("created_at", { ascending: false });

  const lastMsgMap: Record<string, string> = {};
  for (const m of msgs || []) {
    if (!lastMsgMap[m.conversation_id]) {
      lastMsgMap[m.conversation_id] = m.content;
    }
  }

  return Response.json(
    conversations.map((c) => ({ ...c, last_message: lastMsgMap[c.id] ?? null }))
  );
}
