import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
    socket: Socket | null;
    onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    onlineUsers: []
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            const socketUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
            const newSocket = io(socketUrl, {
                withCredentials: true
            });

            setSocket(newSocket);

            newSocket.on('connect', () => {
                newSocket.emit('join', user._id);
            });

            newSocket.on('getOnlineUsers', (users: string[]) => {
                setOnlineUsers(users);
            });

            return () => {
                newSocket.close();
                setSocket(null);
            };
        }
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
