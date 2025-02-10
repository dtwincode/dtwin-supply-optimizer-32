
import { toArabicNumerals } from '../utils';
import { getTranslation } from '../index';

describe('toArabicNumerals', () => {
  test('converts single digit numbers to Arabic numerals', () => {
    expect(toArabicNumerals(5)).toBe('٥');
    expect(toArabicNumerals(0)).toBe('٠');
    expect(toArabicNumerals(9)).toBe('٩');
  });

  test('converts multi-digit numbers to Arabic numerals', () => {
    expect(toArabicNumerals(123)).toBe('١٢٣');
    expect(toArabicNumerals(1000)).toBe('١٠٠٠');
    expect(toArabicNumerals(9876)).toBe('٩٨٧٦');
  });

  test('handles string input', () => {
    expect(toArabicNumerals('42')).toBe('٤٢');
    expect(toArabicNumerals('007')).toBe('٠٠٧');
  });
});

describe('getTranslation', () => {
  test('returns correct translation for simple keys', () => {
    expect(getTranslation('dashboard', 'en')).toBe('Supply Chain Dashboard');
    expect(getTranslation('dashboard', 'ar')).toBe('لوحة تحكم سلسلة التوريد');
  });

  test('returns correct translation for nested keys', () => {
    expect(getTranslation('navigationItems.dashboard', 'en')).toBe('Dashboard');
    expect(getTranslation('navigationItems.dashboard', 'ar')).toBe('لوحة التحكم');
  });

  test('returns correct translation for deeply nested keys', () => {
    expect(getTranslation('common.chartTitles.bufferProfile', 'en')).toBe('Buffer Profile Distribution');
    expect(getTranslation('common.chartTitles.bufferProfile', 'ar')).toBe('توزيع نسب المخزون');
  });

  test('returns key when translation is not found', () => {
    expect(getTranslation('nonexistent.key', 'en')).toBe('nonexistent.key');
    expect(getTranslation('invalid.path', 'ar')).toBe('invalid.path');
  });

  test('handles common translations correctly', () => {
    expect(getTranslation('common.skus', 'en')).toBe('SKUs');
    expect(getTranslation('common.skus', 'ar')).toBe('وحدات تخزين');
  });

  test('handles zone translations correctly', () => {
    expect(getTranslation('common.zones.green', 'en')).toBe('Green Zone');
    expect(getTranslation('common.zones.green', 'ar')).toBe('المنطقة الخضراء');
  });
});
