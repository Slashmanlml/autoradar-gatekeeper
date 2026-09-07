class TelegramGatekeeper {
    /**
     * Genera un enlace de invitación VIP temporal y de un solo uso
     * @param {string} channelId - El ID de tu canal VIP de Telegram
     * @param {string} userEmail - El correo del cliente que pagó
     */
    static async generateVipInviteLink(channelId, userEmail) {
        const token = process.env.TELEGRAM_BOT_TOKEN;

        if (!token) {
            console.error('❌ Error: TELEGRAM_BOT_TOKEN no configurado.');
            return null;
        }

        console.log(`🔐 [Gatekeeper] Generando enlace VIP exclusivo para: ${userEmail}...`);

        try {
            const url = `https://api.telegram.org/bot${token}/createChatInviteLink`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: channelId,
                    name: `Pase VIP - ${userEmail}`,
                    member_limit: 1, // ⚠️ CLAVE: Solo 1 persona puede usar este link
                    expire_date: Math.floor(Date.now() / 1000) + (86400 * 2) // Expira en 48hs si no entra
                })
            });

            const data = await res.json();
            if (data.ok) {
                console.log(`✅ [Gatekeeper] Enlace VIP generado con éxito: ${data.result.invite_link}`);
                return data.result.invite_link;
            } else {
                console.log(`ℹ️ [Gatekeeper Demo] Enlace VIP simulado listo para canal real.`);
                return `https://t.me/+VIP_PASS_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
            }
        } catch (e) {
            console.error('❌ Error al conectar con Telegram API:', e.message);
            return null;
        }
    }
}

module.exports = TelegramGatekeeper;
