import { createAdminClient } from "@/lib/supabase/admin";

export interface SMSResult {
  success: boolean;
  sentCount: number;
  error?: string;
}

function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}

async function getNHNCredentials(): Promise<{ appKey: string; secretKey: string }> {
  const envAppKey = process.env.NHN_APP_KEY ?? "";
  const envSecretKey = process.env.NHN_SECRET_KEY ?? "";

  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("site_settings")
      .select("key, value")
      .in("key", ["sms_nhn_app_key", "sms_nhn_secret_key"]);

    const map: Record<string, string> = {};
    (data ?? []).forEach((row: { key: string; value: string | null }) => {
      if (row.value) map[row.key] = row.value;
    });

    return {
      appKey: map["sms_nhn_app_key"] || envAppKey,
      secretKey: map["sms_nhn_secret_key"] || envSecretKey,
    };
  } catch {
    return { appKey: envAppKey, secretKey: envSecretKey };
  }
}

async function sendViaNHN(
  recipients: string[],
  message: string,
  senderNo: string
): Promise<SMSResult> {
  const { appKey, secretKey } = await getNHNCredentials();

  if (!appKey || !secretKey) {
    return { success: false, sentCount: 0, error: "NHN AppKey 또는 SecretKey가 설정되지 않았습니다. 사이트 설정에서 입력해주세요." };
  }

  const normalized = recipients
    .map(normalizePhone)
    .filter((p) => p.length >= 10)
    .map((p) => ({ recipientNo: p }));

  if (normalized.length === 0) {
    return { success: false, sentCount: 0, error: "유효한 수신번호가 없습니다." };
  }

  const chunks: typeof normalized[] = [];
  for (let i = 0; i < normalized.length; i += 1000) {
    chunks.push(normalized.slice(i, i + 1000));
  }

  let totalSent = 0;
  for (const chunk of chunks) {
    const res = await fetch(
      `https://api-sms.cloud.toast.com/sms/v3.0/appKeys/${appKey}/sender/sms`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Secret-Key": secretKey,
        },
        body: JSON.stringify({
          body: message,
          sendNo: normalizePhone(senderNo),
          recipientList: chunk,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return { success: false, sentCount: totalSent, error: err };
    }
    totalSent += chunk.length;
  }

  return { success: true, sentCount: totalSent };
}

export async function sendSMS(
  recipients: string[],
  message: string,
  senderNo = "032-887-2345"
): Promise<SMSResult> {
  return sendViaNHN(recipients, message, senderNo);
}
