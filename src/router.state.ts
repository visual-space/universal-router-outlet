
// import { DEBUG } from '../../../config/app.config'

// Interfaces
import { RouteData } from './interfaces/routes'

// Services
import { addIdsToRouteData } from './router.logic'

/**
 * <!> RouterState and AppStateLogic are stateful services.
 *     All other services are written as pure functions, and they don't store state.
 */

// // Debug
// let debug = require('debug')('vs:RouterState')
// DEBUG.instance && debug('Instantiate RouterState')

/** Router outlet listen, stage 2, react to data */
export function setRouteData(_routeData: RouteData[]) {
    // if (DEBUG.data && DEBUG.verbose) debug('Set router state', _routeData)
    
    // Dummy root route node with children route nodes array used to kickstart the recursion
    routeData = <RouteData>{
        component: 'body',
        children: _routeData
    }

    // Add ids
    addIdsToRouteData(routeData)

    // Event
    let event: CustomEvent = new CustomEvent(`RouteResolved`, { detail: routeData })
    document.dispatchEvent(event)
}

/** Router outlet init, stage 1, get data */
export function getRouteData(outletId: string): RouteData {
    let node: RouteData,
        data: RouteData,
        stack: RouteData[] = []

    // Don't return anything if a router outlet is defined before the routes are resolved
    if (!routeData) return

    stack.push(routeData);
    
    while (stack.length > 0) {
        node = stack.pop()
        if (node.outletId === outletId) {
            data = node
            break // Found it!
        }
        else if (node.children && node.children.length) stack.push(...node.children)
    }

    // if (DEBUG.data && DEBUG.verbose) debug('Get route data', outletId, [node])
    return data
}

/**
 * Each time a route is resolved the retrieved array is stored here
 * From here the components consume and remove the data assigned to each route level
 */
let routeData: RouteData