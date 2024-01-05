module.exports.respond = async (socket) => {
    socket.on('joinRoom', (roomName) => {
      socket.join(roomName);
    });
  
    socket.on('bidding', (biddingDetails) => {
      let mrb = biddingDetails.mrb;
      let studentBidPoints = biddingDetails.studentBidPoints;
      
      socket.emit('biddingStudentbidPoints', {
        studentBidPoints: studentBidPoints,
        roomName: biddingDetails.roomName
      });
  
      const clientsInRoom = io.sockets.adapter.rooms.get(biddingDetails.roomName);
      console.log('values of ',clientsInRoom);
      const totalBidder = clientsInRoom ? clientsInRoom.size : 0;
  
      global.io.emit('biddingResponse', {
            mrb: mrb,
            totalBidder: totalBidder,
            roomName: biddingDetails.roomName
      });
        
    });
  };
  