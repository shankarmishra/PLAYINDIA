import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText?: string;
  onPress?: () => void;
  badge?: string;
  rating?: number;
}

interface AnimatedHeroBannerProps {
  banners: Banner[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showPagination?: boolean;
  height?: number;
}

const AnimatedHeroBanner: React.FC<AnimatedHeroBannerProps> = ({
  banners,
  autoPlay = true,
  autoPlayInterval = 5000,
  showPagination = true,
  height = 200,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!autoPlay || banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % banners.length;
        
        // Fade animation
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();

        // Scroll to next banner
        scrollViewRef.current?.scrollTo({
          x: nextIndex * SCREEN_WIDTH,
          animated: true,
        });

        return nextIndex;
      });
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, banners.length]);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const handlePaginationPress = (index: number) => {
    setCurrentIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * SCREEN_WIDTH,
      animated: true,
    });
  };

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={[styles.scrollView, { height }]}
        >
          {banners.map((banner, index) => (
            <TouchableOpacity
              key={banner.id}
              style={[styles.bannerCard, { width: SCREEN_WIDTH - 40, height: height - 20 }]}
              activeOpacity={0.9}
              onPress={banner.onPress}
            >
              {/* Banner Image */}
              <Image
                source={{ uri: banner.image }}
                style={styles.bannerImage}
                resizeMode="cover"
              />
              
              {/* Gradient Overlay - Using multiple Views for gradient effect */}
              <View style={styles.gradientOverlayTop} />
              <View style={styles.gradientOverlayMiddle} />
              <View style={styles.gradientOverlayBottom} />
              
              {/* Content */}
              <View style={styles.content}>
                {/* Badge */}
                {banner.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{banner.badge}</Text>
                  </View>
                )}

                {/* Rating */}
                {banner.rating && (
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#FF6A00" />
                    <Text style={styles.ratingText}>{banner.rating}</Text>
                  </View>
                )}

                {/* Title and Subtitle */}
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{banner.title}</Text>
                  <Text style={styles.subtitle}>{banner.subtitle}</Text>
                </View>

                {/* CTA Button */}
                {banner.ctaText && (
                  <TouchableOpacity
                    style={styles.ctaButton}
                    onPress={banner.onPress}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.ctaButtonText}>{banner.ctaText}</Text>
                    <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Pagination Dots */}
      {showPagination && banners.length > 1 && (
        <View style={styles.paginationContainer}>
          {banners.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.paginationDot,
                currentIndex === index && styles.paginationDotActive,
              ]}
              onPress={() => handlePaginationPress(index)}
              activeOpacity={0.7}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  scrollView: {
    marginHorizontal: -20,
  },
  bannerCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradientOverlayTop: {
    position: 'absolute',
    bottom: '40%',
    left: 0,
    right: 0,
    height: '20%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  gradientOverlayMiddle: {
    position: 'absolute',
    bottom: '20%',
    left: 0,
    right: 0,
    height: '20%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  gradientOverlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '20%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 24,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF6A00',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  ratingText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 4,
  },
  textContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
    letterSpacing: 0.3,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: '#0F172A',
  },
});

export default AnimatedHeroBanner;
