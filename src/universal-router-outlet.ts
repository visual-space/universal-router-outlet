// import { DEBUG } from '../../../../config/app.config'

// Services
import { updateRouterOutlet, getRouteTitle } from './router.logic'
import { getRouteData, setRouteData } from './router.state'

// Interfaces
import { RouteData } from './interfaces/routes';

// Debug
// let debug = require('debug')('vs:RouterOutlet')
// DEBUG.instance && debug('Instantiate RouterOutlet')

/** 
 * Renders the children of a route
 * 
 * <!> Stage 1 - Init
 *     At init it looks for the routes descriptors in the global scope (window._routeData).
 *     Each router outlet reads and removes the first decsriptor of the aray.
 *     After all components are inited all of them are consumed.
 *     This setup is totally dependent on the firing order of the events.
 *     Due to the initilisation order of the components, the event listeners will always fire in the natural order of the routes.
 *     No need for any complicated matching via id or tag name. Ids are used only for multiple router outlets per host.
 * 
 * <!> Stage 2 - Listen (react)
 *     When the router updates a custom event is dispatched.
 *     A new route navigation event triggers a new cycle. Route descriptors are generated and consumed again.
 *     This time the router outlets have updated via event listeners (reactive).
 *     Multiple components can listen to the events before the router outlet consumes it
 * 
 * This behavior is similar to behavior subject in rxjs (has initial value and it also fires events)
 * Previously, each route was passing the descriptiors down bellow minus the one it had consumed via setter methods.
 * <!> Because state store inihibits any mutations the global scope was preffered (less code).
 *     Also the route descriptors have methods attached to them. The state store keeps only pure data (can be stringified).
 */
class RouterOutlet extends HTMLElement {

    // <!> Used to match an arbitrary route to an arbitrary outlet
    //     Optionally defined at runtime as an attribute for the router outlet
    // REFACTOR This will fail if the router is not direct child. There is no unique property for the containers.
    outletid: string = this.parentElement.nodeName.toLocaleLowerCase()

    // <!> Optionally defined at runtime from the parent component
    //     If no routes are defined for this outlet than a default component will be rendered
    //     If no route and no default component are defined then nothing happens
    default: string 

    // Data retrieved from the route automatically or via id
    routeData: RouteData

    constructor() {
        super()
        // DEBUG.constr && debug('Construct RouterOutlet')
    }
    
    connectedCallback() {
        // DEBUG.connect && debug('Connect RouterOutlet', this.outletid, this.default)
        
        // Init. Don't update if routes have not been resolved yet
        this.routeData = getRouteData(this.outletid)
        this.routeData && updateRouterOutlet( this, this.routeData, this.default )

        // Listen
        document.addEventListener('RouteResolved', this.handleRouteResolve )
    }

    disconnectedCallback(){
        // DEBUG.connect && debug('Disconnect RouterOutlet')
        document.removeEventListener('RouteResolved', this.handleRouteResolve )
    }

    handleRouteResolve = () => {
        // DEBUG.route && debug('Route resolved', this.outletid)
        this.routeData = getRouteData(this.outletid)
        updateRouterOutlet( this, this.routeData, this.default )
    }
    
    static get observedAttributes() {
        return ['outletid', 'default']
    }

    attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
        // if (DEBUG.input && DEBUG.verbose) debug('Attribute', name, oldValue, newValue)
        ;(<any>this)[name] = newValue
    }

}

// Component
window.customElements.define('router-outlet', RouterOutlet)

module.exports = {
    RouterOutlet,
    getRouteData,
    setRouteData,
    getRouteTitle,
    updateRouterOutlet,
}