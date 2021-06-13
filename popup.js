
$(document).ready(function() {
// begin

var extOptions = {};

var dictionary = {
    
    mainSwitch: {en: 'on/off extension', ru: 'вкл./выкл. расширение'},
    hidePrime: {en: 'hide - "prime" items', ru: 'скрывать - "prime" товары'},
    hideSoldByAmazon: {en: 'hide - sold by amazon', ru: 'скрывать товары амазона'},                     //#31
    hideItemsWithVariation: {en: 'hide - items with variation', ru: 'скрывать товары c вариациями'},    //#33
    onlyCurrentlyUnavailable: {en: 'only - currently unavailable', ru: 'только - нет в наличии'},
    showBuyBox: {en: 'show - BuyBox', ru: 'показывать - BuyBox'},
    buttonSearchOnEbay: {en: 'button - search on ebay', ru: 'кнопка - поиск на ebay'},
    buttonSearchOnEbay_BuyItNow: {en: ' buy it now', ru: ' купить сейчас'},
    buttonSearchOnEbay_ItemLocation_NorthAmerica: {en: ' item location: North America', ru: ' местонахождение: Северная Америка'},
    quickSearchOnEbay: {en: 'quick search on ebay', ru: 'быстрый поиск на ebay'},
    buttonSearchOnWalmart: {en: 'button - search on walmart', ru: 'кнопка - поиск на walmart'},
    showAsin: {en: 'show - asin', ru: 'показывать - asin'},
    getBSR: {en: 'show - best sellers rank', ru: 'показывать - рейтинг товара (BSR)'},
    hideEmptyBSR: {en: ' hide - empty BSR', ru: ' скрыть товары без BSR'},
    maxValBSR: {en: ' hide if BSR less than the value', ru: ' скрывать если BSR больше значения'},
    
    showMargin: {en: '% margin', ru: '% наценки'},
    amazonFee: {en: 'amazon fee: ', ru: 'наценка amazon: '},
    hideDontSold: {en: "hide - don't sold", ru: "скрывать товары без пометки - sold"},
    ebay_only_FastAndFree: {en: "only - fast 'n free", ru: "только с пометкой - fast 'n free"},
    phone: {en: ' - phone', ru: ' - телефон'},
    ebay_MessageToSeller: {en: ' - message', ru: ' - сообщение'},
    ebay_show_QuantityAvailable: {en: 'show - quantity available', ru: 'показывать - количество'},
    ebay_show_Delivery: {en: 'show - delivery', ru: 'показывать - доставку'},
    ebay_show_Returns: {en: 'show - returns', ru: 'показывать - условия возврата'},
    ebay_show_Brand: {en: 'show - brand', ru: 'показывать - бренд'},
    buttonSearchOnAmazon: {en: 'button - search on amazon', ru: 'кнопка - поиск на amazon'},
    ebay_button_DefaultFilters: {en: 'New / Buy It Now / Location / Returns accepted', ru: 'New / Buy It Now / Location / Returns accepted'},
    logoutLink: {en: 'Logout', ru: 'Выйти'},
    
    comment: {en: 'full functionality will be available after login', ru: 'полный функционал будет доступный после авторизации'},

    useCrossBrowserAddressCopying: {en: 'use cross-browser copying of the address', ru: 'использовать кроссбраузерное копирование адреса'},
    
};

const logoutLink = document.querySelector('#logoutLink');

function getExtensionVersion() {
    const manifest = chrome.runtime.getManifest();
    return manifest.version;
}

function updatedFormElements() {

    document.querySelector('#reliz').textContent = `v${getExtensionVersion()}`;

    $('.options.checkbox').each(function(index, elem) {
        const id = $(elem).prop('id');
        let option = extOptions[id];
		if (option === undefined) {
            option = getCheckboxDefaultValueOfOption(id);
		}
        $(elem).prop('checked', option);
        $(elem).prop('disabled', !optionIsAvailabile(id));
	});

	$('.options.number').each(function(index, elem) {
        const id = $(elem).prop('id');
		let option = extOptions[id];
		if (option === undefined) {
            option = getNumberDefaultValueOfOption(id);
		}
        $(elem).prop('value', option);
        $(elem).prop('disabled', !optionIsAvailabile(id));
	});
	
	$('.options.string').each(function(index, elem) {
        const id = $(elem).prop('id');
		let option = extOptions[id];
		if (option === undefined) {
            option = '';
		}
        $(elem).prop('value', option);
        $(elem).prop('disabled', !optionIsAvailabile(id));
	});

    logoutLink.classList.add('hide');

    let authorizedUser = false;
    let authorizationBackGround = '#ffff70';
    let userName = 'Please log in...';
    if (extOptions.display_name || extOptions.user_login) {
        userName = extOptions.display_name ? extOptions.display_name : extOptions.user_login;
        userName += ' / days left: ' + extOptions.days;
        authorizationBackGround = undefined;
        authorizedUser = true;
        logoutLink.classList.remove('hide');
    }
    
    authorizationElem = $('#authorization-href').first();
    $(authorizationElem).text(userName);
    if (authorizationBackGround) {
        $(authorizationElem).css({'background-color': authorizationBackGround});
    }

    // *********************************** language
    
    let language = extOptions.language ? extOptions.language : 'en';
    
    for (let key in dictionary) {
        if (key === 'comment' && authorizedUser) {
            $('#' + key + '-text').text('');
            continue;
        }
        let dictionaryVal = dictionary[key];
        if (dictionaryVal && dictionaryVal[language]) {
            $('#' + key + '-text').text(dictionaryVal[language]);
        }
    }
    
    setAuthorizationHref(); //#25
    
}
    
function setLanguage(language) {
	extOptions.language = language;
    chrome.storage.local.set({'language': language});
}
$('#language-ru').click(function() {
    setLanguage('ru');
});
$('#language-en').click(function() {
    setLanguage('en');
});

function setAuthorizationHref() {
    
    let authorizationHref = 'https://extension.grabley.net/en/profile-en/';
    if (extOptions.language === 'ru') {
        authorizationHref = 'https://extension.grabley.net/profile/';
    }
    $('#authorizationLink').attr('href', authorizationHref);
    
}
    
function getCheckboxDefaultValueOfOption(id) {

//    if (id === "mainSwitch") {
//        let extOption = { };
//        extOption[id] = true;
//        chrome.storage.local.set(extOption, function() {
//            //console.log('Settings saved - id: ' + id + ' val: ' + true);
//        });
//    };
    
    if (   id === "mainSwitch"
        || id === "showAsin"
        || id === "showBuyBox"
        || id === "buttonSearchOnEbay"
        || id === "buttonSearchOnWalmart"
        || id === "getBSR"
        || id === "showMargin"
        || id === "buttonSearchOnAmazon"
        || id === "ebay_button_DefaultFilters"
    ) {
//        var option = { };
//        option[id] = true;
//        chrome.storage.local.set(option, function() {
//            console.log('Settings saved - id: ' + id + ' val: ' + true);
//        });
        return true;
    };
    
    return false;
    
};

function getNumberDefaultValueOfOption(id) {

    if (id === "amazonFee") { return 15; };
    
    return 0;
    
};
    
function optionIsAvailabile(id) {

    if (extOptions.active) {return true;};

    if (id==="mainSwitch" || id==="active"
        || id === "hideItemsWithVariation"              //#33
        || id === "showAsin"
        || id === "showBuyBox"
        || id === "buttonSearchOnEbay" || id === "buttonSearchOnEbay_BuyItNow" || id === "buttonSearchOnEbay_ItemLocation_NorthAmerica"
        || id === "buttonSearchOnWalmart"
        || id === "getBSR"
        || id === "showMargin"
        || id === "amazonFee"
        || id === "ebay_only_FastAndFree"
        || id === "buttonSearchOnAmazon"
        || id === "ebay_button_DefaultFilters"
        || id === "phone"
        || id === "ebay_MessageToSeller"
    ) {return true;};
    
    return false;
    
};
    
chrome.storage.local.get(null, function(extensionOptions) {

    const showLog = false;
    
	for (let optionKey in extensionOptions) {
		extOptions[optionKey] = extensionOptions[optionKey];
	}
    
    if (!extOptions.active) {
        chrome.runtime.sendMessage({command: "pvv-ext-authorization", context: 'popup', addition: 'storage.local.get'});
    }
	
    if (showLog) {
        console.log('extension options - get:');
    }
    
	for (let optionKey in extOptions) {
		const optionValue = extOptions[optionKey];
        if (showLog) {
            console.log('   key: ' + optionKey + ' val: ' + optionValue);
        }
	}
    
    updatedFormElements();
    
});

chrome.storage.onChanged.addListener(function(changes, namespace) {

	for (let optionKey in changes) {
		const optionValue = changes[optionKey].newValue;
		extOptions[optionKey] = optionValue;
	}

    updatedFormElements();
	
});
    
$('.options.checkbox').click(function() {
	const id = $(this).prop('id');
	const checked = $(this).prop('checked');
	const option = { };
	option[id] = checked;
	chrome.storage.local.set(option, function() {
		//console.log('Settings saved - id: ' + id + ' val: ' + checked);
	});
	//console.log(id + ' - ' + checked);
});

$('.options.number').change(function() {
	const id = $(this).prop('id');
	const value = $(this).prop('value');
    //console.log(id + ' - ' + value);
    if (isFinite(value)) {
        const option = { };
	    option[id] = value;
	    chrome.storage.local.set(option, function() {});
    }
});

$('.options.string').change(function() {
    const id = $(this).prop('id');
    const val = $(this).prop('value');
    const option = { };
	option[id] = val;
    chrome.storage.local.set(option);
});


$('#mainSwitch').click(function() {
    chrome.runtime.sendMessage({command: "pvv-ext-authorization", context: 'popup', addition: 'mainSwitch'});
});
logoutLink.addEventListener('click', () => {
    chrome.runtime.sendMessage({command: "pvv-ext-logOut"});
});

// end
});

