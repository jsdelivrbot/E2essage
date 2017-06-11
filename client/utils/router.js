/**
 * Created by sergiuu on 11.06.2017.
 */
import {MessengerStore} from "./redux-stores";


export const ReduxRouter = {
	go(route) {
		MessengerStore.dispatch({
			type: 'setRoute',
			route
		});
	}
};