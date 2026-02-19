import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, StatusBar } from 'react-native';
import { theme } from '../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Bot responses based on keywords
const botResponses: { [key: string]: string[] } = {
  greeting: [
    "Hello! How can I help you today",
    "Hi there! Welcome to PlayIndia support. What can I assist you with",
    "Hey! I'm here to help. What do you need assistance with",
    "Welcome to PlayIndia! How may I assist you today",
    "Good to see you! What can I help you with",
  ],
  order: [
    "I'd be happy to help you with your order. Please provide your order ID",
    "For order-related queries, please share your order number and I'll check the status for you",
    "Sure! To track your order, I need your order ID. Do you have it handy",
    "I can help you with your order. Please share your order ID for quick assistance",
    "To check your order status, please provide your order number starting with ORD-",
  ],
  orderStatus: [
    "Based on your order status, here's what you can expect:\n\n📦 Order Placed - We've received your order\n⏳ Processing - We're preparing your order\n🚚 Shipped - On the way to you\n🏃 Out for Delivery - Almost there!\n✅ Delivered - Package delivered",
    "Your order goes through these stages:\n1. Order Placed\n2. Processing\n3. Shipped\n4. Out for Delivery\n5. Delivered\n\nYou can track each step in real-time",
  ],
  delivery: [
    "Your delivery is typically processed within 2-3 business days. You can track it in the My Orders section",
    "Standard delivery takes 3-5 business days. Express delivery is available for an additional fee",
    "Delivery times vary by location. Usually it takes 3-7 business days after order confirmation",
    "🚚 Free delivery on orders above ₹500!\n\nStandard: 3-5 days\nExpress: 1-2 days (extra charges apply)",
    "We deliver across India! Delivery time depends on your location:\n- Metro cities: 2-3 days\n- Other cities: 4-7 days\n- Remote areas: up to 10 days",
  ],
  payment: [
    "We accept all major payment methods including UPI, Cards, Net Banking, and Wallets",
    "For payment issues, please check your bank account first. If the problem persists, contact our support",
    "All payments are secure and encrypted. We support UPI, Credit/Debit cards, and Net Banking",
    "💳 Accepted Payment Methods:\n• UPI (Google Pay, PhonePe, Paytm)\n• Debit/Credit Cards\n• Net Banking\n• Wallets (Paytm, Amazon Pay)\n• Cash on Delivery",
  ],
  return: [
    "We offer a 7-day return policy for most products. Please ensure the item is unused and in original packaging",
    "To initiate a return, go to My Orders > Select Order > Request Return. Our team will review it within 48 hours",
    "Yes, returns are free for defective products. For other returns, a small shipping fee may apply",
    "🔄 Return Policy:\n• 7-day return window\n• Item must be unused\n• Original packaging required\n• Free return for defective items",
    "To return a product:\n1. Go to My Orders\n2. Select the order\n3. Tap 'Request Return'\n4. Fill in the details\nOur team will respond within 48 hours",
  ],
  refund: [
    "Refunds are processed within 5-7 business days after return is approved",
    "Your refund will be credited to the original payment method within 3-5 business days",
    "Once the returned item is received and inspected, refund is processed within 2-3 business days",
    "💰 Refund Timeline:\n• Return approved: 24-48 hours\n• Refund processed: 2-3 business days\n• Credit to account: 3-5 business days\n\nNote: Original payment method determines credit time",
    "Your refund status can be tracked in 'My Orders' section. Refunds are credited to the original payment method",
  ],
  cancel: [
    "To cancel your order, go to My Orders, select the order, and tap Cancel Order. You can cancel before it's shipped",
    "Order cancellation is possible before the 'Shipped' status. Please check your order and cancel if needed",
    "If your order hasn't shipped yet, you can cancel it from the My Orders section",
    "❌ Cancellation Policy:\n• Cancel before 'Shipped' status\n• Go to My Orders\n• Select order\n• Tap Cancel Order\n\nNote: Once shipped, cancellation not possible",
    "If your order is still in 'Processing' or 'Order Placed' status, you can cancel it. Once shipped, please use return option instead",
  ],
  product: [
    "We have a wide range of sports equipment including cricket, football, tennis, badminton, and more",
    "All our products are authentic and come with manufacturer warranty",
    "For product inquiries, please visit our Shop section or tell me what you're looking for",
    "🏏 Popular Categories:\n• Cricket - Bats, Balls, Kits\n• Football - Balls, Shoes, Goals\n• Tennis - Rackets, Balls, Bags\n• Badminton - Rackets, Shuttles\n• Basketball - Balls, Hoops\n• Swimming - Goggles, Caps",
    "All products on PlayIndia are 100% authentic! We source directly from manufacturers and authorized dealers",
  ],
  price: [
    "Our prices are competitive and include GST. You can also check for ongoing offers",
    "We often have discounts and cashback offers. Check the Offers section regularly",
    "For bulk purchases or special deals, please contact our sales team",
    "💰 Pricing Info:\n• All prices include GST\n• Frequent flash sales\n• Festival discounts up to 70%\n• Student & bulk discounts available",
    "Check our 'Offers' section for current deals! We have:\n• Seasonal sales\n• Bank offers\n• Cashback rewards\n• Coupon codes",
  ],
  support: [
    "I'm here to help! You can also reach our customer support at support@playindia.com or call us at +91 99999 99999",
    "For urgent issues, please call our 24/7 helpline at +91 99999 99999",
    "Our support team is available from 9 AM to 9 PM, 7 days a week",
    "📞 Contact Options:\n• Phone: +91 99999 99999 (24/7)\n• Email: support@playindia.com\n• Chat: Available in app\n• Response time: Within 24 hours",
    "Need more help? Our team is ready to assist! Reach us through chat, call, or email. We're here for you",
  ],
  warranty: [
    "All products come with manufacturer warranty. Warranty period varies by product - usually 6 months to 2 years",
    "Most sports equipment includes 1-year manufacturer warranty. Extended warranty available at checkout",
    "✅ Warranty Info:\n• Manufacturer warranty on all products\n• Warranty period: 6 months - 2 years\n• Extended warranty option at checkout\n• Claims processed within 7 days",
  ],
  shipping: [
    "Shipping is FREE on orders above ₹500! Below that, a nominal ₹49 shipping fee applies",
    "We offer both standard and express shipping. Choose at checkout based on your urgency",
    "🚚 Shipping Details:\n• Free shipping on orders above ₹500\n• Standard: ₹49 (3-5 days)\n• Express: ₹99 (1-2 days)\n• Same-day delivery in select cities",
    "Track your shipment in real-time! You'll receive SMS/email updates at every stage",
  ],
  exchange: [
    "We offer product exchanges within 7 days! The new item will be delivered while picking up the old one",
    "For exchanges, please request through My Orders. We'll arrange pickup and delivery of the new product",
    "🔄 Exchange Policy:\n• 7-day exchange window\n• Same product, different size/color\n• Free exchange for defects\n• Contact support for assistance",
  ],
  account: [
    "To manage your account, go to Profile section. You can update personal details, addresses, and preferences",
    "Your account data is secure with us. We use industry-standard encryption to protect your information",
    "👤 Account Features:\n• Update profile\n• Manage addresses\n• View order history\n• Wishlist\n• Notifications settings",
  ],
  offers: [
    "Check our Offers section for latest deals! We have bank offers, cashback, and flash sales regularly",
    "🎉 Current Offers:\n• Up to 70% off on clearance\n• Bank offers (SBI, HDFC, ICICI)\n• Cashback up to 10%\n• First order discount: 15%",
    "Don't miss our festive sales! Sign up for notifications to get alerts on upcoming deals",
  ],
  thanks: [
    "You're welcome! Is there anything else I can help you with",
    "Happy to help! Feel free to ask if you have more questions",
    "My pleasure! Let me know if you need anything else",
    "Glad I could help! Come back anytime you need assistance",
    "You're welcome! Don't hesitate to reach out if you have more questions. Have a great day! 🎉",
  ],
  default: [
    "I understand. Could you please provide more details so I can assist you better",
    "I'm not sure about that. Would you like me to connect you with a human agent",
    "That's interesting! Let me check on that for you. Could you give me a moment",
    "I didn't quite get that. Could you rephrase or ask about orders, delivery, payments, or returns",
    "I'm still learning! Try asking about:\n• Order status\n• Delivery info\n• Returns & refunds\n• Payment methods\n• Product details",
  ],
};

// Keywords mapping
const keywordMap: { [key: string]: string[] } = {
  greeting: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'good afternoon', 'start', 'help'],
  order: ['order', 'orders', 'order id', 'order number', 'track order', 'order status', 'my order'],
  orderStatus: ['status', 'stage', 'where is', 'progress', 'update'],
  delivery: ['delivery', 'deliver', 'shipping', 'ship', 'when will', 'arrival', 'delivery time', 'delivery charge'],
  shipping: ['shipping', 'ship', 'free delivery', 'delivery charge', 'express delivery', 'same day delivery'],
  payment: ['payment', 'pay', 'price', 'cost', 'discount', 'cashback', 'offer', 'coupon', 'upi', 'card'],
  return: ['return', 'replace', 'exchange', 'return policy'],
  refund: ['refund', 'money back', 'reimbursement', 'refund status', 'when refund'],
  cancel: ['cancel', 'cancelled', 'cancellation', 'cancel order'],
  product: ['product', 'products', 'item', 'items', 'sport', 'equipment', 'cricket', 'football', 'badminton'],
  price: ['price', 'cheap', 'expensive', 'deal', 'sale', 'discount', 'offer', 'cost'],
  offers: ['offers', 'sale', 'deal', 'discount', 'cashback', 'bank offer', 'festive sale', 'flash sale'],
  support: ['support', 'help', 'contact', 'customer service', 'call', 'email', 'phone', 'reach'],
  warranty: ['warranty', 'guarantee', 'manufacturer warranty', 'warranty period', 'extended warranty'],
  exchange: ['exchange', 'swap', 'change size', 'change color'],
  account: ['account', 'profile', 'login', 'signup', 'register', 'password', 'address'],
  thanks: ['thanks', 'thank you', 'thx', 'appreciate', 'grateful', 'welcome', 'nice', 'good'],
};

interface Message {
  id: string;
  text: string;
  time: string;
  sender: 'user' | 'bot';
  read: boolean;
  quickReplies?: { label: string; message: string }[];
}

interface ChatBotProps {
  onClose?: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: "Hello! I'm PlayIndia's AI Assistant. How can I help you today",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'bot',
      read: true,
      quickReplies: [
        { label: 'Track Order', message: 'Track my order' },
        { label: 'Returns', message: 'How to return' },
        { label: 'Payment', message: 'Payment methods' },
        { label: 'Offers', message: 'Current offers' },
      ],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  interface BotResponse {
    text: string;
    quickReplies?: { label: string; message: string }[];
  }
  
  const getBotResponse = (userMessage: string): BotResponse => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Define quick replies for different categories
    const quickRepliesMap: { [key: string]: { label: string; message: string }[] } = {
      greeting: [
        { label: 'Track Order', message: 'Track my order' },
        { label: 'Returns', message: 'How to return' },
        { label: 'Payment', message: 'Payment methods' },
      ],
      order: [
        { label: 'Order Status', message: 'Check order status' },
        { label: 'Cancel Order', message: 'Cancel my order' },
        { label: 'Modify Order', message: 'Modify order' },
      ],
      delivery: [
        { label: 'Delivery Time', message: 'When will it deliver' },
        { label: 'Track Order', message: 'Track my order' },
        { label: 'Change Address', message: 'Change delivery address' },
      ],
      payment: [
        { label: 'UPI', message: 'UPI payment' },
        { label: 'Cards', message: 'Card payment' },
        { label: 'COD', message: 'Cash on delivery' },
      ],
      return: [
        { label: 'How to Return', message: 'How do I return' },
        { label: 'Return Status', message: 'Return status' },
        { label: 'Free Return', message: 'Free return policy' },
      ],
      refund: [
        { label: 'Refund Status', message: 'Refund status' },
        { label: 'Refund Time', message: 'When will I get refund' },
        { label: 'Refund Method', message: 'Refund method' },
      ],
      cancel: [
        { label: 'Yes, Cancel', message: 'Cancel my order' },
        { label: 'No, Keep', message: 'Keep my order' },
        { label: 'Check Status', message: 'Check order status' },
      ],
      product: [
        { label: 'Cricket', message: 'Cricket equipment' },
        { label: 'Football', message: 'Football equipment' },
        { label: 'Badminton', message: 'Badminton equipment' },
      ],
      offers: [
        { label: 'Bank Offers', message: 'Bank offers' },
        { label: 'Festival Sale', message: 'Festival sale' },
        { label: 'Coupons', message: 'Apply coupon' },
      ],
      support: [
        { label: 'Call Us', message: 'Call customer support' },
        { label: 'Email', message: 'Email support' },
        { label: 'Chat', message: 'Chat with agent' },
      ],
      default: [
        { label: 'Track Order', message: 'Track my order' },
        { label: 'Returns', message: 'How to return' },
        { label: 'Payment', message: 'Payment options' },
        { label: 'Offers', message: 'Current offers' },
      ],
    };
    
    // Check for keyword matches
    for (const [category, keywords] of Object.entries(keywordMap)) {
      for (const keyword of keywords) {
        if (lowerMessage.includes(keyword)) {
          const responses = botResponses[category];
          const text = responses[Math.floor(Math.random() * responses.length)];
          const quickReplies = quickRepliesMap[category] || quickRepliesMap.default;
          return { text, quickReplies };
        }
      }
    }
    
    // Return default response
    const defaultResponses = botResponses.default;
    const text = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    return { text, quickReplies: quickRepliesMap.default };
  };

  const handleSend = (messageText?: string) => {
    const text = messageText || inputText;
    if (text.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'user',
      read: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(userMessage.text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'bot',
        read: true,
        quickReplies: botResponse.quickReplies,
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageWrapper,
      { alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start' }
    ]}>
      <View style={[
        styles.messageContainer,
        { 
          alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start',
          backgroundColor: item.sender === 'user' 
            ? theme.colors.accent.neonGreen 
            : theme.colors.background.card 
        }
      ]}>
        {item.sender === 'bot' && (
          <View style={styles.botHeader}>
            <Ionicons name="robot" size={14} color={theme.colors.accent.neonGreen} />
            <Text style={[styles.botLabel, { color: theme.colors.accent.neonGreen }]}>PlayIndia Bot</Text>
          </View>
        )}
        <Text style={[
          styles.messageText,
          { 
            color: item.sender === 'user' 
              ? theme.colors.text.inverted 
              : theme.colors.text.primary 
          }
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.messageTime,
          { 
            color: item.sender === 'user' 
              ? theme.colors.text.inverted 
              : theme.colors.text.secondary 
          }
        ]}>
          {item.time}
        </Text>
      </View>
      
      {/* Quick Replies - Flipkart Style */}
      {item.sender === 'bot' && item.quickReplies && item.quickReplies.length > 0 && (
        <View style={styles.quickRepliesContainer}>
          {item.quickReplies.map((reply, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickReplyButton}
              onPress={() => sendQuickMessage(reply.message)}
            >
              <Text style={styles.quickReplyText}>{reply.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const quickActions = [
    { label: 'Track Order', icon: 'location-outline', action: () => sendQuickMessage('I want to track my order') },
    { label: 'Delivery', icon: 'car-outline', action: () => sendQuickMessage('Tell me about delivery') },
    { label: 'Returns', icon: 'return-up-back-outline', action: () => sendQuickMessage('How do I return a product') },
    { label: 'Payment', icon: 'card-outline', action: () => sendQuickMessage('What payment options available') },
    { label: 'Offers', icon: 'pricetag-outline', action: () => sendQuickMessage('What are the current offers') },
    { label: 'Warranty', icon: 'shield-checkmark-outline', action: () => sendQuickMessage('Tell me about warranty') },
  ];

  const sendQuickMessage = (message: string) => {
    setInputText(message);
    setTimeout(() => handleSend(message), 100);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.botAvatar}>
            <Ionicons name="happy" size={26} color="#FFFFFF" />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>PlayIndia Assistant</Text>
            <View style={styles.statusRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.contactStatus}>Online</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerActions}>
          {onClose && (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close-circle" size={28} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          )}
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

      {/* Typing Indicator */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <View style={[styles.messageContainer, { alignSelf: 'flex-start', backgroundColor: theme.colors.background.card }]}>
            <View style={styles.typingIndicator}>
              <Text style={styles.typingText}>typing</Text>
              <View style={styles.typingDots}>
                <View style={[styles.typingDot, { backgroundColor: theme.colors.text.secondary }]} />
                <View style={[styles.typingDot, { backgroundColor: theme.colors.text.secondary }]} />
                <View style={[styles.typingDot, { backgroundColor: theme.colors.text.secondary }]} />
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle" size={32} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          placeholder="Ask me anything..."
          placeholderTextColor={theme.colors.text.disabled}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            { 
              backgroundColor: inputText.trim() === '' 
                ? theme.colors.ui.border 
                : theme.colors.accent.neonGreen 
            }
          ]}
          onPress={() => handleSend()}
          disabled={inputText.trim() === ''}
        >
          <Ionicons 
            name="send" 
            size={18} 
            color={inputText.trim() === '' 
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: theme.colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.accent.neonGreen,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.accent.neonGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  contactInfo: {
    marginLeft: 12,
  },
  contactName: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 4,
  },
  contactStatus: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  closeButton: {
    padding: 6,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 6,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: theme.colors.background.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.accent.neonGreen,
    minWidth: 65,
    height: 26,
    gap: 3,
  },
  quickActionText: {
    fontSize: 9,
    color: theme.colors.accent.neonGreen,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 16,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    maxWidth: '82%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 12,
  },
  messageWrapper: {
    marginBottom: 4,
  },
  quickRepliesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 10,
  },
  quickReplyButton: {
    backgroundColor: theme.colors.background.secondary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.accent.neonGreen,
  },
  quickReplyText: {
    fontSize: 13,
    color: theme.colors.accent.neonGreen,
    fontWeight: '500',
  },
  botHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  botLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  typingContainer: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typingText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 3,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.background.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.border,
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 13,
    color: theme.colors.text.primary,
    maxHeight: 60,
    minHeight: 36,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatBot;
