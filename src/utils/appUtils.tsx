

export function generateUniqId(realm,schemaName){
   const objects = realm.objects(schemaName)
   const maxID = objects.max('id')
   return maxID != null ? (maxID + 1) : 1;
}