import { describe, expect, it } from 'vitest';
import searchSchema, { type searchSchemaType } from '../schema';

describe('SearchBar Schema Validation', () => {
  describe('searchTitle validation', () => {
    it('should validate a valid movie title', () => {
      const validData: searchSchemaType = {
        searchTitle: 'Inception',
        selectedTitle: 'Inception',
        type: 'movie',
      };

      const result = searchSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate titles with numbers and spaces', () => {
      const validData: searchSchemaType = {
        searchTitle: 'Terminator 2 Judgment Day',
        selectedTitle: 'Terminator 2 Judgment Day',
        type: 'movie',
      };

      const result = searchSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty search title', () => {
      const invalidData = {
        searchTitle: '',
        selectedTitle: '',
        type: 'movie',
      };

      const result = searchSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Movie titles can only contain letters, numbers and spaces'
        );
      }
    });

    it('should reject search title with only whitespace', () => {
      const invalidData = {
        searchTitle: '   ',
        selectedTitle: '',
        type: 'movie',
      };

      const result = searchSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Movie titles can only contain letters, numbers and spaces'
        );
      }
    });

    it('should reject search title with special characters', () => {
      const invalidData = {
        searchTitle: 'Movie@Title!',
        selectedTitle: '',
        type: 'movie',
      };

      const result = searchSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Movie titles can only contain letters, numbers and spaces'
        );
      }
    });

    it('should reject search title with symbols', () => {
      const invalidData = {
        searchTitle: 'Movie-Title_Test',
        selectedTitle: '',
        type: 'movie',
      };

      const result = searchSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Movie titles can only contain letters, numbers and spaces'
        );
      }
    });

    it('should reject search title exceeding 100 characters', () => {
      const longTitle = 'a'.repeat(101);
      const invalidData = {
        searchTitle: longTitle,
        selectedTitle: '',
        type: 'movie',
      };

      const result = searchSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Movie title should be under 100 characters'
        );
      }
    });

    it('should accept search title at maximum length (100 characters)', () => {
      const maxTitle = 'a'.repeat(100);
      const validData: searchSchemaType = {
        searchTitle: maxTitle,
        selectedTitle: maxTitle,
        type: 'movie',
      };

      const result = searchSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('selectedTitle validation', () => {
    it('should accept any string for selectedTitle', () => {
      const validData: searchSchemaType = {
        searchTitle: 'Inception',
        selectedTitle: 'Any string here',
        type: 'movie',
      };

      const result = searchSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept empty selectedTitle', () => {
      const validData: searchSchemaType = {
        searchTitle: 'Inception',
        selectedTitle: '',
        type: 'movie',
      };

      const result = searchSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('type validation', () => {
    it('should accept "movie" type', () => {
      const validData: searchSchemaType = {
        searchTitle: 'Inception',
        selectedTitle: 'Inception',
        type: 'movie',
      };

      const result = searchSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept "series" type', () => {
      const validData: searchSchemaType = {
        searchTitle: 'Breaking Bad',
        selectedTitle: 'Breaking Bad',
        type: 'series',
      };

      const result = searchSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept "episode" type', () => {
      const validData: searchSchemaType = {
        searchTitle: 'Breaking Bad S01E01',
        selectedTitle: 'Breaking Bad S01E01',
        type: 'episode',
      };

      const result = searchSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid type', () => {
      const invalidData = {
        searchTitle: 'Inception',
        selectedTitle: 'Inception',
        type: 'invalid',
      };

      const result = searchSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle trimming of searchTitle', () => {
      const dataWithSpaces = {
        searchTitle: '  Inception  ',
        selectedTitle: 'Inception',
        type: 'movie',
      };

      const result = searchSchema.safeParse(dataWithSpaces);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.searchTitle).toBe('Inception');
      }
    });

    it('should reject missing required fields', () => {
      const incompleteData = {
        searchTitle: 'Inception',
      };

      const result = searchSchema.safeParse(incompleteData);
      expect(result.success).toBe(false);
    });

    it('should validate single character title', () => {
      const validData: searchSchemaType = {
        searchTitle: 'A',
        selectedTitle: 'A',
        type: 'movie',
      };

      const result = searchSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate title with multiple spaces', () => {
      const validData: searchSchemaType = {
        searchTitle: 'The Lord of the Rings',
        selectedTitle: 'The Lord of the Rings',
        type: 'movie',
      };

      const result = searchSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});
