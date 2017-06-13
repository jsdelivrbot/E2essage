/**
 * Created by sergiuu on 13.06.2017.
 */
import dateFormat from 'dateformat';

export function formatMessageDate(date, now) {
	let format;
	if (date.getYear() !== now.getYear()) {
		format = 'dd/mm/yyyy HH:MM'
	} else if (date.getMonth() !== now.getMonth() || date.getDate() !== now.getDate()) {
		format = 'dd/mm HH:MM'
	} else if (date.getHours() !== now.getHours()) {
		format = 'HH:MM'
	} else if (date.getMinutes() !== now.getMinutes()) {
		return `${now.getMinutes() - date.getMinutes()} minutes ago`
	} else {
		return 'now';
	}
	return dateFormat(date, format);
}