'use strict';

const TelegramGatekeeper = require('./gatekeeper');

class PaymentProcessor {
  /**
   * Entrega el acceso VIP después de un pago confirmado.
   *
   * Nota: la confirmación del pago todavía llega como un objeto armado a mano.
   * Falta integrar la pasarela y validar la firma del webhook antes de dar
   * acceso: sin esa verificación, cualquiera que conozca la URL podría
   * reclamar un acceso sin haber pagado.
   */
  static async handleSuccessfulPayment(paymentData) {
    const { customerName, email, planName, transactionId, channelId } = paymentData;

    if (!email) throw new Error('El pago no trae email: no hay a quién entregarle el acceso.');
    if (!channelId) throw new Error('El pago no trae channelId: no se sabe a qué canal dar acceso.');

    console.log(`[pago] confirmado ${transactionId} | ${customerName} <${email}> | plan ${planName}`);

    try {
      const inviteLink = await TelegramGatekeeper.generateVipInviteLink(channelId, email);
      console.log(`[acceso] enlace entregado a ${email}`);
      return { status: 'COMPLETED', accessGranted: true, inviteLink };
    } catch (err) {
      // El pago existe pero el acceso no se pudo entregar: hay que poder
      // reintentar o devolver el dinero, así que el error no se traga.
      console.error(`[acceso] FALLÓ la entrega para ${email}: ${err.message}`);
      return { status: 'FAILED', accessGranted: false, error: err.message, transactionId };
    }
  }
}

module.exports = PaymentProcessor;
