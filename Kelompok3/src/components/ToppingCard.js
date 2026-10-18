import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import formatCurrency from '../utils/formatCurrency';

export default function ToppingCard({ item }) {
  const [imageError, setImageError] = useState(false);

  const imageSource =
    typeof item.image === 'string' ? { uri: item.image } : item.image;

  return (
    <View style={styles.card}>
      {/* Item Image with Fallback Emoji */}
      <View style={styles.imageWrapper}>
        {!imageError && item.image ? (
          <Image
            source={imageSource}
            style={styles.image}
            onError={() => setImageError(true)}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.emojiFallback}>
            <Text style={styles.emojiText}>{item.emoji || '🍲'}</Text>
          </View>
        )}

        {/* Kategori Badge */}
        {item.kategori && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{item.kategori}</Text>
          </View>
        )}
      </View>

      {/* Item Info */}
      <View style={styles.infoWrapper}>
        <Text style={styles.name} numberOfLines={1}>
          {item.nama}
        </Text>
        {item.berat && <Text style={styles.weight}>{item.berat}</Text>}
      </View>

      {/* Price Tag */}
      <View style={styles.priceTag}>
        <Text style={styles.price}>{formatCurrency(item.harga)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#EFE7E2',
    elevation: 2,
    shadowColor: '#301810',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 140,
    maxWidth: 180,
    flex: 1,
    margin: 8,
  },
  imageWrapper: {
    width: '100%',
    height: 105,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F8F1EB',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  emojiFallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF3E8',
  },
  emojiText: {
    fontSize: 44,
  },
  categoryBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(44, 24, 16, 0.72)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  infoWrapper: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
    width: '100%',
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2C1810',
    textAlign: 'center',
  },
  weight: {
    fontSize: 11,
    color: '#8D7B70',
    marginTop: 2,
    fontWeight: '500',
  },
  priceTag: {
    width: '100%',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#FDECEC',
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: '#C62828',
  },
});