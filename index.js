const PaymentProcessor = require('./src/payment-handler');

async function testSimulation() {
    console.log('🧪 Iniciando prueba de cobro y entrega automática de membresía...\n');

    const samplePayment = {
        transactionId: `PAY-${Date.now()}`,
        customerName: 'Juan Pérez (Empresa Proveedora)',
        email: 'juan.perez@empresa.com',
        planName: 'B2B Licitaciones Pro',
        amount: 45,
        currency: 'USD'
    };

    await PaymentProcessor.handleSuccessfulPayment(samplePayment);
}

testSimulation();
