'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Send, User, Loader2, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function MessagesPage() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      const { data: sentMessages, error: sentError } = await supabase
        .from('messages')
        .select('receiver_id, profiles!messages_receiver_id_fkey(id, email, full_name, avatar_url)')
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false });

      const { data: receivedMessages, error: receivedError } = await supabase
        .from('messages')
        .select('sender_id, profiles!messages_sender_id_fkey(id, email, full_name, avatar_url)')
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false });

      if (sentError || receivedError) throw sentError || receivedError;

      const conversationMap = new Map();

      sentMessages?.forEach((msg) => {
        const otherId = msg.receiver_id;
        if (!conversationMap.has(otherId)) {
          conversationMap.set(otherId, msg.profiles);
        }
      });

      receivedMessages?.forEach((msg) => {
        const otherId = msg.sender_id;
        if (!conversationMap.has(otherId)) {
          conversationMap.set(otherId, msg.profiles);
        }
      });

      const conversationsList = Array.from(conversationMap.values()).filter(Boolean);
      setConversations(conversationsList);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les conversations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (otherUserId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      const unreadMessages = data?.filter((msg) => !msg.read && msg.receiver_id === user.id) || [];
      if (unreadMessages.length > 0) {
        await supabase
          .from('messages')
          .update({ read: true })
          .in('id', unreadMessages.map((msg) => msg.id));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les messages',
        variant: 'destructive',
      });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const { error } = await supabase.from('messages').insert([
        {
          sender_id: user.id,
          receiver_id: selectedConversation.id,
          content: newMessage.trim(),
        },
      ]);

      if (error) throw error;

      setNewMessage('');
      loadMessages(selectedConversation.id);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer le message',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  const handleGenerateDemoMessages = async () => {
    setGenerating(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        throw new Error('Non authentifié');
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-demo-messages`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération');
      }

      toast({
        title: 'Messages générés',
        description: 'Les messages de démonstration ont été créés',
      });

      loadConversations();
    } catch (error) {
      console.error('Error generating demo messages:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de générer les messages',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  const getInitials = (name, email) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return email?.charAt(0).toUpperCase() || 'U';
  };

  const filteredConversations = conversations.filter((conv) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      conv.full_name?.toLowerCase().includes(searchLower) ||
      conv.email?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-1">Communiquez avec les prestataires</p>
            </div>
            {conversations.length === 0 && !loading && (
              <Button
                onClick={handleGenerateDemoMessages}
                disabled={generating}
                variant="outline"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  'Générer des messages de démo'
                )}
              </Button>
            )}
          </div>

          <Card className="h-[calc(100vh-250px)]">
            <CardContent className="p-0 h-full">
              <div className="flex h-full">
                <div className="w-80 border-r border-gray-200 flex flex-col">
                  <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <ScrollArea className="flex-1">
                    {loading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : filteredConversations.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 px-4">
                        <MessageSquare className="h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-sm text-gray-600 text-center">
                          {searchQuery ? 'Aucun résultat' : 'Aucune conversation'}
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {filteredConversations.map((conversation) => (
                          <button
                            key={conversation.id}
                            onClick={() => setSelectedConversation(conversation)}
                            className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                              selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                            }`}
                          >
                            <Avatar>
                              <AvatarImage src={conversation.avatar_url} />
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {getInitials(conversation.full_name, conversation.email)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-left min-w-0">
                              <p className="text-sm font-medium truncate">
                                {conversation.full_name || conversation.email}
                              </p>
                              <p className="text-xs text-gray-500 truncate">{conversation.email}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>

                <div className="flex-1 flex flex-col">
                  {selectedConversation ? (
                    <>
                      <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={selectedConversation.avatar_url} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(selectedConversation.full_name, selectedConversation.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">
                            {selectedConversation.full_name || selectedConversation.email}
                          </h3>
                          <p className="text-sm text-gray-500">{selectedConversation.email}</p>
                        </div>
                      </div>

                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                          {messages.map((message) => {
                            const isSent = message.sender_id === user.id;
                            return (
                              <div
                                key={message.id}
                                className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-[70%] rounded-lg p-3 ${
                                    isSent
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-gray-100 text-gray-900'
                                  }`}
                                >
                                  <p className="text-sm">{message.content}</p>
                                  <p
                                    className={`text-xs mt-1 ${
                                      isSent ? 'text-blue-100' : 'text-gray-500'
                                    }`}
                                  >
                                    {new Date(message.created_at).toLocaleTimeString('fr-FR', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </ScrollArea>

                      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                        <div className="flex gap-2">
                          <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Écrivez votre message..."
                            disabled={sending}
                          />
                          <Button type="submit" disabled={sending || !newMessage.trim()}>
                            {sending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </form>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <MessageSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Sélectionnez une conversation
                        </h3>
                        <p className="text-sm text-gray-600">
                          Choisissez une conversation pour commencer à échanger
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
