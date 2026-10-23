// Thin wrapper around the localStorage keys the app already uses
// (accessToken, user, loggedIn) so every component reads them the same way.

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const isLoggedIn = () =>
  localStorage.getItem('loggedIn') === 'true' && Boolean(localStorage.getItem('user'));

export const clearSession = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  localStorage.setItem('loggedIn', 'false');
};

// Placeholder image the backend stores when a user signs up without a photo.
export const DEFAULT_PROFILE_PICTURE =
  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

export const hasCustomPicture = (user) =>
  Boolean(user?.profilePicture) && user.profilePicture !== DEFAULT_PROFILE_PICTURE;

export const initials = (user) => {
  if (!user) return '';
  const first = user.firstName?.[0] ?? '';
  const last = user.lastName?.[0] ?? '';
  return (first + last).toUpperCase() || user.email?.[0]?.toUpperCase() || '?';
};
