function filterByKeyValue(arr, key, value) {
    //  search an array of objects
    //  for a matching key/value
    return arr.filter(function(entry){ 
        return entry[key] == value;
    });

}