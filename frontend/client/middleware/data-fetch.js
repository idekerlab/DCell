import { match } from 'react-router';
import { UPDATE_LOCATION } from 'react-router-redux';
import { loading, updateData } from 'actions/common';


export default routes => store => next => {

  function updateDataFromAPI(location) {

    match({ routes, location }, (error, redirectLocation, renderProps) => {
      if (error || redirectLocation) {
        return;
      }

      const route = renderProps.routes[renderProps.routes.length - 1];
      if (route.fetchAPI) {
        // Call API if it's available
        api(renderProps.params, renderProps.location.query, data => {
          store.dispatch(updateData(data));
          store.dispatch(loading(false));
        });
      } else {
        Promise.resolve(loading(false)).then(store.dispatch);
      }
    });
  }
  // Return core middleware function
  return action => {
    // Fetch data on update location
    if (action.type === LOCATION_CHANGE) {
      next(loading(true));
      updateDataFromAPI(action.payload);
    }
    return next(action);
  };
}
