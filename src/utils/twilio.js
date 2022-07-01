import twilio from 'twilio';
import logger from './logger.js';

class Twilio {
  constructor() {
    const accSid = process.env.ACC_SID;
    const authToken = process.env.AUTH_TOKEN;
    this.smsNumber = process.env.TWILIO_SMS_NUMBER;
    this.wapNumber = process.env.TWILIO_WAP_NUMBER;
    this.client = twilio(accSid, authToken);
  }

  #wapMessage(data) {
    let message = '';
    message = `Nuevo pedido de ${data.name} (${data.user})\n`;
    message += 'Se informa detalle de nuevo pedido:\n\n';
    let totalOrder = 0;
    data.forEach((p) => {
      message += `Articulo: ${p.code}\n`;
      message += `Nombre: ${p.name}\n`;
      message += `Cantidad: ${p.quantity}\n`;
      message += `Precio unit: $ ${p.price}\n`;
      message += `Total: $ ${parseInt(p.quantity) * parseFloat(p.price)}\n\n`;
      totalOrder += parseInt(p.quantity) * parseFloat(p.price);
    });
    message += `Total del pedido: $ ${totalOrder}`;
    return message;
  }

  async sms(dest, body) {
    try {
      const message = await this.client.messages.create({
        body: body,
        from: this.smsNumber,
        to: dest,
      });
    } catch (err) {
      logger.error(`Module: utils/twilio.js Method: sms -> ${err}`);
    }
  }

  async wapp(dest, data) {
    try {
      const message = await this.client.messages.create({
        body: this.#wapMessage(data),
        from: `whatsapp:${this.wapNumber}`,
        to: `whatsapp:${dest}`,
      });
    } catch (err) {
      logger.error(`Module: utils/twilio.js Method: wapp -> ${err}`);
    }
  }
}
export default new Twilio();
