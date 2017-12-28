// import { DEBUG } from '../../../config/app.config'

// Interfaces
import { RouteData } from './interfaces/routes'

// // Debug
// let debug = require('debug')('vs:RouterLogic')
// DEBUG.instance && debug('Instantiate RouterLogic')

/**
 * <!> RouterStateLogic and AppStateLogic are stateful services.
 *     All other services are written as pure functions, and they don't store state.
 * TODO update comment
 */

/** 
 * Update the router outlet dom node with data from the routes
 * <!>WARNING<!> Think twice before changing anything here, this method is called in all container components
 */
export function updateRouterOutlet(routerOutlet: HTMLElement, routeData: RouteData, defaultCmp?: string) {
    // if (DEBUG.route && DEBUG.verbose) debug('Update router outlet. Outlet, data', [routerOutlet, routeData])

    if (routeData === undefined) {
        
        // Do not replace the previous default in case it already exists
        let prevDefaultCmp: HTMLElement = routerOutlet.querySelector(defaultCmp)
        if (prevDefaultCmp) {return}

        // Render a default component if no children component is defined in the routes (undeifned routerData)
        // If no children and no default, reset router outlet to empty
        // This happens when a child route navigates to a parent route
        routerOutlet.innerHTML = defaultCmp ? `<${defaultCmp}></${defaultCmp}>` : ''
        // if ( defaultCmp && DEBUG.route) debug('No child defined in route. Using default', defaultCmp)
        return
    }

    // Look for existing child component
    let {component} = routeData,
        childCmp: HTMLElement = routerOutlet.querySelector(component)
    // if (DEBUG.route && DEBUG.verbose) debug('Child component', childCmp)
            
    // // Component is not registered
    // let isRegistered: boolean = document.createElement(component).constructor !== HTMLElement
    // if (isRegistered === false) {
    //     console.warn('Unable to render route. Child component is not registered.')
    //     return
    // }

    // Replace with new child component
    if (!childCmp || childCmp === null) {
        routerOutlet.innerHTML = `<${component}></${component}>`
        // DEBUG.route && debug('Replace route outlet child with', component)
    }

}

/** Reads the title of the last component in the tree structure */
export function getRouteTitle(_routeData: RouteData) {
    console.warn('Implement getRouteTitle()')
    return 'Test title'
}

/** 
 * Router outlet listen, stage 2, react to data 
 * <!> Can^t use JSON parse stringify on routes (they have circular refs)
 *     This means this mehod can't be implemented as a map
 */
export function addIdsToRouteData(routeData: RouteData): void {
    recursiveAddId(routeData)

    function recursiveAddId (routeData:RouteData) {   
        routeData.children && routeData.children.forEach(_routeData => {
            _routeData.outletId = routeData.component
            recursiveAddId(_routeData)
        })
    }

    // if (DEBUG.map && DEBUG.verbose) debug('Map. Add ids to route data', routeData)

}