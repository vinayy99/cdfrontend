
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { SkillSwap, SkillSwapStatus } from '../types';
import * as api from '../services/api';

const getStatusClasses = (status: SkillSwapStatus) => {
    switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'accepted': return 'bg-green-100 text-green-800';
        case 'declined': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

const SkillSwapCard: React.FC<{ swap: SkillSwap; type: 'incoming' | 'outgoing' }> = ({ swap, type }) => {
    const { findUserById, updateSkillSwapStatus } = useAppContext();
    const otherUser = findUserById(type === 'incoming' ? swap.fromUserId : swap.toUserId);

    if (!otherUser) return null;

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center mb-3">
                        <img src={otherUser.avatar} alt={otherUser.name} className="w-10 h-10 rounded-full mr-3" />
                        <div>
                            <p className="font-semibold text-gray-800">{otherUser.name}</p>
                            <p className="text-sm text-gray-500">{type === 'incoming' ? 'Sent you a request' : 'You sent a request'}</p>
                        </div>
                    </div>
                    <p className="text-gray-600 mb-2"><strong>You get:</strong> <span className="text-primary font-medium">{swap.requestedSkill}</span></p>
                    <p className="text-gray-600"><strong>You give:</strong> <span className="text-secondary font-medium">{swap.offeredSkill}</span></p>
                    <p className="text-sm text-gray-500 mt-2 italic">"{swap.message}"</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusClasses(swap.status)}`}>
                    {swap.status}
                </span>
            </div>

            {type === 'incoming' && swap.status === 'pending' && (
                <div className="flex justify-end space-x-2 mt-4">
                    <button onClick={() => updateSkillSwapStatus(swap.id, 'accepted')} className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600">Accept</button>
                    <button onClick={() => updateSkillSwapStatus(swap.id, 'declined')} className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600">Decline</button>
                </div>
            )}
        </div>
    );
};


const SkillSwapPage: React.FC = () => {
    const { currentUser, skillSwaps, token } = useAppContext();
    const [activeSwapId, setActiveSwapId] = useState<number | null>(null);
    const [messages, setMessages] = useState<api.SkillSwapMessage[]>([]);
    const [history, setHistory] = useState<api.SkillSwapStatus[]>([]);
    const [newMessage, setNewMessage] = useState('');

    if (!currentUser) return null;

    const incomingSwaps = skillSwaps.filter(s => s.toUserId === currentUser.id);
    const outgoingSwaps = skillSwaps.filter(s => s.fromUserId === currentUser.id);

    useEffect(() => {
        const load = async () => {
            if (!token || !activeSwapId) return;
            try {
                const [msgs, hist] = await Promise.all([
                    api.getSkillSwapMessages(activeSwapId, token),
                    api.getSkillSwapHistory(activeSwapId, token)
                ]);
                setMessages(msgs); setHistory(hist);
            } catch {
                setMessages([]); setHistory([]);
            }
        };
        load();
    }, [activeSwapId, token]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !activeSwapId || !newMessage.trim()) return;
        try {
            const msg = await api.postSkillSwapMessage(activeSwapId, newMessage.trim(), token);
            setMessages(prev => [...prev, msg]);
            setNewMessage('');
        } catch {}
    };

    return (
        <div>
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-dark">Skill Swaps</h1>
                <p className="text-gray-600 mt-2">Exchange skills with other talented individuals in the community.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-bold text-dark mb-4">Incoming Requests</h2>
                    <div className="space-y-4">
                        {incomingSwaps.length > 0 ? (
                            incomingSwaps.map(swap => (
                                <div key={swap.id} onClick={() => setActiveSwapId(swap.id)} className="cursor-pointer">
                                    <SkillSwapCard swap={swap} type="incoming" />
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No incoming skill swap requests.</p>
                        )}
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-dark mb-4">Outgoing Requests</h2>
                    <div className="space-y-4">
                        {outgoingSwaps.length > 0 ? (
                            outgoingSwaps.map(swap => (
                                <div key={swap.id} onClick={() => setActiveSwapId(swap.id)} className="cursor-pointer">
                                    <SkillSwapCard swap={swap} type="outgoing" />
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">You haven't sent any skill swap requests.</p>
                        )}
                    </div>
                </div>
            </div>

            {activeSwapId && (
                <div className="mt-10 grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-4 rounded-lg border">
                        <h3 className="font-semibold mb-3">Chat</h3>
                        <div className="h-64 overflow-y-auto space-y-3 border rounded p-3 bg-gray-50">
                            {messages.map(m => (
                                <div key={m.id} className="text-sm">
                                    <div className="flex items-center space-x-2">
                                        {m.sender_avatar && <img src={m.sender_avatar} className="w-6 h-6 rounded-full" />}
                                        <span className="font-medium">{m.sender_name}</span>
                                        <span className="text-xs text-gray-400">{new Date(m.created_at || '').toLocaleString()}</span>
                                    </div>
                                    <p className="ml-8 text-gray-700">{m.message}</p>
                                </div>
                            ))}
                            {messages.length === 0 && <p className="text-gray-500">No messages yet.</p>}
                        </div>
                        <form onSubmit={sendMessage} className="mt-3 flex space-x-2">
                            <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message" className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                            <button className="px-4 py-2 bg-primary text-white rounded-md">Send</button>
                        </form>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                        <h3 className="font-semibold mb-3">Status Timeline</h3>
                        <div className="space-y-2">
                            {history.map(h => (
                                <div key={h.id} className="text-sm flex items-center space-x-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${h.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : h.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{h.status}</span>
                                    <span className="text-gray-600">{new Date(h.created_at || '').toLocaleString()}</span>
                                </div>
                            ))}
                            {history.length === 0 && <p className="text-gray-500">No history yet.</p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillSwapPage;
