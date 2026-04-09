import React, { useState } from 'react'
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { Input, Button } from '@/components/ui'

interface Message {
  id: string
  user: string
  text: string
  timestamp: Date
}

export default function ChatPage () {
  const [messages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="px-4 py-3 border-b border-border">
        <Text className="text-foreground font-semibold text-lg">Chat</Text>
        <Text className="text-muted-foreground text-xs">IRC Chat - Connect to discuss anime</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-2">
        {messages.length === 0 && (
          <View className="flex-1 items-center justify-center mt-20">
            <Text className="text-muted-foreground">No messages yet. Connect to a channel to start chatting.</Text>
          </View>
        )}
        {messages.map((msg) => (
          <View key={msg.id} className="mb-2">
            <View className="flex-row items-baseline gap-2">
              <Text className="text-foreground text-sm font-medium">{msg.user}</Text>
              <Text className="text-muted-foreground text-xs">
                {msg.timestamp.toLocaleTimeString()}
              </Text>
            </View>
            <Text className="text-foreground text-sm">{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View className="flex-row items-center px-4 py-2 border-t border-border gap-2">
        <Input
          className="flex-1"
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
        />
        <Button size="sm" onPress={() => setInput('')}>
          Send
        </Button>
      </View>
    </KeyboardAvoidingView>
  )
}
