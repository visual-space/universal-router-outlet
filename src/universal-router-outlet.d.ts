
/**
 * The rotuer resolved a tree strcutre of routes
 * This strcutre is later used by the router outlets to updated the app layout.
 * 
 * <!> When a route returns data it is considered resolved by the universal router.
 *     Using async and await we are able to retrieve an entire tree of nested web components from top to bottom.
 * <!> No template or data processing in the routes, just data retrieval.
 * <!> The routeData for each path level ends up in a nested set of routeData objetcs.
 *     The nested routes are cached in routeState.
 */
export interface RouteData {

    // Title of the document
    title: string

    // The components used to represent the route
    // <!> Instead of nesting the components like the universal router suggest they are stored in this property
    //     This is done in order to accomodate for web components. 
    //     A mechanism that updates the rotues without loogins the DOM references (overwriting DOM) is needed.
    //     In react the virtual dom already does the job of figuring out how to update the DOM.
    component: string

    // The id of the rotuer outlet that will host this component
    // <!> Id matching is done automatically via parent tag name unless the route and the outlet define a custom id.
    //     This would be expecially useful for defining multiple outlets per host component
    outletId?: string

    // Optional data associated with a certain route
    data?: any

    // Route contetxt // TYPE
    context: any

    // Route params // TYPE
    params: any

    // Usually only one child per route level
    children?: RouteData[]
}

declare module 'universal-router-outlet' {
    export function updateRouterOutlet(routerOutlet: HTMLElement, routeData: RouteData, defaultCmp?: string): void
    export function getRouteTitle(routeData: RouteData): void
    export function setRouteData(routeData: RouteData): void
    export function getRouteData(outletId: string): RouteData 
}