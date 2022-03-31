import { createAction } from 'redux-act';
import { schema } from 'normalizr';
import snakeCase from 'lodash/snakeCase';
import pluralize from 'pluralize';

import Resource from './Resource';

/**
 * This class handles the creation of schema's for Redux normalizr
 * so that we can easily created nested schema's and call according
 * normalising actions and saving actions.
 *
 * @class Entity
 */
class Entity extends Resource {
  constructor() {
    super();

    // Create the entity modification actions
    const { name } = this.constructor;
    this.repopulate = createAction(
      `${snakeCase(name).toUpperCase()}_REPOPULATE`
    );
    this.add = createAction(`${snakeCase(name).toUpperCase()}_ADD`);
    this.remove = createAction(`${snakeCase(name).toUpperCase()}_REMOVE`);

    // Create an empty related entities list
    this.relatedEntities = {
      [snakeCase(name)]: this,
    };

    // Create the schema
    this.schema = this.createSchema();
  }

  createSchema() {
    // Get all relations that were defined in the child class
    const classNames = Object.getOwnPropertyNames(
      Object.getPrototypeOf(this)
    ).filter((filteredName) => filteredName !== 'constructor');

    // Create the schema based on the relations
    const name = snakeCase(this.constructor.name);

    return new schema.Entity(
      name,
      classNames.reduce((sum, method) => {
        // Execute the relation method
        const result = this[method]();

        // Save the entity in the class
        this.relatedEntities[pluralize.singular(method)] = result.entity;

        // Append the result to the sum array
        return { ...sum, [method]: result.schema };
      }, {})
    );
  }

  static hasOne(entity) {
    return {
      entity,
      schema: entity.schema,
    };
  }

  static hasMany(entity) {
    return {
      entity,
      schema: [entity.schema],
    };
  }
}

export default Entity;
