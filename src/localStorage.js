const KEY = 'polymer-pwa-local-storage-key';

export const saveState = (state) => {
    let json = localStorage.getItem(KEY) || '{}';
    let stringifiedNewState = JSON.stringify(state);

    if (stringifiedNewState !== json && stringifiedNewState !== '{}') {
        localStorage.setItem(KEY, stringifiedNewState);
    }
};

export const loadState = () => {
    let json;

    // Don't load the state in testing mode.
    if (window.location.hash !== '#test') {
        json = localStorage.getItem(KEY) || '{}';
    } else {
        json = '{}';
    }

    let state = JSON.parse(json);

    if (state) {
        return state;
    } else {
        return undefined;
    }
};