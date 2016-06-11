// global
if (document.location.hostname && document.location.hostname=='localhost') {
	var URL_BASE 			= 'proxy.php?url=http://www.mallitalia.eu';
} else {
	var URL_BASE 			= 'http://www.mallitalia.eu';
}
var GCM_SENDER_ID			= '542899398561'; // android
var IOS_SENDER_ID			= '542899398561'; // ios

var MAP_ZOOM					= '14';
var SIDBAR_MAP_DEFAULT_ZOOM		= '3';

/* STIOFAN'S CONSTANTS START */

// MAIN CONSTANTS
var MAIN_TITLE_TEXT 				= '#FFFFFF'; // Top title color such as, page names, category names and post names.
var MAIN_NAV_TEXT 					= '#FFFFFF'; // Top navigation text color such as <Back,Map, About etc...
var MAIN_SORT_TEXT 					= '#007bff'; // Sort option text color, rating,comment, nearest
var MAIN_BUTTON_TEXT 				= '#007bff'; // Button colors such as, add new, add review, share, report this etc...
var MAIN_SORT_BORDER 				= '#007bff'; // Border color of sort options

// CATEGORY 
var CATEGORY_BG		 				= '#04d3ec'; // Background color of the categories
var CATEGORY_BORDER		 			= '#FFFFFF'; // Border color of the categories
var CATEGORY_TITLE_TEXT			 	= '#333333'; // Categories title color
var CATEGORY_COUNT_TEXT		 		= '#000000'; // Categories count text color

// LISTINGS
var LISTING_BG		 				= '#04d3ec'; // Background color of the listings
var LISTING_BORDER		 			= '#FFFFFF'; // Border color of the listings
var LISTING_BG_FEATURED		 		= '#2ad'; // Background color of the featured listings
var LISTING_TITLE_TEXT			 	= '#000'; 	 // Post title color
var LISTING_MAIN_TEXT		 		= '#000'; 	 // Post text color
var LISTING_RCOUNT_TEXT		 		= '#000000'; // Rating count text color
var LISTING_RCOUNT_BG		 		= '#FFFFFF'; // Rating background color
var LISTING_ACTION_BUTTON_BG		= '#04d3ec'; // Listings action buttons add review, report this, etc background.
var LISTING_SEARCH_BG_COLOR			= '#fff';	 // Listing search edit field background-color

// DETAILS
var DETAILS_BG		 				= '#FFFFFF'; // Background color of the details page
var DETAILS_BORDER		 			= '#435294'; // Border color of the details
var DETAILS_TITLE_TEXT			 	= '#435294'; // Post title color
var DETAILS_MAIN_TEXT		 		= '#333333'; // Post text color
var DETAILS_MORE_INFO_BG_COLOR		= '#95eef9'; // Details page more info like email, fb, twitter info
var DETAILS_MORE_INFO_BORDER_COLOR	= '#FFFFFF'; // Details page more info like email, fb, twitter etc. border color
 
// REVIEWS
var REVIEWS_BG		 				= '#FFFFFF'; // Background color of the review
var REVIEWS_BORDER		 			= '#FFFFFF'; // Border color of the review
var REVIEWS_TITLE_TEXT			 	= '#000'; // Review title color
var REVIEWS_MAIN_TEXT		 		= '#000'; // Review text color
var REVIEWS_MORE_TEXT		 		= '#000'; // Review more text color

// HOME PAGE
var H_BG_MAIN 						= '#1B5679'; // Home page background
var H_BG_TOP						= '#3366CC'; // Top page background
var H_TOP_BORDER					= '#045893'; // Top page border //completed till here
var H_BTN_FAV_BG					= '#04d3ec'; // Favourites button background color
var H_BTN_FAV_TEXT					= '#FFFFFF'; // Favourites button text color
var H_BTN_PLA_BG					= '#01a71d'; // Places button background color
var H_BTN_PLA_TEXT					= '#01b620'; // Places button text color
var H_BTN_EVE_BG					= '#fc0202'; // Events button background color
var H_BTN_EVE_TEXT					= '#ff0901'; // Events button text color
var H_BTN_BLO_BG					= '#04d3ec'; // Blog button background color
var H_BTN_BLO_TEXT					= '#FFFFFF'; // Blog button text color
var H_BTN_LOC_BG					= '#01a71d'; // Location button background color
var H_BTN_LOC_TEXT					= '#01b620'; // Location button text color
var H_BTN_ACC_BG					= '#fc0202'; // Account Settings button background color
var H_BTN_ACC_TEXT					= '#ff0901'; // Account Settings text color

// ABOUT PAGE
var A_BG_MAIN 						= '#FFFFFF'; // About page background
var A_BG_TOP						= '#3366CC'; // Top page background
var A_TOP_BORDER					= '#435294'; // Top page border

// FAVOURITES PAGE
var F_BG_MAIN 						= '#95eef9'; // Favourites page background, var coming from H_BG_MAIN
var F_BG_TOP						= '#3366CC'; // Top page background
var F_TOP_BORDER					= '#435294'; // Top page border

// PLACES PAGE
var P_BG_MAIN 						= '#FFFFFF'; // Page background, coming from var H_BG_MAIN
var P_BG_TOP						= '#3366CC'; // Top page background
var P_TOP_BORDER					= '#435294'; // Top page border

// EVENTS PAGE
var E_BG_MAIN 						= '#FFFFFF'; // Page background, coming from var H_BG_MAIN
var E_BG_TOP						= '#3366CC'; // Top page background
var E_TOP_BORDER					= '#435294'; // Top page border

// BLOG PAGE
var B_BG_MAIN 						= '#95eef9'; // Page background, coming from var H_BG_MAIN
var B_BG_TOP						= '#3366CC'; // Top page background
var B_TOP_BORDER					= '#435294'; // Top page border

// LOCATIONS PAGE
var L_BG_MAIN 						= '#95eef9'; // Page background, coming from var H_BG_MAIN
var L_BG_TOP						= '#3366CC'; // Top page background
var L_TOP_BORDER					= '#435294'; // Top page border

// ACCOUNT SETTINGS PAGE
var AS_BG_MAIN 						= '#95eef9'; // Page background, coming from var H_BG_MAIN
var AS_BG_TOP						= '#3366CC'; // Top page background
var AS_TOP_BORDER					= '#435294'; // Top page border


/* STIOFAN'S CONSTANTS END */

var MAP_BG_COLOR 				= '#B3D1FF';
var BTN_TXT_COLOR				= '#007bff';
var MSG_HEAD_BG_COLOR 			= '#3366CC';
var MSG_HEAD_THT_COLOR 			= '#435294';
var CITYLIST_BG_COLOR			= '#04d3ec';
var MAIN_BG_COLOR 				= '#FFFFFF';
var FILTER_BOX_BG_COLOR			= '#04d3ec';
var SEARCH_BG_COLOR				= '#04d3ec';
var SEARCH_TEXT_COLOR			= '#007bff';
var SORT_BG_COLOR				= '#04d3ec';
var SORT_BORDER_COLOR			= '#FFFFFF';
var ADD_NEW_BG_COLOR			= '#04d3ec';
var BG_TOP_BORDER				= '#435294';

// titles
var TITLE_ABOUT 		= 'About';
var TITLE_ACCOUNT		= 'Account';
var TITLE_ADD_COMMENT	= 'Inserisci Commento';
var TITLE_ADD_NEW		= 'Inserisci Nuovo';
var TITLE_ADD_LISTING	= 'Inserisci Azienda';
var TITLE_ADD_REVIEW	= 'Inserisci recensione';
var TITLE_APP_NAME		= 'MallItalia';
var TITLE_ALL 			= 'Tutti';
var TITLE_BACK 			= 'Indietro';
var TITLE_BLOG			= 'Gioca con Noi';
var TITLE_CHOOSE_REASON	= 'Per favore scegli la ragione'
var TITLE_CLOSE 		= 'Chiudi';
var TITLE_COMMENT		= 'Recensioni';
var TITLE_CURRENT		= 'Corrente';
var TITLE_DONE			= 'Fatto';
var TITLE_EVENTS		= 'Promozioni';
var TITLE_EMAIL			= 'Email';
var TITLE_FB_CONNECT	= 'Accedi con Facebook';
var TITLE_FAVOURITES	= 'Preferiti';
var TITLE_FAV_ADD 		= 'Aggiungi ai Preferiti';
var TITLE_FAV_REMOVE	= 'Rimuovi dai Preferiti';
var TITLE_IMG_GALLERY	= 'VETRINA AZIENDALE';
var TITLE_PLACE_DESC	= 'Descrizione Azienda';
var TITLE_LOCATION		= 'Location';
var TITLE_LOGIN_ERROR	= 'Login Error';
var TITLE_MAP			= 'Mappa';
var TITLE_NAME			= 'Nome';
var TITLE_NEAREST		= 'Più Vicino';
var TITLE_OK 			= 'OK';
var TITLE_OPEN 			= 'Apri';
var TITLE_CANCEL 		= 'Cancella';
var TITLE_PASSWORD		= 'Password';
var TITLE_PASSWORD_REPEAT= 'Ripeti password';
var TITLE_PLACES		= 'Cerca Azienda';
var TITLE_POST_COMMENT	= 'Post Comment';
var TITLE_RATING		= 'Voti';
var TITLE_REGISTER 		= 'Registrati';
var TITLE_REPORT		= 'Segnala';
var TITLE_REPORT_THIS	= 'Segnala Inappropriato?';
var TITLE_SEARCH		= 'Cerca';
var TITLE_SHARE 		= 'Condividi';
var TITLE_SPECIAL_OFFERS= 'Domanda del Giorno';
var TITLE_SUBMIT 		= 'Invia';
var TITLE_SIGNIN 		= 'Accedi';
var TITLE_LOGOUT		= 'Logout';
var TITLE_SIGNUP 		= 'Registrati';
var TITLE_SIGNUP_ERROR	= 'Errore Registrazione';
var TITLE_TIME 			= 'Time';
var TITLE_VERSION 		= 'Versione';
var TITLE_LOADMORE 		= 'Carica Altro';
var TITLE_MORE 			= 'Più...';
var TITLE_MESSAGE		= 'Messaggio';
var TITLE_PAYNOW		= 'Paga Adesso';

// messages
var MSG_APPVERSION		= 'MallItalia v2.0';
var MSG_NO_DATA			= 'Nessun risultato trovato, per favore prova di nuovo la ricerca.';
var MSG_NO_COMMENT		= 'Nessuna recensione trovata, metti una recensione per primo';
var MSG_LOADING 		= 'Caricamento...';
var MSG_EMPTY_COMMENT	= 'Per favore, inserisci un commento!';
var MSG_EMPTY_REASON	= 'Per favore scegli la ragione!';
var MSG_ENTEREMAIL		= 'Per favore inserisci l\'email';
var MSG_VALIDEMAIL		= 'Per favore inserisci un indirizzo email valido';
var MSG_ENTERNAME		= 'Per favore inserisci il nome';
var MSG_ENTERPASS		= 'Per favore inserisci la password';
var MSG_PASSINCORRECT	= 'La Passwords non è uguale';
var MSG_AUTHFAILD		= 'Si prega di verificare che si sta scrivendo in modo corretto il nome utente e la password. Se il problema persiste, si prega di contattare il supporto a info@mallitalia.eu o visitare http://www.mallitalia.eu/ nel tuo browser per reimpostare la password.';
var MSG_FB_AUTHFAILD	= 'Non si riesce ad effettuare il login con account facebook, riprova!';
var MSG_BROKENCONNECTION= 'Connessione a Internet non disponibile. Alcune funzioni di questa applicazione non saranno disponibili.';
var MSG_LOGINOK			= 'Sei logato come: ';
var MSG_LOGINTOACCESS	= 'Effettua il login / registrazione per accedere a questa funzione.';

// description
var TEXT_APPDESC		= 'Mall Italia e l\'applicazione che ti aiuta a trovare le aziende e le promozioni della tua città';

var MAIN_MENU = [
	{
		id		: 'location',
		title	: TITLE_LOCATION,
		filter_menu	: true,
		right_btn : {
			id		: 'location',
			title	: TITLE_NEAREST,
		}
	},{
		id		: 'places',
		title	: TITLE_PLACES,
		filter_menu	: false,
		categs	: true,
		right_btn : {
			id		: 'places_map',
			map		: true,
			title	: TITLE_MAP,
		}
	},{
		id		: 'events',
		title	: TITLE_EVENTS,
		filter_menu	: false,
		categs	: true,
		right_btn : {
			id		: 'events_map',
			map		: true,
			title	: TITLE_MAP,
		}
	},{
		id		: 'blog',
		title	: TITLE_BLOG,
		filter_menu	: false,
		categs	: true,
		right_btn : {}
	},{
		id		: 'favourites',
		title	: TITLE_FAVOURITES,
		filter_menu	: true,
		right_btn : {
			id		: 'favourites_map',
			map		: true,
			title	: TITLE_MAP,
		}
	},{
		id		: 'account',
		title	: TITLE_ACCOUNT,
		filter_menu	: false,
		right_btn : {}
	}
];
