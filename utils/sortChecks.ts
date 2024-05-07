import { Schema } from "mongoose";

/**
 * @param n string with all values separated by " "
 * @param schema schema where the property/ies should exists in
 * @returns 0 if all the properties exists
 * @returns 1 if it at least one doesn't exist
 * @returns -1 if there is an empty space after the split
 */
export function propertyExistsIn<T extends Schema>(n:string, schema:T):number {        
    let flag:number = 0;
    n.replace(/-/g,"")
        .split(" ")
        .some(n => {
            console.log(schema.paths.hasOwnProperty(n));
            if(!schema.paths.hasOwnProperty(n)){
                if(n == "") {
                    flag = -1; 
                    return true;
                }
                flag = 1;
                return true;
            }
        });
    return flag;
}

export function isValidSort<T extends Schema>(schema: T, options: string[] | string): boolean {

    //if there isn't an options[] is valid
    if (!options.length){
        return true;
    }

    //option -> ["name", "-createdAt", ..., "date"]

    console.log("full array: "+options);
    console.log("typeof array: "+typeof options);

    //check if every string of array is a property of schema (removes - from it)
    for (let o of options){
        console.log("single value of array: "+o);
        console.log("typeof item in array: "+typeof o);
        if(!schema.paths.hasOwnProperty(o.replace(/-/g, ""))){
            return false;
        }
        console.log("__________________________________________________");
    }

    //if every option is property then is valid
    return true;
}