import { tryCatchAsync } from '~/services/utils/utils.helper'

export default defineNuxtPlugin(async (ctx) => {
  const { $client } = useNuxtApp()
  const { name } = useRoute()
  const { setAuthUser } = useAuthUser()

  if (name !== 'login') {
    const { result } = await tryCatchAsync(async () => $client.user.current.query())
    if (result) {
      setAuthUser({ email: result.email })
    }
  }
})
