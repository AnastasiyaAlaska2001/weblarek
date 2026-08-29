import { ILotCategory } from '../types';

const API_URL = `https://larek-api.nomoreparties.co/api/weblarek`;
const CDN_URL = `https://larek-api.nomoreparties.co/content/weblarek`;

const settings = {};

const CATEGOTY_MAP: Record<ILotCategory, string> = {
	'софт-скил': 'soft',
	'другое': 'other',
	'дополнительное': 'additional',
	'кнопка': 'button',
	'хард-скил': 'hard',
};

export { API_URL, CDN_URL, CATEGOTY_MAP, settings };
