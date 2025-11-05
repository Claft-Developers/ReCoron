/**
 * Webhookペイロードの署名を生成
 * Web Crypto API を使用（Vercel互換）
 * @param payload Webhookペイロード（JSON文字列）
 * @param secret 署名用シークレット（APIキーまたは専用シークレット）
 * @returns HMAC-SHA256署名
 */
export async function generateWebhookSignature(payload: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(payload);

    const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, messageData);
    const hashArray = Array.from(new Uint8Array(signature));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Webhook署名を検証
 * @param payload Webhookペイロード（JSON文字列）
 * @param signature 受信した署名
 * @param secret 署名用シークレット
 * @returns 署名が正しいかどうか
 */
export async function verifyWebhookSignature(payload: string, signature: string, secret: string): Promise<boolean> {
    const expectedSignature = await generateWebhookSignature(payload, secret);
    
    // タイミング攻撃を防ぐため、固定時間比較
    if (signature.length !== expectedSignature.length) {
        return false;
    }
    
    let result = 0;
    for (let i = 0; i < signature.length; i++) {
        result |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
    }
    return result === 0;
}
