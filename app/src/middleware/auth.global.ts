export default defineNuxtRouteMiddleware(async (to) => {
  if (!import.meta.server) {
    const { authUser } = useAuthUser()

    if (to.name === 'login' && authUser.value) return navigateTo({ name: 'user' })
    if (to.name === 'login') return

    if (!authUser.value) return navigateTo({ name: 'login' })
  }
})
