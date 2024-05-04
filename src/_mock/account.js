import { useSelector } from 'react-redux';

export function useAccount() {
  const user = useSelector(state => state.auth.user);

  const account = {
    displayName: user ? user.username : '', 
    email: user ? user.email : '',
    photoURL: user ? user.photoURL :'',
  };

  return account;
}
