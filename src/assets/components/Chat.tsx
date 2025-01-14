// import { useState, useEffect } from "react";
// import { io, Socket } from "socket.io-client";

// interface Message {
//   content: string;
// }

// const socket: Socket = io("https://site--sook--dnxhn8mdblq5.code.run");

// const Chat: React.FC = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState<string>("");

//   useEffect(() => {
//     // Écouter les messages en temps réel
//     socket.on("message", (data: string) => {
//       setMessages((prev) => [...prev, { content: data }]);
//     });

//     return () => {
//       socket.off("message");
//     };
//   }, []);

//   const sendMessage = () => {
//     if (input.trim()) {
//       socket.emit("message", input); // Envoyer le message
//       setInput("");
//     }
//   };

//   return (
//     <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
//       <h2>Messagerie</h2>
//       <div
//         style={{
//           border: "1px solid #ddd",
//           height: "300px",
//           overflowY: "scroll",
//           padding: "10px",
//         }}
//       >
//         {messages.map((msg, index) => (
//           <p key={index} style={{ margin: "5px 0" }}>
//             {msg.content}
//           </p>
//         ))}
//       </div>
//       <div style={{ display: "flex", marginTop: "10px" }}>
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           style={{ flex: 1, padding: "10px", border: "1px solid #ccc" }}
//           placeholder="Écris un message..."
//         />
//         <button onClick={sendMessage} style={{ padding: "10px" }}>
//           Envoyer
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chat;
