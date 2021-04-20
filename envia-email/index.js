#!/usr/bin/env node
const amqp = require('amqplib/callback_api');
const nodemailer = require('nodemailer');

amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    Aprovado(channel);

    Rejeitado(channel);
  });
});

function Aprovado (channel) {
  channel.prefetch(1);

  const queue = 'aprovado';
  channel.consume(queue, function (msg) {
    const secs = msg.content.toString().split('.').length - 1;
    sendEmail(queue)

    setTimeout(function () {
      console.log(" [x] Aprovados");
      channel.ack(msg);
    }, secs * 1000);
  }, {
    noAck: false
  });
}

function Rejeitado (channel) {
  channel.prefetch(1);

  const queue = 'rejeitado';
  channel.consume(queue, function (msg) {
    const secs = msg.content.toString().split('.').length - 1;
    sendEmail(queue)

    setTimeout(function () {
      console.log(" [x] Rejeitados");
      channel.ack(msg);
    }, secs * 1000);
  }, {
    noAck: false
  });
}

function sendEmail (tipo) {
  const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: '1025',
    auth: {
      user: '',
      pass: '****'
    }
  });

  transport.sendMail({
    from: '****',
    to: '***',
    subject: 'Status do Pedido ' + tipo,
  })
  .then((d) => console.log('Status Enviado'))
  .catch((e) => console.log({e}));

  console.log(tipo);
}
