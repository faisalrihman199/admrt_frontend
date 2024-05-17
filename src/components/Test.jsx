// import React, { useState, useEffect } from 'react';
// import socketService from '../util/chatClient';
// // import socketService from './socketService';

// const Chat = ({ userId, receiverId }) => {
//     const [message, setMessage] = useState('');
//     const [messages, setMessages] = useState([]);

//     useEffect(() => {
//         const socketUrl = 'http://localhost:3000'; // Replace with your Socket.IO server URL
//         socketService.connect(socketUrl);

//         socketService.onMessage('receive_message', (data) => {
//             if (data.receiver_id === userId || data.sender_id === userId) {
//                 setMessages((prevMessages) => [...prevMessages, data]);
//             }
//         });

//         return () => {
//             socketService.close();
//         };
//     }, [userId]);

//     const handleSendMessage = () => {
//         const msg = {
//             sender_id: userId,
//             receiver_id: receiverId,
//             text: message,
//         };

//         socketService.sendMessage('send_message', msg);
//         setMessages((prevMessages) => [...prevMessages, msg]);
//         setMessage('');
//     };

//     return (
//         <div>
//             <div className="messages">
//                 {messages.map((msg, index) => (
//                     <div key={index} className={`message ${msg.sender_id === userId ? 'sent' : 'received'}`}>
//                         {msg.text}
//                     </div>
//                 ))}
//             </div>
//             <div className="message-input">
//                 <input
//                     type="text"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                 />
//                 <button onClick={handleSendMessage}>Send</button>
//             </div>
//         </div>
//     );
// };

// export default Chat;
