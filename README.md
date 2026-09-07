# 🔐 AutoRadar Gatekeeper — Sistema de Cobro y Activación de Membresías VIP

![Status](https://img.shields.io/badge/Status-Active-success?style=flat)
![Architecture](https://img.shields.io/badge/Architecture-Webhooks_%2B_Telegram_Gatekeeper-blue?style=flat)
![NodeJS](https://img.shields.io/badge/Node.js-20.x-green?style=flat&logo=node.js)

Módulo de **Onboarding y Monetización Automatizada**. Procesa webhooks de pasarelas de pago (MercadoPago / Stripe), valida transacciones y genera enlaces de invitación VIP de un solo uso (`member_limit: 1`) a canales privados de Telegram.

---

## ⚙️ Arquitectura de Entrega de Acceso

```text
[Cliente Paga en Checkout]
           │
           ▼
[Webhook de Pago Confirmado] ──► [Gatekeeper API]
                                         │
                                         ▼
[Telegram API: createChatInviteLink(limit: 1)]
                                         │
                                         ▼
                      [Entrega de Enlace VIP al Cliente]
```
