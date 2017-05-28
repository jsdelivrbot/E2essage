import {createStore} from "redux";


export function createStoreWithActions(initialState, actionsObject) {
	return createStore(function (state = initialState, action) {
		const operation = actionsObject[action.type];
		return operation ? operation(state, action) : state;
	});
}