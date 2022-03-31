/* eslint-disable */ 

import { createAction } from 'redux-act';
import { normalize } from 'normalizr';
import snakeCase from 'lodash/snakeCase';
import union from 'lodash/union';
import omit from 'lodash/omit';
import { PURGE } from 'redux-persist';

import fetch from './fetch';

/**
 * This class provides an abstraction for API endpoints,
 * so that we may easily create actions for particular actions.
 *
 * @class Resource
 */

let getClassName = obj => {
    if (obj.constructor.name) {
      return obj.constructor.name;
    }
    const regex = new RegExp(/^\s*function\s*(\S*)\s*\(/);
    getClassName = obj => obj.constructor.toString().match(regex)[1];
    return getClassName(obj);
};

class Resource {
    constructor() {
        this.actions = {};
        this.types = {
            index: 'INDEX',
            store: 'STORE',
            show: 'SHOW',
            update: 'UPDATE',
            destroy: 'DESTROY'
        };
    }

    createAsyncAction(type, asyncAction, config = {}) {

        // Create actions and thunk
        const actions = this.createActions(type);
        const thunk = this.createThunk(type, asyncAction, config);

        return {
            thunk,
            ...actions
        };

    }

    createActions(type) {

        // Convert the PascalCase classname to SCREAM_CASE
        let name = snakeCase(getClassName(this)).toUpperCase();

        // Create all actions
        const actions = {
            request: createAction(`${name}_${type}_REQUEST`),
            success: createAction(`${name}_${type}_SUCCESS`),
            error: createAction(`${name}_${type}_ERROR`)
        };

        // Store actions in class
        this.actions[type] = actions;

        return actions;

    }

    createAction(type) {

        // Convert the PascalCase classname to SCREAM_CASE
        let name = snakeCase(getClassName(this)).toUpperCase();

        const action = createAction(`CUSTOM_${name}_${type}`);

        // Store actions in class
        this.actions[type] = action;

        return action;
    }

    processRelatedEntities(entity, data, type, dispatch) {
        
        // Loop through all entities
        for (let name in data.entities) {

            //only call action when relation is in schema
            if(name in entity.relatedEntities && (data.result != undefined)) {
                // Call the add action on the entity with the data
                if(type && type == this.types.index) {
                    dispatch(entity.relatedEntities[name].repopulate(data.entities[name])); //if we have a index request, we need to repopulate the whole state, instead of just adding the items
                } else {
                    dispatch(entity.relatedEntities[name].add(data.entities[name]));
                }
                
            }
        }

        for (let name in entity.relatedEntities) {
            if(entity != entity.relatedEntities[name]) {
                this.processRelatedEntities(entity.relatedEntities[name], false, data, dispatch);
            }
        }
    }

    createThunk(type, asyncAction, config) {

        // The thunk is the function that will be executed
        return (...args) => {

            // The thunk always contains an async function that is evaluated on the fly
            return async (dispatch, getState) => {

                // Retrieve the fetch function
                let fetchWrapper = await fetch(dispatch, getState);

                // Dispatch the request action
                dispatch(this.actions[type].request());

                // Execute the asyncAction provided
                return asyncAction(...args, fetchWrapper, dispatch, getState)
                    .then(response => {

                        // Normalize the incoming data if relevant
                        var data = null;
                        switch(type) {
                            case this.types.index:
                            case this.types.store:
                            case this.types.show:
                            case this.types.update:
                                data = response.data.length ?
                                    normalize(response.data, [this.schema])
                                    : normalize(response.data, this.schema);
                        }

                        // Dispatch the success action
                        dispatch(this.actions[type].success(response.data));

                        // Call the relevant saving/removing actions for this request
                        switch(type) {
                            case this.types.index:
                            case this.types.show:
                            case this.types.update:
                            case this.types.store:

                                this.processRelatedEntities(this, data, type, dispatch);

                                break;

                            case this.types.destroy:

                                // Call the remove action on itself
                                dispatch(this.remove(args[0]));

                                break;

                        }

                        // Allow hook for accessing a successful dispatch
                        if(config.onSuccess) {
                            config.onSuccess(response.data, dispatch, getState, args);
                        }

                        // Return the data
                        return response.data;

                    })
                    .catch(asyncError => {

                        // Dispatch the error
                        dispatch(this.actions[type].error({
                            error: asyncError,
                            response: asyncError.response,
                            message: config.messages && config.message.error
                        }));

                        // Allow hook for accessing the error handler
                        if(config.onError) {
                            config.onError(asyncError, dispatch, getState);
                        }

                        // Propagate the error so that components that depend on this promise
                        // do not mistakenly assume that everything went right
                        throw asyncError;

                    });

            };

        };
    }

    index(asyncAction, config) {
        return this.createAsyncAction(this.types.index, asyncAction, config);
    }

    store(asyncAction, config) {
        return this.createAsyncAction(this.types.store, asyncAction, config);
    }

    show(asyncAction, config) {
        return this.createAsyncAction(this.types.show, asyncAction, config);
    }

    update(asyncAction, config) {
        return this.createAsyncAction(this.types.update, asyncAction, config);
    }

    destroy(asyncAction, config) {
        return this.createAsyncAction(this.types.destroy, asyncAction, config);
    }

    action(actionType) {
        return this.createAction(actionType);
    }

    parseCustomReducer(action, state) {
        // Check if the actions is a custom user defined one

        if (!action.type.startsWith('CUSTOM')) {
            return state;
        }

        const splitAction = action.type.toLowerCase().split('_');
        const entityName = getClassName(this).toLowerCase();

        if (entityName === splitAction[1]) {

            if (splitAction.length <= 3) {
                const key = splitAction[2];
                return {
                    ...state,
                    [key]: action.payload
                };
            }
            else if (splitAction.length == 4) {
                const parentKey = splitAction[2];
                const key = splitAction[3];
                return {
                    ...state,
                    [parentKey]: {
                        ...state[parentKey],
                        [key]: action.payload
                    }
                };
            }
            else {
                return state;
            }
        }
        else {
            return state;
        }
    }

    createReducer(extraKeys, userReducer) {
        // Assemble a default state for this entity
        // NOTE: When a userreducer is supplied, these keys will need to be
        // added to the default state for this reducer, as else bad stuffs
        // will happen.
        const defaultState = {
            loading: false,
            entities: {
                allIds: [],
                byId: {}
            },
            ...extraKeys
        };

        // Create a wrapper function for referencing actions
        // This will catch all exception where a specific action
        // has not been created yet.
        const getAction = (type, action) => this.actions[type] ? this.actions[type][action].getType() : undefined;

        // Create the reducer for this entity
        const entityReducer = (state = defaultState, action) => {
            
            switch(action.type) {
                case getAction(this.types.index, 'request'):
                case getAction(this.types.store, 'request'):
                case getAction(this.types.show, 'request'):
                case getAction(this.types.update, 'request'):
                case getAction(this.types.destroy, 'request'):
                    return {
                        ...state,
                        loading: true
                    };

                case getAction(this.types.index, 'success'):
                case getAction(this.types.store, 'success'):
                case getAction(this.types.show, 'success'):
                case getAction(this.types.update, 'success'):
                case getAction(this.types.destroy, 'success'):
                case getAction(this.types.index, 'error'):
                case getAction(this.types.store, 'error'):
                case getAction(this.types.show, 'error'):
                case getAction(this.types.update, 'error'):
                case getAction(this.types.destroy, 'error'):
                    return {
                        ...state,
                        loading: false
                    };
                
                //repopulate is for a INDEX call, in this case we do not append the items to the state but reset the state so that deleted items that existed in the state do not persist
                case this.repopulate.getType():
                    return {
                        ...defaultState,
                        entities: {
                            allIds: Object.keys(action.payload),
                            byId: {
                                ...action.payload
                            }
                        }
                    }

                case this.add.getType():
                    return {
                        ...state,
                        entities: {
                            allIds: union(state.entities.allIds, Object.keys(action.payload)),
                            byId: {
                                ...state.entities.byId,
                                ...action.payload
                            }
                        }
                    };

                case this.remove.getType():
                    return {
                        ...state,
                        entities: {
                            allIds: state.entities.allIds.filter(id => id != action.payload),
                            byId: omit(state.entities.byId, action.payload)
                        }
                    };

                case PURGE:
                    return defaultState;

                default:
                    return this.parseCustomReducer(action, state);
            }
        };

        // Return a wrapper for executing either or both of the reducers
        return ((state, action) => {
            return entityReducer(userReducer ? userReducer(state, action) : state, action);
        });
    }

}

export default Resource;
