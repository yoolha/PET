const { io } = require("socket.io-client");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("연결됨", socket.id);

  socket.emit("join_room", { username: "1" });

  socket.emit("send_query", {
    // 쿼리 핸들러 이름
    type: "DNS-CNAME",
    // 요청할 내용
    content: "www.naver.com" 
  });
});

socket.on("receive_request", (content) => {
  console.log("[공유 요청]", content);
});

socket.on("receive_result", (content) => {
  console.log("[응답]", content);
});
