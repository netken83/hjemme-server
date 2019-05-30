import Actor from '@/classes/actor';
import Vue from "vue";
import CustomField from '@/classes/custom_field';

type RootState = {
  items: Actor[]
}

export default {
  namespaced: true,

  state: {
    items: []
  },
  getters: {
    getAll(state: RootState): Actor[] {
      return state.items;
    },
    getById: (state: RootState) => (id: string): Actor | undefined => {
      return state.items.find(actor => actor.id == id);
    },
    getLabels(state: RootState) {
      return [
        ...new Set(
          (<Actor[]>state.items).reduce(
            (acc: string[], actor) => acc.concat(actor.labels),
            []
          )
        )
      ];
    }
  },
  mutations: {
    set(state: RootState, items: Actor[]) {
      state.items = items;
    },
    add(state: RootState, item: Actor) {
      state.items.push(item);
    },
    addThumbnails(state: RootState, { id, images }: { id: string, images: string[] }) {
      let _index = state.items.findIndex((v: Actor) => v.id == id) as number;

      if (_index >= 0) {
        let actor = state.items[_index] as Actor;
        actor.thumbnails.push(...images);
        Vue.set(state.items, _index, actor);
      }
    },
    setCoverIndex(state: RootState, { id, index }: { id: string, index: number }) {
      let _index = state.items.findIndex((v: Actor) => v.id == id) as number;

      if (_index >= 0) {
        let actor = state.items[_index] as Actor;
        actor.coverIndex = index;
        Vue.set(state.items, _index, actor);
      }
    },
    rate(state: RootState, { id, rating }: { id: string, rating: number }) {
      let _index = state.items.findIndex((v: Actor) => v.id == id) as number;

      if (_index >= 0) {
        let actor = state.items[_index] as Actor;
        actor.rating = actor.rating == rating ? 0 : rating;
        Vue.set(state.items, _index, actor);
      }
    },
    favorite(state: RootState, id: string) {
      let _index = state.items.findIndex((v: Actor) => v.id == id) as number;

      if (_index >= 0) {
        let actor = state.items[_index] as Actor;
        actor.favorite = !actor.favorite;
        Vue.set(state.items, _index, actor);
      }
    },
    bookmark(state: RootState, id: string) {
      let _index = state.items.findIndex((v: Actor) => v.id == id) as number;

      if (_index >= 0) {
        let actor = state.items[_index] as Actor;
        actor.bookmark = !actor.bookmark;
        Vue.set(state.items, _index, actor);
      }
    },
    setLabels(state: RootState, { id, labels }: { id: string, labels: string[] }) {
      let _index = state.items.findIndex((v: Actor) => v.id == id) as number;

      if (_index >= 0) {
        let actor = state.items[_index] as Actor;
        actor.labels = labels;
        Vue.set(state.items, _index, actor);
      }
    },
    addCustomField(state: RootState, customField: CustomField) {
      for (let i = 0; i < state.items.length; i++) {
        let actor = state.items[i] as Actor;
        actor.customFields[customField.name] = null;
        Vue.set(state.items, i, actor);
      }
    }
  },
  actions: {
  },
}