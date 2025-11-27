export const CATEGORY_MAP: Record<string, number> = {
  'water_supply': 1,                           
  'architectural_barriers': 2,                 
  'sewer_system': 3,                           
  'public_lighting': 4,                     
  'waste': 5,                                
  'road_signs_traffic_lights': 6,              
  'roads_urban_furnishings': 7,                
  'public_green_areas_playgrounds': 8,         
  'other': 9,                                  
};

export function getCategoryId(categoryName: string): number {
  const id = CATEGORY_MAP[categoryName];
  if (!id) {
    throw new Error(`Invalid category: ${categoryName}`);
  }
  return id;
}
