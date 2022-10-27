class EventHandler {
    static eventsCallback = [];

    /**
     * This function rise an event and all the registered callbacks are called.
     * @param event the event which has to fire
     * @param data optional data to return to the callback
     */
    static fireEvent(event, data) {
        this.eventsCallback.forEach((e) => {
            if(e.type === event){
                e.cb(data);
            }
        });
    }

    /**
     * Register a new callback for a specific event
     * @param type event
     * @param cb callback function
     */
    static registerForEvent(type, cb) {
        this.eventsCallback.push({type: type, cb: cb});
    }
}


/**
 * Enum of possible event type (to avoid typos)
 * @type {{onNewFile: string, onAppStateChange: string, onPdfReaderError: string}}
 */
const PDFLEvents = {
    onNewFile: 'onNewFile',
    onAppStateChange: 'onAppStateChange',
    onPdfReaderError: 'onPdfReaderError'
}

export {PDFLEvents, EventHandler};




