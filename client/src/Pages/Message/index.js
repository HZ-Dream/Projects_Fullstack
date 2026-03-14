// React
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef, useContext } from 'react';

// Image
import avatar_group from '../../assets/images/avatar_group.png';

// MUI
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';

// Context
import { MyContext } from '../../App';

// API
import { fetchDataFromApi, postData } from '../../utils/api';

// CSS
import styles from './Message.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Message = () => {
    const context = useContext(MyContext);
    const { userId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const myId = context.userData?.userId;
    const isCurrentUserAdmin = localStorage.getItem('isAdmin') === 'true';

    // Take query params
    const queryParams = new URLSearchParams(location.search);
    const isAdminQuery = queryParams.get('isAdmin') === 'true';

    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [checked, setChecked] = useState(false);
    const [adminList, setAdminList] = useState([]);

    // Handle Scroll Chat
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadMyChats = () => {
        if (myId) {
            fetchDataFromApi(`/api/chat/fetchChat/${myId}`).then((res) => {
                setChats(res || []);
            });
        }
    };

    useEffect(() => {
        loadMyChats();
        fetchDataFromApi('/api/admin/allAccount').then((res) => {
            setAdminList(res || []);
        });
    }, [myId]);

    useEffect(() => {
        if (userId && myId) {
            const body = {
                userId: userId,
                myId: myId,
                isAdmin: isAdminQuery,
            };
            postData('/api/chat/accessChat', body).then((res) => {
                setSelectedChat(res);
                fetchMessages(res._id);
                loadMyChats();
            });
        }
    }, [userId, myId]);

    const fetchMessages = async (chatId) => {
        try {
            const res = await fetchDataFromApi(`/api/message/allMessages/${chatId}`);
            setMessages(res || []);
        } catch (error) {
            console.error('Error fetching messages', error);
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() === '' || !selectedChat || !myId) return;

        const body = {
            content: newMessage,
            chatId: selectedChat._id,
            senderId: myId,
            isAdmin: isCurrentUserAdmin,
        };

        try {
            const res = await postData('/api/message/sendMessage', body);
            setMessages([...messages, res]);
            setNewMessage('');
            loadMyChats();
        } catch (error) {
            console.error('Send failed', error);
        }
    };

    const getChatName = (chat) => {
        if (!chat) return '';
        if (chat.isGroupChat) return chat.chatName;

        const otherUser = chat.users?.find((u) => u._id !== myId) || chat.admins?.find((a) => a._id !== myId);
        return otherUser ? otherUser.name : 'Unknown';
    };

    const getChatImage = (chat) => {
        if (!chat) return '';
        if (chat.isGroupChat) return chat.chatName;

        const otherUser = chat.users?.find((u) => u._id !== myId) || chat.admins?.find((a) => a._id !== myId);
        return otherUser ? otherUser.image : 'Unknown';
    };

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
                                const isMe = msg.senderUser?._id === myId || msg.senderAdmin?._id === myId;
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
                    <div className="col-md-8 d-flex align-items-center justify-content-center">
                        <p>Select a chat to start messaging</p>
                    </div>
                )}

                <div className={cx('user-sidebar', 'col-md-3')}>
                    <div className={cx('sidebar-header')}>
                        <div className="d-flex justify-content-around align-items-center">
                            <h5 className="mb-0">Recent Chats</h5>
                            <Button className="btn-primary" size="small">
                                Group
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
                                          fetchMessages(chat._id);
                                          navigate('/dashboard/message');
                                      }}
                                  >
                                      <div className={cx('avatar-wrapper')}>
                                          {chat.isGroupChat === true ? (
                                              <img src={avatar_group} className={cx('avatar')} alt="" />
                                          ) : (
                                              <img src={getChatImage(chat)} className={cx('avatar')} alt="" />
                                          )}
                                      </div>
                                      <div className={cx('user-info')}>
                                          <span className={cx('user-name')}>{getChatName(chat)}</span>
                                          <small className={cx('last-msg')}>{chat.latestMessage?.content}</small>
                                      </div>
                                  </div>
                              ))
                            : adminList.map((admin) => (
                                  <div
                                      key={admin._id}
                                      className={cx('user-item')}
                                      onClick={() => navigate(`/dashboard/message/${admin._id}?isAdmin=true`)}
                                  >
                                      <div className={cx('avatar-wrapper')}>
                                          <img
                                              src={admin.image || 'https://via.placeholder.com/150'}
                                              className={cx('avatar')}
                                              alt=""
                                          />
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
