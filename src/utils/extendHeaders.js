Object.defineProperty(Headers.prototype, 'setDefault', {
    value: function (key, defaultValue) {
        if (!this.has(key))
            this.set(key, defaultValue);
    },
});
