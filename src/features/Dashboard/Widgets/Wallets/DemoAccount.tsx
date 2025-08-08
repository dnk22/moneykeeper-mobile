import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Dimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PressableHaptic from 'components/PressableHaptic';
import RNText from 'components/Text';
import { ROUTES } from 'navigation/constants/routes';
import { AddSquare } from 'iconsax-react-native';
import { ACCOUNT_CATEGORY_ID } from 'utils/constants/account';
import ImageComponent from 'components/ImageComponent';
import { demoStyles } from './styles';

// Lấy chiều rộng màn hình cho carousel
const { width } = Dimensions.get('window');

const CARD_WIDTH = width * 0.66; // Card chiếm 70% chiều rộng màn hình
const CARD_MARGIN = 10;
const DEFAULT_ACTIVE_INDEX = 1; // Index 1 là card ở giữa (Ví tiền mặt)

// Giả lập loại tài khoản để hiển thị
const mockAccountTypes = [
  {
    accountName: 'Techcombank',
    accountIcon: 'bank',
    accountTypeId: ACCOUNT_CATEGORY_ID.BANK,
  },
  {
    accountName: 'Ví tiền mặt',
    accountIcon: 'https://i.imgur.com/eX0eKeO.png',
    accountTypeId: ACCOUNT_CATEGORY_ID.MONEY,
  },
  {
    accountName: 'Momo',
    accountIcon: 'creditCard',
    accountTypeId: ACCOUNT_CATEGORY_ID.EWALLET,
  },
];

interface DemoAccountProps {
  colors: any;
}

const DemoAccount: React.FC<DemoAccountProps> = ({ colors }) => {
  const navigation = useNavigation<any>();
  const [activeIndex, setActiveIndex] = useState(DEFAULT_ACTIVE_INDEX);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // Scroll đến card ở giữa khi component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: CARD_WIDTH * DEFAULT_ACTIVE_INDEX - CARD_MARGIN * 2,
          animated: false,
        });
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const onNavigateAddAccount = (params?: { accountTypeId?: number; bankId?: string }): void => {
    navigation.navigate(ROUTES.ADD_ACCOUNT, params);
  };

  // Render một card tài khoản demo
  const renderDemoCard = ({ item }: { item: any }) => {
    return (
      <PressableHaptic onPress={() => onNavigateAddAccount({ accountTypeId: item.accountTypeId })}>
        <View style={[demoStyles.demoCard, { backgroundColor: colors.card }]}>
          <View style={[demoStyles.demoIconContainer, { backgroundColor: `${colors.primary}20` }]}>
            <ImageComponent name={item.accountIcon} size={40} />
          </View>
          <RNText>{item.accountName}</RNText>
          <RNText preset="subTitle">Nhấn để thêm ví nhanh</RNText>
        </View>
      </PressableHaptic>
    );
  };

  // Xử lý khi scroll kết thúc
  const handleMomentumScrollEnd = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const newIndex = Math.round(contentOffset.x / (CARD_WIDTH + CARD_MARGIN * 2));
    setActiveIndex(newIndex);
  };

  return (
    <View style={demoStyles.container}>
      <RNText preset="subTitle" numberOfLines={2} style={demoStyles.description}>
        Thêm ví để quản lý tài chính hiệu quả hơn.
      </RNText>
      <View style={demoStyles.carouselContainer}>
        <Animated.ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
          snapToAlignment="center"
          contentContainerStyle={demoStyles.scrollViewContent}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
        >
          {mockAccountTypes.map((item, index) => (
            <View
              key={index}
              style={[
                demoStyles.carouselItem,
                { width: CARD_WIDTH, marginHorizontal: CARD_MARGIN },
              ]}
            >
              {renderDemoCard({ item })}
            </View>
          ))}
        </Animated.ScrollView>

        <View style={demoStyles.indicatorContainer}>
          {mockAccountTypes.map((_, index) => (
            <View
              key={index}
              style={[
                demoStyles.indicator,
                index === activeIndex && [
                  demoStyles.activeIndicator,
                  { backgroundColor: colors.primary },
                ],
              ]}
            />
          ))}
        </View>
      </View>

      <PressableHaptic style={demoStyles.addAccountNow} onPress={() => onNavigateAddAccount()}>
        <View style={demoStyles.addAccountNow}>
          <AddSquare size={15} variant="Broken" color={colors.primary} />
          <RNText color={colors.primary} style={{ fontWeight: '500' }}>
            Mở ví khác
          </RNText>
        </View>
      </PressableHaptic>
    </View>
  );
};

export default DemoAccount;
