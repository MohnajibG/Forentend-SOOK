// import React, { useState, useEffect, useRef } from "react";
// import { io, Socket } from "socket.io-client";

// interface Message {
//   content: string;
// }

// const socket: Socket = io("https://site--sook--dnxhn8mdblq5.code.run");

// const Chat: React.FC = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState<string>("");
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // Écoute des messages entrants
//   useEffect(() => {
//     socket.on("message", (data: string) => {
//       setMessages((prev) => [...prev, { content: data }]);
//     });
//     return () => {
//       socket.off("message");
//     };
//   }, []);

//   // Scrolle automatiquement vers le bas à chaque nouveau message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = () => {
//     if (input.trim()) {
//       socket.emit("message", input);
//       setInput("");
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen max-w-2xl mx-auto p-4 bg-gray-50">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-4">Messagerie</h2>

//       <div className="flex-1 mb-4 overflow-y-auto border border-gray-300 rounded-lg bg-white p-4">
//         {messages.map((msg, idx) => (
//           <p key={idx} className="mb-2 text-gray-700">
//             {msg.content}
//           </p>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="flex gap-2">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           placeholder="Écris un message..."
//           className="
//             flex-1 h-12 px-4
//             border border-gray-300 rounded-lg
//             focus:outline-none focus:ring-2 focus:ring-[#dfa080bd]
//             transition
//           "
//         />
//         <button
//           onClick={sendMessage}
//           className="
//             h-12 px-6
//             bg-[#dfa080bd] text-white font-bold
//             rounded-lg hover:bg-[#c87660]
//             transition-colors
//           "
//         >
//           Envoyer
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chat;
