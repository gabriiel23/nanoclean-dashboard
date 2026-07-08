/**
 * Configuración del cliente MQTT para conectarse a HiveMQ Cloud
 * (Actualmente solo un placeholder para futura implementación)
 */

export const MqttService = {
  connect: () => {
    console.log('Iniciando conexión MQTT...');
    // TODO: Implementar mqtt.js o similar para conectarse a HiveMQ (TLS 8883)
  },
  subscribe: (topic: string) => {
    console.log(`Suscrito a ${topic}`);
  },
  onMessage: (callback: (topic: string, message: string) => void) => {
    // TODO: Invocar callback cuando llegue un mensaje
  }
};
