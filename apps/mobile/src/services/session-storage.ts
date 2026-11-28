import AsyncStorage from '@react-native-async-storage/async-storage';

const accessTokenKey = 'accessToken';
const refreshTokenKey = 'refreshToken';

export function readAccessToken() {
  return AsyncStorage.getItem(accessTokenKey);
}

export function readRefreshToken() {
  return AsyncStorage.getItem(refreshTokenKey);
}

export function saveSession({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) {
  return AsyncStorage.multiSet([[accessTokenKey, accessToken], [refreshTokenKey, refreshToken]]);
}

export function clearSession() {
  return AsyncStorage.multiRemove([accessTokenKey, refreshTokenKey]);
}
