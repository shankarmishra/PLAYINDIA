import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList, Image } from 'react-native';
import { theme } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Mock data for messages
const mockMessages = [
  {
    id: '1',
    text: 'Hey, are we still on for the cricket match this Sunday?',
    time: '10:30 AM',
    sender: 'other',
    read: true,
  },
  {
    id: '2',
    text: 'Yes, I\'m looking forward to it! Are we meeting at the usual place?',
    time: '10:32 AM',
    sender: 'me',
    read: true,
  },
  {
    id: '3',
    text: 'Yes, the community center at 6 PM. Don\'t forget to bring your gear!',
    time: '10:33 AM',
    sender: 'other',
    read: true,
  },
  {
    id: '4',
    text: 'Perfect! I\'ll be there. Should we invite the others too?',
    time: '10:35 AM',
    sender: 'me',
    read: true,
  },
  {
    id: '5',
    text: 'Sure, I\'ll send them a message. See you on Sunday!',
    time: '10:36 AM',
    sender: 'other',
    read: true,
  },
  {
    id: '6',
    text: 'Looking forward to it! Have a great day.',
    time: '10:37 AM',
    sender: 'me',
    read: true,
  },
  {
    id: '7',
    text: 'Same to you! 😊',
    time: '10:38 AM',
    sender: 'other',
    read: true,
  },
];

const ChatScreen = () => {
  const [messages, setMessages] = useState(mockMessages);
  const [messageText, setMessageText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (messageText.trim() === '') return;
    
    const newMessage = {
      id: (messages.length + 1).toString(),
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'me',
      read: false,
    };
    
    setMessages([...messages, newMessage]);
    setMessageText('');
    
    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }: any) => (
    <View style={[
      styles.messageContainer,
      { 
        alignSelf: item.sender === 'me' ? 'flex-end' : 'flex-start',
        backgroundColor: item.sender === 'me' 
          ? theme.colors.accent.neonGreen 
          : theme.colors.background.card 
      }
    ]}>
      <Text style={[
        styles.messageText,
        { 
          color: item.sender === 'me' 
            ? theme.colors.text.inverted 
            : theme.colors.text.primary 
        }
      ]}>
        {item.text}
      </Text>
      <Text style={[
        styles.messageTime,
        { 
          color: item.sender === 'me' 
            ? theme.colors.text.inverted 
            : theme.colors.text.secondary 
        }
      ]}>
        {item.time}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
            style={styles.contactImage} 
          />
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>Rahul Patel</Text>
            <Text style={styles.contactStatus}>Online</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity>
            <Ionicons name="call-outline" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction}>
            <Ionicons name="videocam-outline" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction}>
            <Ionicons name="information-circle-outline" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachmentButton}>
          <Ionicons name="attach-outline" size={24} color={theme.colors.text.secondary} />
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor={theme.colors.text.disabled}
          value={messageText}
          onChangeText={setMessageText}
          multiline
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            { 
              backgroundColor: messageText.trim() === '' 
                ? theme.colors.ui.border 
                : theme.colors.accent.neonGreen 
            }
          ]}
          onPress={handleSend}
          disabled={messageText.trim() === ''}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={messageText.trim() === '' 
              ? theme.colors.text.disabled 
              : theme.colors.text.inverted} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    ...theme.shadows.small,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.md,
  },
  contactInfo: {
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  contactStatus: {
    fontSize: 12,
    color: theme.colors.status.success,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerAction: {
    marginLeft: theme.spacing.md,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  messagesContent: {
    paddingBottom: theme.spacing.xl,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.sm,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 12,
    marginTop: theme.spacing.xs,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.divider,
  },
  attachmentButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  textInput: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.large,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text.primary,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
});

export default ChatScreen;