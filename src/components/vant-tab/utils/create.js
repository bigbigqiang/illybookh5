/* eslint-disable */
/**
 * Create a component with common options
 */
import createBasic from './create-basic';

export default function(sfc) {
  sfc.components = Object.assign(sfc.components || {}, {
  });
  return createBasic(sfc);
};
