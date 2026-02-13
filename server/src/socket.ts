import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: SocketServer;

export const initSocket = (server: HttpServer) => {
    io = new SocketServer(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
            methods: ["GET", "POST"]
        }
    });

    const onlineUsers = new Map<string, string>();

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('join', (userId: string) => {
            if (userId) {
                onlineUsers.set(userId, socket.id);
                socket.join(`user_${userId}`); // Join private room
                console.log(`User ${userId} joined with socket ${socket.id} and joined room user_${userId}`);
                io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));
            }
        });

        socket.on('typing', ({ conversationId, receiverId }) => {
            socket.to(`user_${receiverId}`).emit('displayTyping', { conversationId, userId: socket.id });
        });

        socket.on('stopTyping', ({ conversationId, receiverId }) => {
            socket.to(`user_${receiverId}`).emit('hideTyping', { conversationId, userId: socket.id });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }
            io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};
