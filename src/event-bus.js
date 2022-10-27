/**
 * Enum of possible event type (to avoid typos)
 * @type {key: string}
 */
const PDFLEvents = {
    onNewFile: 'onNewFile',
    onAppStateChange: 'onAppStateChange',
    onPdfReaderError: 'onPdfReaderError',
    onRenderRequest: 'onRenderRequest'
}

/**
 * This class represents the event bus across the application, it manages subscribers and publishers for each type of event.
 */
class EventBus {
    static eventObject = [];

    /**
     * This function rise an event and all the registered callbacks are called.
     * @param event the event which has to fire
     * @param args arguments for the callback function
     */
    static fireEvent(event, ...args) {
        console.log(event + "requested");
        if(!this.eventObject[event]){
            return;
        }

        this.eventObject[event].forEach((callback) => {
            callback(...args);
        });
    }

    /**
     * Register a new callback for a specific event
     * @param event
     * @param cb callback function
     */
    static subscribe(event, cb) {
        if(!this.eventObject[event]){
            this.eventObject[event] = [];
        }
        this.eventObject[event].push(cb);
    }
}




export {PDFLEvents, EventBus};




