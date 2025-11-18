import { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function AiChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        
        // Add user message
        const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const response = await fetch('/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages.slice(-10), // Only send last 10 messages for context
                }),
            });

            const data = await response.json();

            if (data.success) {
                setMessages([...newMessages, { role: 'assistant', content: data.response }]);
            } else {
                setMessages([
                    ...newMessages,
                    { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
                ]);
            }
        } catch (error) {
            setMessages([
                ...newMessages,
                { role: 'assistant', content: 'Sorry, I could not connect. Please try again later.' },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50 bg-gradient-to-br from-primary to-primary/80"
                    size="icon"
                >
                    <MessageCircle className="h-7 w-7" />
                </Button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <Card className="fixed bottom-6 right-6 w-full max-w-md sm:w-[420px] h-[600px] shadow-2xl z-50 flex flex-col border-2 animate-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b bg-gradient-to-r from-primary/5 to-primary/10">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Avatar className="h-10 w-10 border-2 border-primary/20">
                                    <AvatarFallback className="bg-primary/10">
                                        <Bot className="h-5 w-5 text-primary" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-base">AI Support Assistant</h3>
                                <p className="text-xs text-muted-foreground">Online • Ready to help</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-destructive/10 hover:text-destructive"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
                        {messages.length === 0 && (
                            <div className="text-center text-muted-foreground py-12">
                                <div className="relative inline-block">
                                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                                    <Bot className="h-16 w-16 mx-auto mb-4 text-primary relative" />
                                </div>
                                <p className="text-base font-medium mb-2">Welcome to SupportHub AI</p>
                                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                    I'm here to help with IT support questions, troubleshooting, and technical assistance.
                                </p>
                                <div className="mt-6 flex flex-col gap-2 text-xs">
                                    <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 text-left border">
                                        <p className="font-medium mb-1">💡 Try asking:</p>
                                        <ul className="space-y-1 text-muted-foreground">
                                            <li>• How do I reset my password?</li>
                                            <li>• What are your support hours?</li>
                                            <li>• How do I create a ticket?</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                <Avatar className={`h-8 w-8 shrink-0 ${message.role === 'user' ? 'bg-primary' : 'bg-muted border-2 border-border'}`}>
                                    <AvatarFallback className={message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}>
                                        {message.role === 'user' ? (
                                            <User className="h-4 w-4" />
                                        ) : (
                                            <Bot className="h-4 w-4 text-primary" />
                                        )}
                                    </AvatarFallback>
                                </Avatar>
                                <div
                                    className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                                        message.role === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                            : 'bg-background border border-border rounded-tl-sm'
                                    }`}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-3">
                                <Avatar className="h-8 w-8 shrink-0 bg-muted border-2 border-border">
                                    <AvatarFallback className="bg-muted">
                                        <Bot className="h-4 w-4 text-primary" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="bg-background border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                                    <div className="flex items-center gap-1">
                                        <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t bg-background/95 backdrop-blur-sm">
                        <div className="flex gap-2">
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me anything..."
                                className="min-h-[56px] max-h-[120px] resize-none rounded-xl border-2 focus:border-primary/50 transition-colors"
                                disabled={isLoading}
                            />
                            <Button
                                onClick={sendMessage}
                                disabled={!input.trim() || isLoading}
                                size="icon"
                                className="h-[56px] w-[56px] rounded-xl shrink-0 transition-all hover:scale-105"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Send className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                            Powered by AI • Press Enter to send
                        </p>
                    </div>
                </Card>
            )}
        </>
    );
}
