import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from '../hooks/useTranslation';

export default function Transaction() {
  const { t } = useTranslation('transaction');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('title')}</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('filter')}</Text>
        <View style={styles.filterButtons}>
          <View style={styles.filterButton}>
            <Text style={styles.filterButtonText}>{t('all_transactions')}</Text>
          </View>
          <View style={styles.filterButton}>
            <Text style={styles.filterButtonText}>{t('income')}</Text>
          </View>
          <View style={styles.filterButton}>
            <Text style={styles.filterButtonText}>{t('expense')}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('all_transactions')}</Text>
        <Text style={styles.emptyText}>{t('no_data')}</Text>
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
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  filterButtonText: {
    fontSize: 13,
    color: '#666',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 32,
  },
});