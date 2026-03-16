// React
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef, useContext } from 'react';

// Socket-client
import io from 'socket.io-client';

// Image & MUI
import avatar_group from '../../assets/images/avatar_group.png';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';

// Context & API
import { MyContext } from '../../App';
import { fetchDataFromApi, postData } from '../../utils/api';

import styles from './Message.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);
const ENDPOINT = 'http://localhost:4000';

let socket;
let selectedChatCompare;

const Message = () => {
    const context = useContext(MyContext);
    const { userId } = useParams();
    const navigate = useNavigate();

    const myId = context.adminInfo?._id || context.adminInfo?.id;

    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [checked, setChecked] = useState(false);
    const [adminList, setAdminList] = useState([]);

    const messagesEndRef = useRef(null);
    const selectedChatRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadMyChats = () => {
        if (myId) {
            fetchDataFromApi(`/api/chat/fetchChat/${myId}`).then((res) => {
                setChats(res || []);
            });
        }
    };

    // SOCKET SETUP
    useEffect(() => {
        if (!myId) return;

        socket = io(ENDPOINT, {
            transports: ['websocket'],
        });

        socket.emit('setup', { id: myId });

        socket.on('chat accessed', (chat) => {
            setChats((prev) => {
                const exists = prev.find((c) => c._id === chat._id);
                if (exists) return prev;

                return [chat, ...prev];
            });

            fetchMessages(chat._id);

            socket.emit('join chat', chat._id);
        });

        socket.on('message received', (msg) => {
            setChats((prev) => {
                const updated = prev.map((chat) => {
                    if (chat._id === msg.chat._id) {
                        return {
                            ...chat,
                            latestMessage: msg,
                        };
                    }
                    return chat;
                });

                updated.sort((a, b) => {
                    const t1 = new Date(a.latestMessage?.createdAt || 0);
                    const t2 = new Date(b.latestMessage?.createdAt || 0);
                    return t2 - t1;
                });

                return [...updated];
            });

            if (selectedChatRef.current?._id === msg.chat._id) {
                setMessages((prev) => [...prev, msg]);
            }
        });

        return () => socket.disconnect();
    }, [myId]);

    // LOAD INIT
    useEffect(() => {
        loadMyChats();
        fetchDataFromApi('/api/admin/allAccount').then((res) => setAdminList(res || []));
    }, [myId]);

    // OPEN CHAT FROM URL
    useEffect(() => {
        if (userId && myId) {
            postData('/api/chat/accessChat', { userId, myId }).then((res) => {
                setSelectedChat(res);
                selectedChatRef.current = res;

                fetchMessages(res._id);

                socket.emit('join chat', res._id);

                loadMyChats();
            });
        }
    }, [userId, myId]);

    const fetchMessages = async (chatId) => {
        const res = await fetchDataFromApi(`/api/message/allMessages/${chatId}`);
        setMessages(res || []);
        scrollToBottom();
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedChat) return;

        const res = await postData('/api/message/sendMessage', {
            content: newMessage,
            chatId: selectedChat._id,
            senderId: myId,
            isAdmin: true,
        });

        socket.emit('new message', res);

        setMessages((prev) => [...prev, res]);

        setNewMessage('');

        loadMyChats();
    };

    const getChatParticipant = (chat) => {
        const currentId = String(myId);

        return (
            chat.users?.find((u) => String(u._id || u) !== currentId) ||
            chat.admins?.find((a) => String(a._id || a) !== currentId)
        );
    };

    const getChatName = (chat) => {
        if (chat.isGroupChat) return chat.chatName;
        const p = getChatParticipant(chat);
        return p?.name || 'Unknown';
    };

    const getChatImage = (chat) => {
        if (chat.isGroupChat) return avatar_group;
        return getChatParticipant(chat)?.image;
    };

    const isMyMessage = (msg) => {
        const senderId = msg?.senderUser?._id || msg?.senderUser || msg?.senderAdmin?._id || msg?.senderAdmin;

        return String(senderId) === String(myId);
    };

    useEffect(scrollToBottom, [messages]);

    return (
        <section className="right-content w-100">
            <div className="row dashboardBoxWrapperRow">
                {selectedChat ? (
                    <div className={cx('chat-window', 'col-md-8')}>
                        <div className={cx('chat-header')}>
                            <h5>Chat with: {getChatName(selectedChat)}</h5>
                        </div>

                        <div className={cx('message-list')}>
                            {messages.map((msg) => {
                                const senderId =
                                    msg.senderUser?._id || msg.senderUser || msg.senderAdmin?._id || msg.senderAdmin;
                                const isMe = senderId?.toString() === myId?.toString();

                                const sender = isMe ? 'me' : 'other';
                                const avatar = msg.senderUser?.image || msg.senderAdmin?.image;

                                return (
                                    <div key={msg._id} className={cx('message-item', sender)}>
                                        {!isMe && <img src={avatar} className={cx('avatarMess')} alt="avatar" />}
                                        <div className={cx('bubble')}>
                                            <p>{msg.content}</p>
                                            <span className={cx('time')}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className={cx('chat-input')}>
                            <input
                                type="text"
                                className="form-control"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type a message..."
                            />
                            <button className="btn btn-primary" onClick={handleSendMessage}>
                                Send
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="col-md-8 d-flex align-items-center justify-content-center maginRight10">
                        <h5>Select a chat to start messaging</h5>
                    </div>
                )}

                <div className={cx('user-sidebar', 'col-md-3')}>
                    <div className={cx('sidebar-header')}>
                        <div className="d-flex justify-content-around align-items-center">
                            <h5 className="mb-0">List Chat</h5>
                            <Button className="btn-primary" size="small">
                                Create Group
                            </Button>
                        </div>
                        <div className="d-flex align-items-center mt-2 justify-content-end me-2">
                            <Switch checked={checked} onChange={() => setChecked(!checked)} />
                            <h6 className="mb-0">{checked ? 'Admins' : 'All Users'}</h6>
                        </div>
                    </div>

                    <div className={cx('user-list')}>
                        {!checked
                            ? chats.map((chat) => (
                                  <div
                                      key={chat._id}
                                      className={cx('user-item', selectedChat?._id === chat._id && 'active')}
                                      onClick={() => {
                                          setSelectedChat(chat);
                                          selectedChatRef.current = chat;
                                          fetchMessages(chat._id);
                                          socket.emit('join chat', chat._id);
                                      }}
                                  >
                                      <div className={cx('avatar-wrapper')}>
                                          <img src={getChatImage(chat)} className={cx('avatar')} alt="" />
                                      </div>
                                      <div className={cx('user-info')}>
                                          <span className={cx('user-name')}>{getChatName(chat)}</span>
                                          <small className={cx('last-msg')}>
                                              {isMyMessage(chat.latestMessage)
                                                  ? `You: ${chat.latestMessage?.content}`
                                                  : chat.latestMessage?.content}
                                          </small>
                                      </div>
                                  </div>
                              ))
                            : adminList
                                  .filter((admin) => admin._id !== myId)
                                  .map((admin) => (
                                      <div
                                          key={admin._id}
                                          className={cx('user-item')}
                                          onClick={() => navigate(`/message/${admin._id}`)}
                                      >
                                          <div className={cx('avatar-wrapper')}>
                                              <img src={admin.image} className={cx('avatar')} alt="" />
                                          </div>
                                          <div className={cx('user-info')}>
                                              <span className={cx('user-name')}>{admin.name}</span>
                                          </div>
                                      </div>
                                  ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Message;
