// src/services/storageService.js
class StorageService {
  constructor() {
    this.prefix = 'rentease_';
  }

  // Get item with prefix
  getKey(key) {
    return `${this.prefix}${key}`;
  }

  // Set item
  set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.getKey(key), serialized);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  // Get item
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this.getKey(key));
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  }

  // Remove item
  remove(key) {
    try {
      localStorage.removeItem(this.getKey(key));
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  // Clear all items with prefix
  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  // Check if key exists
  has(key) {
    return localStorage.getItem(this.getKey(key)) !== null;
  }

  // Get all keys with prefix
  keys() {
    const keys = Object.keys(localStorage);
    return keys
      .filter(key => key.startsWith(this.prefix))
      .map(key => key.replace(this.prefix, ''));
  }

  // Set with expiry (TTL)
  setWithExpiry(key, value, ttlMinutes = 60) {
    const item = {
      value: value,
      expiry: new Date().getTime() + (ttlMinutes * 60 * 1000),
    };
    return this.set(key, item);
  }

  // Get with expiry check
  getWithExpiry(key) {
    const item = this.get(key);
    if (!item) return null;
    
    if (item.expiry && item.expiry < new Date().getTime()) {
      this.remove(key);
      return null;
    }
    
    return item.value;
  }

  // Auth specific methods
  setToken(token) {
    return this.set('token', token);
  }

  getToken() {
    return this.get('token');
  }

  removeToken() {
    return this.remove('token');
  }

  setUser(user) {
    return this.set('user', user);
  }

  getUser() {
    return this.get('user');
  }

  removeUser() {
    return this.remove('user');
  }

  setCart(cart) {
    return this.set('cart', cart);
  }

  getCart() {
    return this.get('cart', []);
  }

  removeCart() {
    return this.remove('cart');
  }

  setTheme(theme) {
    return this.set('theme', theme);
  }

  getTheme() {
    return this.get('theme', 'light');
  }

  removeTheme() {
    return this.remove('theme');
  }

  // Additional utility methods
  setLanguage(language) {
    return this.set('language', language);
  }

  getLanguage() {
    return this.get('language', 'en');
  }

  removeLanguage() {
    return this.remove('language');
  }

  setLastVisit() {
    return this.set('lastVisit', new Date().toISOString());
  }

  getLastVisit() {
    return this.get('lastVisit');
  }

  // Clear all auth data (logout)
  clearAuth() {
    this.removeToken();
    this.removeUser();
    return true;
  }

  // Clear all app data
  clearAll() {
    this.clear();
    return true;
  }

  // Get storage size
  getStorageSize() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length * 2; // UTF-16
      }
    }
    return total;
  }

  // Check if storage is available
  isAvailable() {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Get all stored items as object
  getAll() {
    const result = {};
    const keys = this.keys();
    keys.forEach(key => {
      result[key] = this.get(key);
    });
    return result;
  }

  // Get storage usage percentage
  getStorageUsage() {
    const maxSize = 5 * 1024 * 1024; // 5MB limit
    const currentSize = this.getStorageSize();
    return (currentSize / maxSize) * 100;
  }
}

// Create and export singleton instance
export const storage = new StorageService();

// Default export
export default storage;