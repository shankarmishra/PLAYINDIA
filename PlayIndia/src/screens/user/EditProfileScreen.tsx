import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Image,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAuth from '../../hooks/useAuth';
import ApiService from '../../services/ApiService';

const EditProfileScreen = () => {
    const navigation = useNavigation();
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        mobile: user?.mobile || '',
        city: user?.preferences?.city || '',
        age: user?.preferences?.age?.toString() || '',
        bio: (user as any)?.profile?.bio || '',
    });

    const handleUpdate = async () => {
        if (!formData.name.trim()) {
            Alert.alert('Error', 'Name is required');
            return;
        }

        try {
            setLoading(true);
            const updateData = {
                name: formData.name,
                preferences: {
                    ...user?.preferences,
                    city: formData.city,
                    age: formData.age ? parseInt(formData.age) : undefined,
                },
                age: formData.age ? parseInt(formData.age) : undefined,
                profile: {
                    ...user?.profile,
                    bio: formData.bio
                }
            };

            const response = await ApiService.users.updateProfile(updateData);
            if (response.data.success) {
                await refreshUser();
                Alert.alert('Success', 'Profile updated successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 44 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Profile Image Section */}
                    <View style={styles.imageSection}>
                        <View style={styles.imageWrapper}>
                            <Image
                                source={{ uri: user?.profileImage || 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png' }}
                                style={styles.profileImage as any}
                            />
                            <TouchableOpacity style={styles.cameraButton}>
                                <Ionicons name="camera" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.imageHint}>Change Profile Picture</Text>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                                placeholder="Enter your name"
                                placeholderTextColor="#94A3B8"
                            />
                        </View>

                        <View style={styles.inputRow}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                                <Text style={styles.label}>Age</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.age}
                                    onChangeText={(text) => setFormData({ ...formData, age: text.replace(/[^0-9]/g, '') })}
                                    placeholder="Age"
                                    placeholderTextColor="#94A3B8"
                                    keyboardType="numeric"
                                    maxLength={3}
                                />
                            </View>

                            <View style={[styles.inputGroup, { flex: 2 }]}>
                                <Text style={styles.label}>City</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.city}
                                    onChangeText={(text) => setFormData({ ...formData, city: text })}
                                    placeholder="Enter city"
                                    placeholderTextColor="#94A3B8"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <TextInput
                                style={[styles.input, styles.disabledInput]}
                                value={formData.email}
                                editable={false}
                                placeholder="Email"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mobile Number</Text>
                            <TextInput
                                style={[styles.input, styles.disabledInput]}
                                value={formData.mobile}
                                editable={false}
                                placeholder="Mobile"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Profile Bio</Text>
                            <TextInput
                                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                                value={formData.bio}
                                onChangeText={(text) => setFormData({ ...formData, bio: text })}
                                placeholder="Tell us about yourself..."
                                placeholderTextColor="#94A3B8"
                                multiline
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.updateButton, loading && { opacity: 0.7 }]}
                        onPress={handleUpdate}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.updateButtonText}>Save Changes</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const neonGreen = '#2E7D32'; // Premium Active Green
const softGreen = '#C8E6C9';
const mutedGreen = '#66BB6A';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F5E9',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#E8F5E9',
        borderBottomWidth: 1,
        borderBottomColor: '#C8E6C9',
    },
    backButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: '#C8E6C9',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0F172A',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    imageSection: {
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 24,
    },
    imageWrapper: {
        position: 'relative',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#2E7D32',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    imageHint: {
        marginTop: 8,
        fontSize: 14,
        color: '#2E7D32',
        fontWeight: '600',
    },
    formContainer: {
        paddingHorizontal: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1B5E20',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
        fontSize: 15,
        color: '#0F172A',
        borderWidth: 1,
        borderColor: '#C8E6C9',
    },
    disabledInput: {
        backgroundColor: '#F1F5F9',
        color: '#94A3B8',
    },
    inputRow: {
        flexDirection: 'row',
    },
    updateButton: {
        backgroundColor: '#2E7D32',
        marginHorizontal: 20,
        marginTop: 12,
        height: 54,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    updateButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default EditProfileScreen;
