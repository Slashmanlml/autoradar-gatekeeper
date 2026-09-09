#!/usr/bin/env node
'use strict';

const PaymentProcessor = require('./src/payment-handler');
const logger = require('./src/logger');

async function testSimulation() {
    logger.log('🧪 Simulación de cobro y entrega automática de membresía...\n');
    logger.log('⚠️  Prototipo: el pago es un objeto de ejemplo, la pasarela real no está integrada.\n');

    const samplePayment = {
        transactionId: `PAY-${Date.now()}`,
        customerName: 'Juan Pérez (Empresa Proveedora)',
        email: 'juan.perez@empresa.com',
        planName: 'B2B Licitaciones Pro',
        amount: 45,
        currency: 'USD',
        channelId: process.env.TELEGRAM_CHANNEL_ID,
    };

    const result = await PaymentProcessor.handleSuccessfulPayment(samplePayment);
    logger.log('\nResultado:', JSON.stringify({ ...result, inviteLink: result.inviteLink ? '(enlace generado)' : undefined }, null, 2));
    return result;
}

if (require.main === module) {
    testSimulation().catch(err => {
        logger.error('❌ Error en la simulación:', err.message || err);
        process.exit(1);
    });
}

module.exports = { testSimulation };
