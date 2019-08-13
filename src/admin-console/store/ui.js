import * as types from './ui-mutation-types'

/**
 * UI store for controlling the global state of UI components.
 */
export const state = () => ({
  sideMenuOpen: false,
  currentView: 'HOME'
})

export const actions = {
  toggleSideMenu ({ commit, state }) {
    commit(types.TOGGLE_SIDE_MENU)
  },
  changeView ({commit}, view) {
    commit(types.CHANGE_VIEW, view)
  }
}

export const mutations = {
  [types.TOGGLE_SIDE_MENU] (state) {
    state.sideMenuOpen = !state.sideMenuOpen
  },
  [types.CHANGE_VIEW] (state, view) {
    state.currentView = view
  }
}

export const getters = {
  getSideMenuOpen: state => state.sideMenuOpen,
  getCurrentView: state => state.currentView
}
