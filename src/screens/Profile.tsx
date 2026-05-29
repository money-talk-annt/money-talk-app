import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { Button } from '@react-navigation/elements';
import { PATHNAME } from '../constants/pathname';

export default function Profile() {
  const { t } = useTranslation('profile');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('title')}</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('user_info')}</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>{t('email')}</Text>
          <Text style={styles.infoValue}>user@example.com</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>{t('phone')}</Text>
          <Text style={styles.infoValue}>+1 (555) 123-4567</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('preferences')}</Text>
        <LanguageSwitcher />
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>{t('currency')}</Text>
          <Text style={styles.settingValue}>USD ($)</Text>
          <Button screen={PATHNAME.WALLET}>
            Go to wallet
          </Button>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Add wallet</Text>
          <Text style={styles.settingValue} />
          <Button screen={PATHNAME.ADDWALLET}>
            Add Wallet
          </Button>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>{t('theme')}</Text>
          <Text style={styles.settingValue}>Light</Text>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>{t('logout')}</Text>
        </TouchableOpacity>
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
  infoBox: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  settingValue: {
    fontSize: 14,
    color: '#999',
  },
  button: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});