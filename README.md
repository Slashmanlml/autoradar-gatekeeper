# AutoRadar Gatekeeper

Entrega acceso a un canal privado de Telegram generando enlaces de invitación de
**un solo uso** que vencen a las 48 horas, usando la Bot API.

> ### ⚠️ Estado: prototipo
>
> **La pasarela de pago no está integrada.** `PaymentProcessor.handleSuccessfulPayment()`
> recibe hoy un objeto armado a mano. Antes de usar esto en producción hay que
> recibir el webhook de la pasarela y **validar su firma**: sin esa verificación,
> cualquiera que conozca la URL podría reclamar un acceso sin haber pagado.

## Corrección importante

La versión anterior, cuando la API de Telegram fallaba, **devolvía un enlace
inventado** y lo registraba como éxito:

```js
console.log('ℹ️ [Gatekeeper Demo] Enlace VIP simulado listo para canal real.');
return `https://t.me/+VIP_PASS_${Math.random()...}`;
```

En un flujo que entrega acceso pagado eso es lo peor posible: el cliente paga,
recibe un enlace que no funciona y el sistema informa que todo salió bien. Ahora
la función **lanza una excepción** y quien la llama decide si reintenta o
devuelve el dinero.

## Uso

```js
const link = await TelegramGatekeeper.generateVipInviteLink('-100123456789', 'cliente@mail.com');
```

Requiere `TELEGRAM_BOT_TOKEN` en el entorno y que el bot sea administrador del canal.

## Licencia

MIT
