'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const TelegramGatekeeper = require('../src/gatekeeper');
const PaymentProcessor = require('../src/payment-handler');

describe('gatekeeper: validaciones sin red', () => {
    it('exige TELEGRAM_BOT_TOKEN', async () => {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        delete process.env.TELEGRAM_BOT_TOKEN;
        try {
            await assert.rejects(
                TelegramGatekeeper.generateVipInviteLink('-100123', 'a@b.com'),
                /TELEGRAM_BOT_TOKEN/
            );
        } finally {
            if (token !== undefined) process.env.TELEGRAM_BOT_TOKEN = token;
        }
    });

    it('exige channelId', async () => {
        process.env.TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'dummy';
        await assert.rejects(
            TelegramGatekeeper.generateVipInviteLink('', 'a@b.com'),
            /channelId/
        );
        if (process.env.TELEGRAM_BOT_TOKEN === 'dummy') delete process.env.TELEGRAM_BOT_TOKEN;
    });
});

describe('payment-handler: validaciones', () => {
    it('exige email', async () => {
        await assert.rejects(
            PaymentProcessor.handleSuccessfulPayment({ channelId: '-1001' }),
            /email/
        );
    });

    it('exige channelId', async () => {
        await assert.rejects(
            PaymentProcessor.handleSuccessfulPayment({ email: 'a@b.com' }),
            /channelId/
        );
    });

    it('si Telegram falla, devuelve FAILED sin lanzar', async () => {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        delete process.env.TELEGRAM_BOT_TOKEN; // fuerza fallo en la entrega
        try {
            const res = await PaymentProcessor.handleSuccessfulPayment({
                email: 'a@b.com',
                channelId: '-1001',
                transactionId: 'PAY-test',
                customerName: 'Test',
                planName: 'Pro',
            });
            assert.equal(res.status, 'FAILED');
            assert.equal(res.accessGranted, false);
        } finally {
            if (token !== undefined) process.env.TELEGRAM_BOT_TOKEN = token;
        }
    });
});
