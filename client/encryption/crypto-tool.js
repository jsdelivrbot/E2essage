/**
 * Created by sergiuu on 20.06.2017.
 */


import * as openpgp from "react-native-openpgp";

export const CryptoTool = {
	encrypt(text, publicKey) {
		const options = {
			data: text,
			publicKeys: openpgp.readArmoredKey(publicKey).keys
		};
		return openpgp.encrypt(options)
	},
	decrypt(text, privateKey) {
		const privateKeyObj = openpgp.readArmoredKey(privateKey).keys[0];
		privateKeyObj.decrypt('no idea');
		const options = {
			message: openpgp.readMessage(text),
			privateKey: privateKeyObj,
		};
		return openpgp.decrypt(options)
	}
};