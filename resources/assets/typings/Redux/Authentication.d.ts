type Authentication = {
  isInitialising: boolean;
  isInitialised: boolean;
  isLoggedIn: boolean;
  isSubmitting: boolean;
  token?: TokenEntity;
  user: UserAuthenticationEntity;
  persist: Persist;
};

type UserAuthenticationEntity = {};
