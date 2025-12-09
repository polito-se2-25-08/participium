import { getCategoryId, CATEGORY_MAP } from '../../../src/utils/categoryMapper';

describe('categoryMapper', () => {
  describe('getCategoryId', () => {
    it('should return correct ID for valid categories', () => {
      expect(getCategoryId('water_supply')).toBe(1);
      expect(getCategoryId('architectural_barriers')).toBe(2);
      expect(getCategoryId('sewer_system')).toBe(3);
      expect(getCategoryId('public_lighting')).toBe(4);
      expect(getCategoryId('waste')).toBe(5);
      expect(getCategoryId('road_signs_traffic_lights')).toBe(6);
      expect(getCategoryId('roads_urban_furnishings')).toBe(7);
      expect(getCategoryId('public_green_areas_playgrounds')).toBe(8);
      expect(getCategoryId('other')).toBe(9);
    });

    it('should throw error for invalid category', () => {
      expect(() => getCategoryId('invalid_category')).toThrow('Invalid category: invalid_category');
      expect(() => getCategoryId('')).toThrow();
      expect(() => getCategoryId('random')).toThrow();
    });

    it('should be case sensitive', () => {
      expect(() => getCategoryId('WATER_SUPPLY')).toThrow();
      expect(() => getCategoryId('Water_Supply')).toThrow();
    });
  });

  describe('CATEGORY_MAP', () => {
    it('should have all expected categories', () => {
      expect(Object.keys(CATEGORY_MAP)).toHaveLength(9);
      expect(CATEGORY_MAP).toHaveProperty('water_supply');
      expect(CATEGORY_MAP).toHaveProperty('other');
    });

    it('should have unique IDs', () => {
      const ids = Object.values(CATEGORY_MAP);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should have sequential IDs from 1 to 9', () => {
      const ids = Object.values(CATEGORY_MAP).sort((a, b) => a - b);
      expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });
});
