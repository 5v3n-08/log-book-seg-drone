interface AuthUser {
  email: string
}

export const useAuthUser = () => {
  const authUser = useState<AuthUser | undefined>('user', () => undefined)

  const setAuthUser = (user: AuthUser) => (authUser.value = user)

  return { authUser, setAuthUser }
}
