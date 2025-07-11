import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Settings, 
  History, 
  Sun, 
  Moon, 
  Code, 
  Image, 
  Brain, 
  Search, 
  Zap, 
  Menu,
  X,
  ChevronDown,
  MessageSquare,
  Cpu,
  Globe,
  Network,
  Eye,
  Mic,
  FileText,
  BarChart3,
  Sparkles
} from 'lucide-react';

const MCPChatClient = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('claude-4-sonnet');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [activeConnectors, setActiveConnectors] = useState(['filesystem', 'web', 'database']);
  const [requestCounts, setRequestCounts] = useState({
    reasoning: 15,
    superSearch: 8,
    codeGen: 12,
    imageGen: 5,
    orchestration: 3
  });

  const messagesEndRef = useRef(null);

  const models = {
    code: [
      { id: 'claude-4-opus-code', name: 'Claude 4 Opus Code', type: 'Premium' },
      { id: 'claude-4-sonnet-code', name: 'Claude 4 Sonnet Code', type: 'Standard' },
      { id: 'gpt-4-turbo-code', name: 'GPT-4 Turbo Code', type: 'Premium' }
    ],
    language: [
      { id: 'claude-4-sonnet', name: 'Claude 4 Sonnet', type: 'Standard' },
      { id: 'claude-4-opus', name: 'Claude 4 Opus', type: 'Premium' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', type: 'Premium' }
    ],
    orchestration: [
      { id: 'claude-4-orchestrator', name: 'Claude 4 Orchestrator', type: 'Premium' },
      { id: 'meta-llama-orchestrator', name: 'Meta Llama Orchestrator', type: 'Standard' }
    ],
    vision: [
      { id: 'claude-4-vision', name: 'Claude 4 Vision', type: 'Premium' },
      { id: 'gpt-4-vision', name: 'GPT-4 Vision', type: 'Premium' }
    ]
  };

  const connectors = [
    { id: 'filesystem', name: 'Filesystem', icon: FileText, active: true },
    { id: 'web', name: 'Web Search', icon: Globe, active: true },
    { id: 'database', name: 'Database', icon: BarChart3, active: true },
    { id: 'vision', name: 'Vision API', icon: Eye, active: false },
    { id: 'audio', name: 'Audio Processing', icon: Mic, active: false }
  ];

  const powers = [
    { id: 'reasoning', name: 'Reasoning', count: requestCounts.reasoning, icon: Brain, color: 'text-purple-400' },
    { id: 'superSearch', name: 'Super Search', count: requestCounts.superSearch, icon: Search, color: 'text-blue-400' },
    { id: 'codeGen', name: 'Code Gen', count: requestCounts.codeGen, icon: Code, color: 'text-green-400' },
    { id: 'imageGen', name: 'Image Gen', count: requestCounts.imageGen, icon: Image, color: 'text-pink-400' },
    { id: 'orchestration', name: 'Orchestration', count: requestCounts.orchestration, icon: Network, color: 'text-orange-400' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
      model: selectedModel
    };

    setChatHistory(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: `Réponse générée avec ${models.language.find(m => m.id === selectedModel)?.name || selectedModel}. Votre message a été traité avec les connecteurs MCP actifs.`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
        model: selectedModel
      };
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const toggleConnector = (connectorId) => {
    setActiveConnectors(prev => 
      prev.includes(connectorId) 
        ? prev.filter(id => id !== connectorId)
        : [...prev, connectorId]
    );
  };

  const baseClasses = darkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-50 text-gray-900';

  const cardClasses = darkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  return (
    <div className={`min-h-screen ${baseClasses} flex flex-col transition-colors duration-300`}>
      {/* Header */}
      <header className={`${cardClasses} border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm bg-opacity-80`}>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              MCP Chat
            </h1>
          </div>
          
          {/* Model Selector */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className={`${cardClasses} border px-3 py-1.5 rounded-lg text-sm flex items-center space-x-2 hover:bg-opacity-80 transition-all`}
            >
              <Cpu className="w-4 h-4" />
              <span className="max-w-32 truncate">
                {models.language.find(m => m.id === selectedModel)?.name || 'Claude 4 Sonnet'}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {isModelDropdownOpen && (
              <div className={`absolute top-full mt-2 ${cardClasses} border rounded-lg shadow-xl z-50 min-w-64`}>
                {Object.entries(models).map(([category, categoryModels]) => (
                  <div key={category} className="p-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      {category}
                    </div>
                    {categoryModels.map(model => (
                      <button
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model.id);
                          setIsModelDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded hover:bg-opacity-10 hover:bg-blue-500 transition-colors flex items-center justify-between ${
                          selectedModel === model.id ? 'bg-blue-500 bg-opacity-20' : ''
                        }`}
                      >
                        <span className="text-sm">{model.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          model.type === 'Premium' 
                            ? 'bg-yellow-500 bg-opacity-20 text-yellow-400' 
                            : 'bg-gray-500 bg-opacity-20 text-gray-400'
                        }`}>
                          {model.type}
                        </span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Power Counters */}
          <div className="hidden lg:flex items-center space-x-3 mr-4">
            {powers.slice(0, 3).map(power => (
              <div key={power.id} className="flex items-center space-x-1">
                <power.icon className={`w-4 h-4 ${power.color}`} />
                <span className="text-sm font-mono">{power.count}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setIsHistoryOpen(true)}
            className={`p-2 ${cardClasses} border rounded-lg hover:bg-opacity-80 transition-all`}
          >
            <History className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setIsSettingsOpen(true)}
            className={`p-2 ${cardClasses} border rounded-lg hover:bg-opacity-80 transition-all`}
          >
            <Settings className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 ${cardClasses} border rounded-lg hover:bg-opacity-80 transition-all`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Bienvenue sur MCP Chat</h2>
              <p className="text-gray-500 max-w-md">
                Votre assistant IA avancé avec connecteurs MCP intégrés. 
                Commencez une conversation pour exploiter tous les pouvoirs disponibles.
              </p>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 w-full max-w-2xl">
                {[
                  { icon: Code, label: 'Génération de code', color: 'from-green-500 to-emerald-600' },
                  { icon: Brain, label: 'Raisonnement avancé', color: 'from-purple-500 to-violet-600' },
                  { icon: Search, label: 'Recherche web', color: 'from-blue-500 to-cyan-600' },
                  { icon: Image, label: 'Analyse d\'images', color: 'from-pink-500 to-rose-600' }
                ].map((action, index) => (
                  <button
                    key={index}
                    className={`p-4 rounded-xl bg-gradient-to-r ${action.color} bg-opacity-10 hover:bg-opacity-20 transition-all text-center group`}
                  >
                    <action.icon className="w-6 h-6 mx-auto mb-2 text-white group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : `${cardClasses} border`
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                    <span>{msg.timestamp}</span>
                    <span className="font-mono">{msg.model}</span>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={`${cardClasses} border-t p-4`}>
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Tapez votre message... (Shift+Enter pour nouvelle ligne)"
                className={`w-full ${cardClasses} border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all`}
                rows="1"
                style={{ minHeight: '50px', maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          {/* Active Connectors */}
          <div className="flex items-center space-x-2 mt-3 flex-wrap">
            <span className="text-xs text-gray-500 mr-2">Connecteurs actifs:</span>
            {connectors
              .filter(c => activeConnectors.includes(c.id))
              .map(connector => (
                <div
                  key={connector.id}
                  className="flex items-center space-x-1 px-2 py-1 bg-green-500 bg-opacity-20 text-green-400 rounded-full text-xs"
                >
                  <connector.icon className="w-3 h-3" />
                  <span>{connector.name}</span>
                </div>
              ))}
          </div>
        </div>
      </main>

      {/* History Sidebar */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
          <div className="absolute inset-0 bg-black bg-opacity-50 lg:hidden" onClick={() => setIsHistoryOpen(false)} />
          <div className={`fixed right-0 top-0 h-full w-80 ${cardClasses} border-l transform transition-transform lg:relative lg:transform-none ${isHistoryOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Historique</h3>
              <button onClick={() => setIsHistoryOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-500">Aucun historique pour le moment</p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsSettingsOpen(false)} />
          <div className={`${cardClasses} border rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto relative`}>
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-inherit">
              <h3 className="text-xl font-semibold">Paramètres</h3>
              <button onClick={() => setIsSettingsOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Powers */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span>Pouvoirs disponibles</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {powers.map(power => (
                    <div key={power.id} className={`${cardClasses} border rounded-lg p-4`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <power.icon className={`w-5 h-5 ${power.color}`} />
                          <span className="font-medium">{power.name}</span>
                        </div>
                        <span className="font-mono text-lg">{power.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400`}
                          style={{ width: `${(power.count / 20) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connectors */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center space-x-2">
                  <Network className="w-5 h-5 text-blue-400" />
                  <span>Connecteurs MCP</span>
                </h4>
                <div className="space-y-3">
                  {connectors.map(connector => (
                    <div key={connector.id} className={`${cardClasses} border rounded-lg p-4 flex items-center justify-between`}>
                      <div className="flex items-center space-x-3">
                        <connector.icon className="w-5 h-5" />
                        <span className="font-medium">{connector.name}</span>
                      </div>
                      <button
                        onClick={() => toggleConnector(connector.id)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          activeConnectors.includes(connector.id) 
                            ? 'bg-green-500' 
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                          activeConnectors.includes(connector.id) ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MCPChatClient;
