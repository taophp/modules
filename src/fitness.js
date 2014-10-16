/**
 * File: Fitness
 *
 * Nick Jennings <nick@silverbucket.net>
 *
 * Version:    - 0.0.2
 *
 * This module stores fitness related data, such as body measurements,
 * excersize activity, etc.
 *
 */

RemoteStorage.defineModule('fitness', function (privateClient, publicClient) {

  var extend = remoteStorage.util.extend;

  // // action
  // var actionProperties = {
  //   "actionStatus": {
  //     "type": "string",
  //     "description": ""
  //   },
  //   "repetitions": {
  //     "type": "string",
  //     "description": ""
  //   },

  // body measurements
  var bodyMeasurementsProperties = {
    "id" : {
      "type": "string",
      "description": "ID is created during creation of record"
    },
    "region": {
      "type": "string",
      "description": "a string defining the measurement group type. e.g. imperial (stone+lbs, ft+inches), metric (kilos, cm) or usa (lbs, ft+inches)"
    },
    "weight": {
      "type": "object",
      "description": "current weight of person in the specified regional unit of measurement",
      "properties": {
        "major": {
          "type": "number",
          "description": "depending on region -- imperial: stone, metric: kilo, usa: n/a"
        },
        "minor": {
          "type": "number",
          "description": "depending on region -- imperial: lbs, metric: n/a, usa: lbs"
        }
      }
    },
    "height": {
      "type": "object",
      "description": "current height of person in the specified regional unit of measurement",
      "properties": {
        "major": {
          "type": "number",
          "description": "depending on region -- imperial: feet, metric: n/a, usa: ft"
        },
        "minor": {
          "type": "number",
          "description": "depending on region -- imperial: inches, metric: cm, usa: inches"
        }
      }
    },
    "chest_size": {
      "type": "number",
      "description": "current circumference of chest (cm, inches)"
    },
    "biceps_size": {
      "type": "number",
      "description": "current circumference of biceps (cm, inches)"
    },
    "stomach_size": {
      "type": "number",
      "description": "current circumference of belly (cm, inches)"
    },
    "waist_size": {
      "type": "number",
      "description": "current circumference of waist (cm, inches)"
    },
    "hip_size": {
      "type": "number",
      "description": "current circumference of hips (cm, inches)"
    },
    "thigh_size": {
      "type": "number",
      "description": "current circumference of thighs (cm, inches)"
    },
    "body_fat_percentage": {
      "type": "number",
      "description": "current body fat percentage"
    },
    "clothing": {
      "type": "object",
      "properties": {
        "pant_size": {
          "type": "number",
          "description": "current pant waist size"
        },
        "dress_size": {
          "type": "number",
          "description": "current dress size"
        }
      }
    },
    "date_added": {
      "type": "number",
      "description": "date measurements were added"
    },
    "date_updated": {
      "type": "number",
      "description": "date measurements were updated"
    },
    "@context": {
      "type": "string",
      "format": "uri"
    }
  };


  privateClient.declareType('body-measurement', {
    "key": "id",
    "type": "object",
    "required": ["id", "region", "date_added", "date_updated", "@context"],
    "additionalProperties": false,
    "properties": bodyMeasurementsProperties
  });


  var fitness = {

    on: privateClient.on.bind(privateClient),

    /**
     * Function: remove
     *
     * Remove the record, as specified by ID.
     *
     * Parameters:
     *
     *   id - ID of record to remove
     *
     * Returns:
     *
     *   return a promise which is resolved upon successful deletion of record.
     */
    remove: function (id) {
      if (typeof id !== 'string') {
        return Promise.reject('require param \'id\' not specified');
      }
      return privateClient.remove(id);
    },

    /**
     * Function: add
     *
     * Add a new record of the specified type.
     *
     * Parameters:
     *
     *   type - the type of record being added. (defaults to 'body-measurement')
     *   obj  - the JSON object to use
     *
     * Returns:
     *
     *   return a promise which is resolved with the saved object upon completion
     *          (with fields `id` and `date_created` etc.)
     */
    add: function (type, obj) {
      if (typeof type !== 'string') {
        obj = type;
        type = 'body-measurement';
      }

      obj.id = privateClient.uuid();

      if (!obj.date_added) {
        obj.date_added = new Date().getTime();
      }
      obj.date_updated = new Date().getTime();

      return privateClient.storeObject(type, obj.id, obj).then(function () {
        return obj;
      });
    },

    /**
     * Function: get
     *
     * Get a record by ID
     *
     * Parameters:
     *
     *   id - ID of record to fetch.
     *
     * Returns:
     *
     *   return a promise which is resolved with the desired object if it exists.
     */
    get: function (id) {
      if (typeof id !== 'string') {
        return Promise.reject('require param \'id\' not specified');
      }
      return privateClient.getObject(id);
    },

    getAll: privateClient.getAll.bind(privateClient),

    getListing: privateClient.getListing.bind(privateClient)
  };

  return { exports: fitness };
});
