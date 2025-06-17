import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';

const options = [
  { label: 'TCP Upper', value: 'TCP-UPPER' },
  { label: 'TCP Original', value: 'TCP-ORIGINAL' },
  { label: 'TCP Lower', value: 'TCP-LOWER' },
  { label: 'UDP Upper', value: 'UDP-UPPER' },
  { label: 'UDP Original', value: 'UDP-ORIGINAL' },
  { label: 'UDP Lower', value: 'UDP-LOWER' },
  { label: 'TLS (HTTP vs HTTPS)', value: 'TLS' },
  { label: 'Ping (ICMP)', value: 'PING' },
  { label: 'URL → IP address (DNS A)', value: 'IPURL-A' },
  { label: 'IP → URL', value: 'IPURL-PTR' },
  { label: '익명 → 실명 (CNAME)', value: 'DNS-CNAME' },
  { label: 'Type = MX', value: 'DNS-MX' },
];

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState([]);
  const [username, setUsername] = useState('');
  const [socket, setSocket] = useState(null);
  const [joined, setJoined] = useState(false);
  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
    if (!joined || !username) return;

    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.emit('join_room', { username });

    newSocket.on('receive_result', ({ type, result, error, from, username: sender, message, info }) => {
      const text = error || message || info || formatResult(type, result);
      setMessages((prev) => [...prev, { author: `Server (${type})`, text, isServer: true }]);
    });

    newSocket.on('receive_request', ({ type, content, username: sender }) => {
      const isCurrentUser = sender === username;
      if (isCurrentUser) return;

      const key = `${sender}_${content}`;
      setMessages((prev) => {
        if (prev.some(msg => msg.key === key)) return prev;
        return [...prev, { author: sender, text: content, isCurrentUser: false, key }];
      });
    });

    return () => {
      newSocket.off('receive_result');
      newSocket.off('receive_request');
      newSocket.disconnect();
    };
  }, [joined, username]);

  const formatResult = (type, result) => {
    if (type === 'PING' && typeof result === 'object' && result !== null) {
      return `alive: ${result.alive}\ntime: ${result.time}`;
    }
    if (type === 'TLS' && typeof result === 'object' && result !== null) {
      const { statusCode, durationMs, tlsCipher, tlsVersion, redirectTo, securityAssessment } = result;
      const lines = [
        `statusCode: ${statusCode}`,
        `durationMs: ${durationMs}`,
        `tlsCipher: ${tlsCipher}`,
        `tlsVersion: ${tlsVersion}`,
        `redirectTo: ${redirectTo}`,
      ];
      if (securityAssessment) {
        lines.push(`security level: ${securityAssessment.level}`);
        lines.push(`comment: ${securityAssessment.comment}`);
      }
      return lines.join('\n');
    }
    if (type === 'IPURL-PTR') {
      if (Array.isArray(result)) return result.join('\n');
      return typeof result === 'string' ? result : '';
    }
    if (type === 'DNS-MX') {
      return result.map(item => `exchange: ${item.exchange}\npriority: ${item.priority}`).join('\n\n');
    }
    if (Array.isArray(result)) {
      return result.join('\n');
    } else if (typeof result === 'object' && result !== null) {
      return Object.entries(result).map(([k, v]) => `${k}: ${v}`).join('\n');
    }
    return result;
  };

  const sendMessage = () => {
    if (input.trim() === '' || selected.length === 0 || !socket) return;

    selected.forEach(type => {
      socket.emit('send_query', { type, content: input });
    });

    const key = `${username}_${input}`;
    setMessages((prev) => {
      if (prev.some(msg => msg.key === key)) return prev;
      return [...prev, { author: 'You', text: input, isCurrentUser: true, key }];
    });

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  const toggleSelection = (value) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  if (!joined) {
    return (
      <div className="chat-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <h2 style={{ marginBottom: '1rem' }}>Enter your name</h2>
        <input
          type="text"
          placeholder="Your name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && nameInput.trim()) {
              setUsername(nameInput.trim());
              setJoined(true);
            }
          }}
          style={{ padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid #ccc', width: '60%' }}
        />
        <button
          onClick={() => {
            if (nameInput.trim()) {
              setUsername(nameInput.trim());
              setJoined(true);
            }
          }}
          style={{ marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: '20px', background: '#007aff', color: 'white', border: 'none' }}
        >
          Join Chat
        </button>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <h2 className="chat-title">Network Chat UI</h2>

      <div className="chat-controls" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '1rem' }}>
        {options.map((opt) => (
          <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="checkbox"
              value={opt.value}
              checked={selected.includes(opt.value)}
              onChange={() => toggleSelection(opt.value)}
            />
            {opt.label}
          </label>
        ))}
      </div>

      <div className="chat-window" style={{ display: 'flex', flexDirection: 'column' }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className="chat-message"
            style={{
              alignSelf: msg.isServer ? 'flex-start' : (msg.isCurrentUser ? 'flex-end' : 'flex-start'),
              backgroundColor: msg.isServer ? 'rgb(48, 219, 91)' : (msg.isCurrentUser ? '#007aff' : '#e5e5ea'),
              color: msg.isServer ? 'black' : (msg.isCurrentUser ? 'white' : 'black'),
              maxWidth: '70%',
              margin: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '16px',
              textAlign: 'left',
              whiteSpace: 'pre-wrap'
            }}
          >
            <div style={{ fontSize: '0.75rem', marginBottom: '0.25rem', opacity: 0.8 }}>{msg.author}</div>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input" style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
