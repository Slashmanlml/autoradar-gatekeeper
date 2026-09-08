'use strict';

/**
 * Entrega de acceso a un canal privado de Telegram mediante enlaces de
 * invitación de un solo uso.
 */
class TelegramGatekeeper {
  /**
   * Genera un enlace de invitación temporal e individual.
   *
   * @param {string} channelId  Id del canal privado (formato -100...)
   * @param {string} userEmail  Correo del cliente, solo para etiquetar el enlace
   * @returns {Promise<string>} El enlace de invitación real
   * @throws  Si falta el token, falta el canal o Telegram rechaza la solicitud
   *
   * IMPORTANTE: esta función lanza en vez de devolver un enlace de reemplazo.
   * La versión anterior, cuando la API fallaba, devolvía un enlace inventado
   * (`https://t.me/+VIP_PASS_<aleatorio>`) y lo registraba como éxito. En un
   * flujo que entrega acceso pagado eso es lo peor posible: el cliente paga,
   * recibe un enlace que no funciona y el sistema informa que salió todo bien.
   * Es preferible que el pago falle de forma visible y se pueda reintentar.
   */
  static async generateVipInviteLink(channelId, userEmail) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) throw new Error('TELEGRAM_BOT_TOKEN no configurado.');
    if (!channelId) throw new Error('channelId no informado.');

    const res = await fetch(`https://api.telegram.org/bot${token}/createChatInviteLink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: channelId,
        name: `Pase VIP - ${userEmail}`,
        member_limit: 1,                                        // un solo uso
        expire_date: Math.floor(Date.now() / 1000) + 86400 * 2, // vence en 48 h
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok || !data.result?.invite_link) {
      throw new Error(
        `Telegram rechazó la creación del enlace (HTTP ${res.status}): ${data.description || 'sin detalle'}`
      );
    }
    return data.result.invite_link;
  }
}

module.exports = TelegramGatekeeper;
