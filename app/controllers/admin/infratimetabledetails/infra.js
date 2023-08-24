const io = require('socket.io-client');
      const socket = io('http://asmsoc-mum.localhost:3000');
      socket.on('connected', data => {
       console.log('Received data:', data);
      });