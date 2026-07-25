'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Paperclip, Zap, Loader } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatInterfaceProps {
  projectId: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

export function ChatInterface({ projectId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  
  const placeholders = [
    'Design an IoT temperature sensor with WiFi...',
    'Create a power management system for wearables...',
    'Build a wireless charging circuit...',
    'Design a battery-powered tracking device...',
  ];

  // Typewriter effect for placeholder
  useEffect(() => {
    const currentPlaceholder = placeholders[placeholderIndex % placeholders.length];
    const timer = setTimeout(() => {
      if (displayedPlaceholder.length < currentPlaceholder.length) {
        setDisplayedPlaceholder(currentPlaceholder.slice(0, displayedPlaceholder.length + 1));
      } else {
        setTimeout(() => {
          setDisplayedPlaceholder('');
          setPlaceholderIndex((i) => i + 1);
        }, 2000);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [displayedPlaceholder, placeholderIndex, placeholders]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I've analyzed your request. Here's what I\'ll do:

1. **Requirement Analysis Agent** will extract and clarify your specifications
2. **Hardware Architecture Agent** will design the system topology
3. **Component Intelligence Agent** will select optimal components
4. **Circuit & PCB Design Agent** will generate schematics
5. **Validation Agent** will check for design rules and compatibility
6. **Documentation Agent** will compile everything

Your complete engineering design package will include:
• System architecture and block diagrams
• Detailed component BOM with suppliers
• Full circuit schematics
• PCB layout recommendations
• Power analysis and battery estimates
• Validation reports
• Complete technical documentation`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background/50 via-background/40 to-background/50">
      {/* Hero Section - When no messages */}
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center">
          <h1 className="text-5xl md:text-6xl font-display tracking-tight leading-tight mb-6">
            Design your
            <br />
            <span className="text-foreground/70">hardware</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-12">
            Describe your hardware idea in natural language and get manufacturing-ready specifications with schematics, BOMs, validation reports, and complete documentation.
          </p>
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <ScrollArea className="flex-1 px-6 py-4">
        <div className="space-y-6 pr-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-foreground/10 text-foreground text-xs font-bold">
                    D
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-2xl p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-foreground/10 text-foreground'
                    : 'bg-background/40 text-foreground border border-foreground/10'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                {message.isLoading && (
                  <div className="flex items-center gap-2 mt-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-xs">Agents working...</span>
                  </div>
                )}
              </div>

              {message.role === 'user' && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold">
                    Y
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-foreground/10 text-foreground text-xs font-bold">
                  D
                </AvatarFallback>
              </Avatar>
              <div className="bg-background/40 text-foreground border border-foreground/10 p-3 rounded-lg flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                <span className="text-sm">Processing your request...</span>
              </div>
            </div>
          )}
        </div>
        </ScrollArea>
      )}

      {/* Input Area */}
      <div className="border-t border-foreground/10 p-6 bg-gradient-to-t from-background/40 to-background/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          {/* Pill Input */}
          <div className="flex items-center gap-3 px-6 py-3 bg-background/60 rounded-full border border-foreground/20 hover:border-foreground/40 transition-all duration-300 focus-within:border-foreground/60 focus-within:scale-105">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground transition-all duration-300 active:scale-90"
            >
              <Paperclip className="w-4 h-4" />
            </Button>

            <Input
              placeholder={displayedPlaceholder || placeholders[0]}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm flex-1"
            />

            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="h-8 w-8 bg-foreground hover:bg-foreground/90 text-background transition-all duration-300 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-4 text-center">
            Powered by 6 specialized AI agents working in parallel
          </p>
        </div>
      </div>
    </div>
  );
}
