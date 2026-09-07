const TelegramGatekeeper = require('./gatekeeper');

class PaymentProcessor {
    /**
     * Procesa la confirmación de un pago y entrega el acceso VIP
     */
    static async handleSuccessfulPayment(paymentData) {
        console.log('====================================================');
        console.log('💰 [PAGOS] ¡PAGO CONFIRMADO CON ÉXITO!');
        console.log('====================================================');
        console.log(`👤 Cliente: ${paymentData.customerName} (${paymentData.email})`);
        console.log(`📦 Plan: ${paymentData.planName}`);
        console.log(`💵 Monto: $${paymentData.amount} ${paymentData.currency}`);
        console.log(`🆔 ID Transacción: ${paymentData.transactionId}`);
        console.log('----------------------------------------------------');

        // Generar enlace VIP exclusivo
        const vipLink = await TelegramGatekeeper.generateVipInviteLink(
            paymentData.channelId || '-1001234567890',
            paymentData.email
        );

        console.log(`\n🎉 ENLACE DE ACCESO ENTREGADO AL CLIENTE:`);
        console.log(`👉 ${vipLink}\n`);
        console.log('====================================================');

        return {
            status: 'COMPLETED',
            accessGranted: true,
            inviteLink: vipLink
        };
    }
}

module.exports = PaymentProcessor;
