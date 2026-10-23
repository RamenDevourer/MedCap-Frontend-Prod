import { useState } from 'react';
import { initials, hasCustomPicture } from '../../lib/session';

const sizes = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-20 w-20 text-2xl',
};

const Avatar = ({ user, size = 'sm', className = '' }) => {
  const [broken, setBroken] = useState(false);
  const src = hasCustomPicture(user) ? user.profilePicture : null;

  return (
    <span
      className={`relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-brand-100 font-display font-semibold text-brand-700 ring-2 ring-white ${sizes[size]} ${className}`}
    >
      {src && !broken ? (
        <img src={src} alt="" className="h-full w-full object-cover" onError={() => setBroken(true)} />
      ) : (
        initials(user)
      )}
    </span>
  );
};

export default Avatar;
