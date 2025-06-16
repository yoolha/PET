const queryHandlers = require('../services/queryHandlers');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`연결됨: ${socket.id}`);

        socket.on('join_room', ({ username }) => {
            const room = 'practice_room';
            socket.join(room);
            socket.to(room).emit('receive_message', {
                author: '알림',
                message: `${username}님이 방에 입장했습니다`,
            });

            socket.data.username = username;
        });

        socket.on('send_query', async ({ type, content }) => {
            const room = 'practice_room';
            const username = socket.data.username || '익명';

            // 요청 내용
            io.to(room).emit('receive_request', {
                type,
                content,
                from: socket.id,
                username,
            });

            try {
                const handler = queryHandlers[type];
                if (!handler) throw new Error(`지원하지 않는 전송 방식: ${type}`);

                const result = await handler(content);

                // 응답
                io.to(room).emit('receive_result', {
                    type,
                    content,
                    result: (result && result.length > 0) ? result : null,
                    from: socket.id,
                    username,
                });
            } catch (err) {
                io.to(room).emit('receive_result', {
                    type,
                    content,
                    error: err.message,
                    from: socket.id,
                    username,
                });
            }
        });

        socket.on('disconnect', () => {
            console.log(`종료됨: ${socket.id}`);
        });
    });
};
