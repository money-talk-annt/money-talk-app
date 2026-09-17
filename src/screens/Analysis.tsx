import React, { useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from '../hooks/useTranslation';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';

export default function Analysis() {
  const { t } = useTranslation('analysis');
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo?.({ y: 0, animated: false });
    }, []),
  );

  return (
    <ScrollView ref={scrollRef} style={styles.container}>
      <Text style={styles.title}>{t('title')}</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('statistics')}</Text>
        <View style={styles.statBox}>
          <Text style={styles.statBoxText}>{t('chart')}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('spending_by_category')}</Text>
        <View style={styles.statBox}>
          <Text style={styles.statBoxText}>{t('chart')}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('trends')}</Text>
        <View style={styles.periodButtons}>
          <View style={styles.periodButton}>
            <Text style={styles.periodButtonText}>{t('weekly')}</Text>
          </View>
          <View style={styles.periodButton}>
            <Text style={styles.periodButtonText}>{t('monthly')}</Text>
          </View>
          <View style={styles.periodButton}>
            <Text style={styles.periodButtonText}>{t('yearly')}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  statBox: {
    backgroundColor: '#f5f5f5',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBoxText: {
    fontSize: 14,
    color: '#999',
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  periodButtonText: {
    fontSize: 13,
    color: '#666',
  },
});