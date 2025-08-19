/**
 * `deepPopulate` middleware
 */

import type { Core } from '@strapi/strapi';
import { UID } from '@strapi/types';
import { contentTypes } from '@strapi/utils';
import pluralize from 'pluralize';


interface Options {
  /**
   * Fields to select when populating relations
   */
  relationalFields?: string[];
}

const { CREATED_BY_ATTRIBUTE, UPDATED_BY_ATTRIBUTE } = contentTypes.constants;

const extractPathSegment = (url: string) => url.match(/\/([^/?]+)(?:\?|$)/)?.[1] || '';

const getDeepPopulate = (uid: UID.Schema, opts: Options = {}) => {
  try {
    const model = strapi.getModel(uid);
    if (!model || !model.attributes) {
      console.warn(`Model not found or has no attributes for UID: ${uid}`);
      return {};
    }
    const attributes = Object.entries(model.attributes);

  return attributes.reduce((acc: any, [attributeName, attribute]) => {
    switch (attribute.type) {
      case 'relation': {
        const isMorphRelation = attribute.relation.toLowerCase().startsWith('morph');
        if (isMorphRelation) {
          break;
        }

        // Ignore not visible fields other than createdBy and updatedBy
        const isVisible = contentTypes.isVisibleAttribute(model, attributeName);
        const isCreatorField = [CREATED_BY_ATTRIBUTE, UPDATED_BY_ATTRIBUTE].includes(attributeName);

        if (isVisible) {
          if (attributeName === 'testimonials') {
            acc[attributeName] = { populate: "user.image" };
          } else {
            acc[attributeName] = { populate: "*" };
          }
        }

        break;
      }

      case 'media': {
        acc[attributeName] = { populate: "*" };
        break;
      }

      case 'component': {
        const populate = getDeepPopulate(attribute.component, opts);
        acc[attributeName] = { populate };
        break;
      }

      case 'dynamiczone': {
        // Use fragments to populate the dynamic zone components
        const populatedComponents = (attribute.components || []).reduce(
          (acc: any, componentUID: UID.Component) => {
            acc[componentUID] = { populate: getDeepPopulate(componentUID, opts) };

            return acc;
          },
          {}
        );

        acc[attributeName] = { on: populatedComponents };
        break;
      }
      default:
        break;
    }

    return acc;
  }, {});
} catch (error) {
  console.error(`Error in getDeepPopulate for UID ${uid}:`, error.message);
  return {};
}
};

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  // Add route debugging function
  const debugRoutes = () => {
    console.log('🔍 === ROUTE DEBUGGING ===');
    
    if (strapi.apis) {
      console.log(`📋 Found ${Object.keys(strapi.apis).length} APIs`);
      
      Object.entries(strapi.apis).forEach(([apiName, api]: [string, any]) => {
        console.log(`\n🔍 Processing API: ${apiName}`);
        
        if (api.routes) {
          console.log(`📋 API routes keys:`, Object.keys(api.routes));
          
          Object.entries(api.routes).forEach(([routeKey, route]: [string, any]) => {
            if (route && typeof route === 'object') {
              if (route.type === 'content-api' && !route.info) {
                console.log(`❌ API "${apiName}" has malformed route at key "${routeKey}":`, {
                  type: route.type,
                  prefix: route.prefix,
                  hasRoutes: 'routes' in route,
                  routesType: typeof route.routes
                });
              } else if (route.info && route.info.type === 'content-api') {
                console.log(`✅ API "${apiName}" has valid route at key "${routeKey}":`, {
                  method: route.method,
                  path: route.path,
                  handler: route.handler
                });
              }
            }
          });
        } else {
          console.log(`⚠️ API "${apiName}" has no routes`);
        }
      });
    }
    
    console.log('🔍 === END ROUTE DEBUGGING ===\n');
  };

  // Debug routes when middleware is initialized (after Strapi has loaded)
  setTimeout(() => {
    if (strapi.apis) {
      debugRoutes();
    }
  }, 1000);

  return async (ctx, next) => {
    // Log admin content-api route requests for debugging
    if (ctx.request.url === '/admin/content-api/routes') {
      console.log('🎯 Admin content-api routes endpoint accessed');
      console.log('🔍 About to process routes...');
      
      // Try to replicate what the content-api service does
      try {
        const routesMap = {};
        let malformedCount = 0;
        
        Object.entries(strapi.apis || {}).forEach(([apiName, api]: [string, any]) => {
          if (api.routes) {
            Object.entries(api.routes).forEach(([routeKey, route]: [string, any]) => {
              if (route && route.type === 'content-api' && !route.info) {
                malformedCount++;
                console.log(`❌ Found malformed route in API "${apiName}" key "${routeKey}":`, {
                  type: route.type,
                  hasInfo: 'info' in route,
                  hasRoutes: 'routes' in route,
                  keys: Object.keys(route)
                });
              }
            });
          }
        });
        
        console.log(`🔢 Total malformed routes found: ${malformedCount}`);
      } catch (error) {
        console.error('❌ Error during route analysis:', error.message);
      }
    }
    
    if (ctx.request.url.startsWith('/api/') && ctx.request.method === 'GET' && !ctx.query.populate && !ctx.request.url.includes('/api/users') && !ctx.request.url.includes('/api/seo')
    ) {
      try {
        strapi.log.info('Using custom Dynamic-Zone population Middleware...');

        const contentType = extractPathSegment(ctx.request.url);
        const singular = pluralize.singular(contentType)
        const uid = `api::${singular}.${singular}`;

        // Validate that the content type exists before trying to get deep populate
        if (!strapi.contentTypes[uid]) {
          console.warn(`Content type not found: ${uid}, skipping deep populate`);
          await next();
          return;
        }

        ctx.query.populate = {
          // @ts-ignores 
          ...getDeepPopulate(uid),
          ...(!ctx.request.url.includes("products") && { localizations: { populate: {} } })
        };
      } catch (error) {
        console.error('Error in deepPopulate middleware:', error.message);
        // Continue without deep populate if there's an error
      }
    }
    await next();
  };
};

