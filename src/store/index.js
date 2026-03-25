const listeners = new Set();

let state = {
  albums: [],
  photos: [],
  styleProfiles: [],
  activeProfile: null,
  isInitializing: true,
  error: null
};

export const Store = {
  getState() {
    return state;
  },

  setState(newState) {
    state = { ...state, ...newState };
    listeners.forEach(l => l(state));
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  // Action helpers
  setAlbums(albums) {
    this.setState({ albums });
  },

  setInitializing(isInitializing) {
    this.setState({ isInitializing });
  },

  setError(error) {
    this.setState({ error });
  }
};
