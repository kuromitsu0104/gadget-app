import firebaseApp from "@/plugins/firebase"
import Cookies from 'js-cookie'

export const state = () => ({
  ///////////////////////////////////////////////////////////////////////////////////
  // FirebaseAuthentication（外部API）に保存されたユーザー情報
  ///////////////////////////////////////////////////////////////////////////////////
  user: null,

  ///////////////////////////////////////////////////////////////////////////////////
  // APIサーバーに保存されたユーザー情報
  ///////////////////////////////////////////////////////////////////////////////////
  data: null,

  ///////////////////////////////////////////////////////////////////////////////////
  // ユーザー一覧表示 / Searchページで使用中
  ///////////////////////////////////////////////////////////////////////////////////
  users: {}
})

export const getters = {

  uid(state) {
    if (state.user && state.user.uid) return state.user.uid
    else return null
  },

  user(state) {
    return state.user
  },

  isAuthenticated(state) {
    return !!state.user && !!state.user.uid
  },

  data(state) {
    return state.data
  },

  users(state) {
    return state.users
  }
}

export const actions = {

  async login({ dispatch }, user) {
    const token = await firebaseApp.auth().currentUser.getIdToken(true)
    const userInfo = {
      email: user.email,
      uid: user.uid
    }

    Cookies.set('access_token', token)
    await dispatch('setUser', userInfo)
    await dispatch('loadData', userInfo.uid)
  },

  async guestLogin({ dispatch }) {
    // ユーザーが故意にCookieを削除した場合の例外対策
    // 前回ログインしていたFirebaseAuthenticationのログイン情報をブラウザから削除
    firebaseApp.auth().signOut()

    const userInfo = {
      email: process.env.GUEST_EMAIL,
      uid: process.env.GUEST_UID
    }

    await dispatch('setUser', userInfo)
    await dispatch('loadData', userInfo.uid)
  },

  async logout({ commit, state }) {
    if (state.data.guest == false) {
      await firebaseApp.auth().signOut()
    }

    Cookies.remove('access_token');
    commit('setUser', null)
    commit('setData', null)
  },

  setUser({commit}, user) {
    commit('setUser', user)
  },

  async loadData ({ commit }, payload) {
    try {
      const baseUrl = process.client ? process.env.BROWSER_BASE_URL : process.env.API_BASE_URL
      const data = await this.$axios.$get(baseUrl + `/v1/users?uid=${payload}`)
      commit('setData', data)
    } catch (e) {
      console.log(e)
    }
  },
  
  ///////////////////////////////////////////////////////////////////////////////////
  // ユーザー一覧ページ用 / Searchページで使用中
  ///////////////////////////////////////////////////////////////////////////////////
  setUsers ({ commit, rootState }, users) {
    // isFollowedプロパティの追加
    users.forEach(user => {
      user.isFollowed = false
      if (rootState.modules.user.data) {
        user.following.forEach(f => {
          if (f.id === rootState.modules.user.data.id) {
            user.isFollowed = true
          }
        })
      }
    })
  },

  setAdmin ({ commit }, payload) {
    commit('setAdmin', payload)
  }
}

export const mutations = {

  setUser (state, user) {
    state.user = user
  },
  
  setData (state, payload) {
    state.data = payload
  },

  setAdmin (state, payload) {
    state.data.admin = payload
  },

  setGodmode (state, payload) {
    state.data.godmode = payload
  }
}
