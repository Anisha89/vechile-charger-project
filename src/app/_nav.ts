import { INavData } from "@coreui/angular";
import { Organization } from "./models/organization.model";
import { User } from "./models/user.model";

export let bShowAllPanel = false;

export function setShowAllPanel(status :boolean) {
  bShowAllPanel = status;
}

const setupItems = [
  {
    name: 'Organizations',
    url: '/admin/organization',
    icon: 'fa fa-bank'
  },
  {
    name: 'Facilities',
    url: '/admin/facility',
    icon: 'fa fa-building-o'
  },
  {
    name: 'Department',
    url: '/admin/department',
    icon: 'fa fa-plug'
  },
  {
    name: 'Controller',
    url: '/admin/controller',
    icon: 'fa fa-plug'
  },
  {
    name: 'User',
    url: '/admin/user',
    icon: 'icon-user'
  },
  {
    name: 'Role',
    url: '/admin/role',
    icon: 'fa fa-truck'
  },
  {
    name: 'Assets',
    url: '/admin/asset',
    icon: 'fa fa-bank'
  },
  // {
  //   name: 'Charging Vehicles',
  //   url: '/admin/charging-vehicle',
  //   icon: 'fa fa-truck'
  // },
  // {
  //   name: 'Charging Outlet',
  //   url: '/admin/charging-outlet',
  //   icon: 'fa fa-plug'
  // },
  {
    name: 'Rule Engine',
    url: '/admin/rule-engine',
    icon: 'fa fa-cogs'
  },
  {
    name: 'Geotrack',
    url: '/geotrack',
    icon: 'icon-location-pin'
  },
];


const  featuresItems = [
  /*
  {
    name: 'Asset Dashboard',
    url: '/features/asset-dashboard',
    icon: 'icon-speedometer'
  },
  */
  {
    name: 'Asset Dashboard',
    url: '/features/assetdashboard',
    icon: 'icon-speedometer',
    badge: {
      variant: 'danger',
      text: 'New'
    }
  },
  {
    name: 'Route Planning',
    url: '/features/route-planning',
    icon: 'icon-settings'
  },
  /*{
    name: 'Diagnostics',
    url: '/diagnostics',
    icon: 'fa fa-stethoscope'
  },*/
  {
    name: 'Alarms',
    url: '/features/alarm',
    icon: 'icon-puzzle',
    badge: {
      variant: 'danger',
      text: '4'
    }
  },
  {
    name: 'Dashboard',
    url: '/features/analytics/1',
    icon: 'fa fa-pie-chart'
  },
  /*{
    name: 'Analytics 2',
    url: '/features/analytics/2',
    icon: 'icon-graph'
  },*/
  {
    name: 'Consumption Trends',
    url: '/features/analytics/3',
    icon: 'fa fa-line-chart'
  },
  {
    name: 'Diagnostics',
    url: '/features/analytics/4',
    icon: 'fa fa-stethoscope'
  },
  {
    name: 'Energy Profile',
    url: '/features/analytics/5',
    icon: 'fa fa-battery-full'
  },
];



const defaultNavItems = [
  // {
  //   title: true,
  //   name: 'Setup'
  // },
 
  {
    name: 'Map',
    url: '/map',
    icon: 'icon-location-pin'
  },

  {
    name: 'Setup',
    url: '/admin/organization',
    icon: 'icon-puzzle',
    children: setupItems,
  },
 
  {
    name: 'Features',
    ///url: '/features/asset-dashboard',
    url: '/features/assetdashboard',
    icon: 'icon-puzzle',
    children: featuresItems
  },
   
    {
      name: 'OpenEMS',
      url: 'http://66.175.238.218:8084',
      icon: 'icon-cloud-download',
      attributes: { target: '_blank', rel: 'noopener' }
    },
  
   
   
];




export function getNavItems(loggedInUserPermissions:String[]) {
  return bShowAllPanel ?  defaultNavItems : getNavItemsByFilter(loggedInUserPermissions);
}

function getNavItemsByFilter(loggedInUserPermissions:String[]) {
  let filteredSetupItems = filterItems(loggedInUserPermissions,setupItems);
  let filteredFeaturesItems= filterItems(loggedInUserPermissions,featuresItems);
  
 
  return [
      {
        name: 'Map',
        url: '/map',
        icon: 'icon-location-pin'
      },
      {
        name: 'Setup',
        url: '/admin/organization',
        icon: 'icon-puzzle',
        children: filteredSetupItems
      },
      {
        name: 'Features',
        //url: '/features/asset-dashboard',
        url: '/features/assetdashboard',
        icon: 'icon-puzzle',
        children: filteredFeaturesItems
      },
     
    
    

    
    ];
 }



 function  filterItems(loggedInUserPermissions:String[], allItems:any[]) {
    let fItems = Array<any>();
    for (let item of allItems) {
      if (loggedInUserPermissions.indexOf(item.name) >= 0) 
      {
        fItems.push(item);
      }
    }
    return fItems;
 }
